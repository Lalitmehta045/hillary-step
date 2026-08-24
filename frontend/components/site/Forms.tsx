"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowRight } from "./Hero";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/FadeIn";
import { GradientReveal } from "@/components/motion/GradientReveal";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { m, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { contactApi } from "@/lib/api/contact";
import { applicationsApi } from "@/lib/api/applications";
import { ApiError } from "@/lib/api-client";
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { FormSuccessPopup } from "./FormSuccessPanel";

const PRACTICES = ["Engineering", "Data & AI", "Civil & Infrastructure", "Corporate"];
const LOCATIONS = ["USA", "Australia", "India"];

export function Forms() {
  return (
    <>
      {/* Contact */}
      <ContactSection />
    </>
  );
}

export function CandidacySection({ isModal = false }: { isModal?: boolean }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    linkedinUrl: "",
    practice: PRACTICES[0],
    preferredLocation: LOCATIONS[0],
    coverLetter: ""
  });
  const [file, setFile] = useState<File | null>(null);
  const [resumeData, setResumeData] = useState<{ key: string, fileName: string, fileSize: number, mimeType: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'parsing' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const turnstileTokenRef = useRef<string>('');
  const turnstileRef = useRef<TurnstileInstance>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';

  const assignTurnstileToken = (token: string) => {
    turnstileTokenRef.current = token;
  };

  const clearTurnstileToken = () => {
    turnstileTokenRef.current = '';
  };

  const refreshTurnstile = () => {
    clearTurnstileToken();
    turnstileRef.current?.reset();
  };

  /**
   * When Turnstile is configured, wait for an automatic token before upload.
   * Users can drop a resume immediately — no separate manual security step.
   */
  const ensureTurnstileToken = async (timeoutMs = 15000): Promise<string | undefined> => {
    if (!siteKey) return undefined;

    const readToken = () =>
      turnstileTokenRef.current.trim() ||
      turnstileRef.current?.getResponse()?.trim() ||
      '';

    const existing = readToken();
    if (existing) {
      assignTurnstileToken(existing);
      return existing;
    }

    return new Promise<string>((resolve, reject) => {
      const deadline = Date.now() + timeoutMs;
      const intervalId = window.setInterval(() => {
        const token = readToken();
        if (token) {
          window.clearInterval(intervalId);
          assignTurnstileToken(token);
          resolve(token);
          return;
        }
        if (Date.now() >= deadline) {
          window.clearInterval(intervalId);
          reject(new Error('Turnstile token timed out'));
        }
      }, 100);
    });
  };

  const validateAndProcessFile = async (f: File) => {
    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    const fileExt = '.' + (f.name.split('.').pop() || '').toLowerCase();

    if (!allowedExtensions.includes(fileExt)) {
      setUploadStatus('error');
      setUploadMessage('Invalid file type. Only PDF, DOC, and DOCX files are allowed.');
      alert('Invalid file type. Only PDF, DOC, and DOCX files are allowed.');
      return;
    }

    if (f.size > 5 * 1024 * 1024) {
      setUploadStatus('error');
      setUploadMessage('File exceeds 5MB size limit.');
      alert('File too large (max 5MB)');
      return;
    }

    setFile(f);
    setIsUploading(true);
    setUploadStatus('parsing');
    setUploadMessage('Parsing résumé...');

    try {
      let token: string | undefined;
      try {
        token = await ensureTurnstileToken();
      } catch {
        setUploadStatus('error');
        setUploadMessage('Security verification failed. Please try again.');
        refreshTurnstile();
        return;
      }

      if (siteKey && !token) {
        setUploadStatus('error');
        setUploadMessage('Security verification failed. Please try again.');
        refreshTurnstile();
        return;
      }

      const response = await applicationsApi.uploadResume(f, token);
      // Tokens are single-use — refresh so submit can obtain a fresh one.
      refreshTurnstile();

      setResumeData({
        key: response.key,
        fileName: response.fileName || f.name,
        fileSize: response.fileSize || f.size,
        mimeType: response.mimeType || f.type,
      });
      setUploadStatus('success');
      setUploadMessage('Resume parsed successfully');

      if (response.parsedData) {
        const parsed = response.parsedData;
        const parsedLinkedin =
          parsed.linkedinUrl || parsed.linkedin || parsed.linkedinProfile || '';
        // Prefer freshly parsed values so re-uploading another résumé replaces prior autofill.
        // Keep previous value only when the parser did not return that field.
        setFormData(prev => ({
          ...prev,
          fullName: (parsed.fullName || '').trim() || prev.fullName,
          email: (parsed.email || '').trim() || prev.email,
          phone: (parsed.phone || '').trim() || prev.phone,
          linkedinUrl: parsedLinkedin.trim() || prev.linkedinUrl,
          practice: parsed.practice && PRACTICES.includes(parsed.practice) ? parsed.practice : prev.practice,
          preferredLocation: parsed.preferredLocation && LOCATIONS.includes(parsed.preferredLocation) ? parsed.preferredLocation : prev.preferredLocation,
        }));
      }
    } catch (err: unknown) {
      console.error('Failed to parse resume', err);
      setUploadStatus('error');
      const apiErr = err instanceof ApiError ? err : null;
      const message = apiErr?.message || (err instanceof Error ? err.message : '');
      const isTurnstileFailure =
        apiErr?.status === 403 ||
        /turnstile/i.test(message) ||
        /security verification/i.test(message);

      if (isTurnstileFailure) {
        setUploadMessage('Security verification failed. Please try again.');
        refreshTurnstile();
      } else if (/malware scanner/i.test(message) || /scanner.*unavailable/i.test(message)) {
        setUploadMessage('Upload temporarily unavailable. Please try again in a moment.');
      } else {
        setUploadMessage('Unable to parse resume. Please enter your details manually.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    await validateAndProcessFile(f);
    // Allow selecting the same or another file again without a page refresh.
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    await validateAndProcessFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !resumeData) {
      alert("Please upload your résumé and wait for it to process");
      return;
    }
    
    setIsSubmitting(true);
    try {
      let token: string | undefined;
      try {
        token = await ensureTurnstileToken();
      } catch {
        alert("Security verification failed. Please try again.");
        refreshTurnstile();
        return;
      }

      if (siteKey && !token) {
        alert("Security verification failed. Please try again.");
        refreshTurnstile();
        return;
      }

      // Submit application directly with existing uploaded resume key
      await applicationsApi.submitApplication({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        linkedinProfile: formData.linkedinUrl,
        practice: formData.practice,
        preferredLocation: formData.preferredLocation,
        coverNote: formData.coverLetter,
        resumeFileKey: resumeData.key,
        resumeFileName: resumeData.fileName,
        resumeFileSize: resumeData.fileSize,
        resumeMimeType: resumeData.mimeType,
      }, token);
      
      setIsSuccess(true);
      setFile(null);
      setResumeData(null);
      setUploadStatus('idle');
      setUploadMessage('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      refreshTurnstile();
    } catch (err) {
      console.error("Failed to submit application", err);
      const apiErr = err instanceof ApiError ? err : null;
      const message = apiErr?.message || (err instanceof Error ? err.message : '');
      if (apiErr?.status === 403 || /turnstile/i.test(message)) {
        alert("Security verification failed. Please try again.");
        refreshTurnstile();
      } else {
        alert("Failed to submit. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetApplicationForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      linkedinUrl: "",
      practice: PRACTICES[0],
      preferredLocation: LOCATIONS[0],
      coverLetter: "",
    });
    setFile(null);
    setResumeData(null);
    setUploadStatus("idle");
    setUploadMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    clearTurnstileToken();
    setIsSuccess(false);
  };

  return (
    <section className={`w-full ${isModal ? "pb-[64px] max-md:pb-[40px]" : "bg-white pt-[64px] pb-[40px] max-md:pt-[40px] max-md:pb-[20px]"}`}>
      <div className={`mx-auto w-full ${isModal ? "" : "max-w-[1280px] px-[32px] max-md:px-[24px]"}`}>
        <StaggerContainer>
          <StaggerItem>
            <p className="font-display text-[12px] font-[600] leading-[16px] tracking-[1.2px] text-[#0070F3] uppercase">
              Apply · Global Talent Programme
            </p>
          </StaggerItem>

          <StaggerItem>
            <h2 className="mt-[24px] font-display text-[60px] max-md:text-[36px] max-md:leading-[40px] max-lg:text-[48px] max-lg:leading-[48px] font-[590] leading-[60px] tracking-[-1.5px] max-md:tracking-[-1px] text-[#000000]">
              Submit your <GradientReveal className="bg-gradient-to-r from-[#86EFAC] via-[#14532D] to-[#86EFAC] bg-[length:200%_auto] animate-[gradient-flow_3s_ease_infinite] bg-clip-text text-transparent">candidacy.</GradientReveal>
            </h2>
          </StaggerItem>

          <StaggerItem>
            <p className="mt-[24px] max-md:mt-[16px] max-w-[650px] font-sans text-[18px] max-md:text-[16px] max-md:leading-[24px] font-[400] leading-[28px] text-[#4B5563]">
              Every application is reviewed by a principal within the discipline. Attach a résumé (PDF
              or Word, up to 5MB) — we will respond within ten business days.
            </p>
          </StaggerItem>
        </StaggerContainer>

        <FadeIn delay={0.2} className="mx-auto mt-[48px] max-md:mt-[32px] rounded-[24px] overflow-hidden bg-gradient-to-tr from-[#00FF11] via-[#007BFF] to-[#FF6200] p-[1px] shadow-sm">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-[48px] max-md:gap-[32px] rounded-[23px] bg-[#F3F3F4] px-[48px] max-md:px-[24px] py-[48px] max-md:py-[32px] lg:grid-cols-[1fr_341px]">
            <div className="flex flex-col gap-[24px]">
              <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-2">
                <Field label="Full name" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} required />
                <Field label="Email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                <PhoneField value={formData.phone} onChange={(val: string) => setFormData({...formData, phone: val})} />
                <Field label="LinkedIn Profile" value={formData.linkedinUrl} onChange={(e) => setFormData({...formData, linkedinUrl: e.target.value})} />
                <Select label="Practice" options={PRACTICES} value={formData.practice} onChange={(val: string) => setFormData({...formData, practice: val})} />
                <Select label="Preferred Location" options={LOCATIONS} value={formData.preferredLocation} onChange={(val: string) => setFormData({...formData, preferredLocation: val})} />
              </div>

              <div>
                <Label>Cover Note</Label>
                <textarea
                  value={formData.coverLetter}
                  onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
                  placeholder="Add a cover note."
                  className="mt-[8px] w-full min-h-[170px] resize-none rounded-[16px] border border-[#E5E7EB] bg-white px-[16px] py-[12px] font-sans text-[16px] text-[#111111] placeholder:text-[#9a9a9a] shadow-sm focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF] focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex flex-col">
              {siteKey && (
                <div className="mb-[16px]">
                  <Turnstile
                    ref={turnstileRef}
                    siteKey={siteKey}
                    onSuccess={(token) => assignTurnstileToken(token)}
                    onError={() => {
                      clearTurnstileToken();
                    }}
                    onExpire={() => clearTurnstileToken()}
                    options={{
                      theme: 'light',
                      appearance: 'always',
                    }}
                  />
                </div>
              )}
              <Label>Résumé · Required</Label>
              <div
                onDragOver={handleDragOver}
                onDragEnter={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative mt-[8px] flex h-[220px] w-full cursor-pointer flex-col items-center justify-center rounded-[24px] bg-white px-[24px] py-[64px] text-center transition-colors ${
                  isDragging ? 'bg-black/[0.04]' : 'hover:bg-black/[0.02]'
                }`}
              >
                <svg className="pointer-events-none absolute inset-0 h-full w-full rounded-[24px]">
                  <defs>
                    <linearGradient id="dashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#007BFF" />
                      <stop offset="50%" stopColor="#00FF11" />
                      <stop offset="100%" stopColor="#FF6200" />
                    </linearGradient>
                  </defs>
                  <rect
                    x="1"
                    y="1"
                    width="calc(100% - 2px)"
                    height="calc(100% - 2px)"
                    rx="23"
                    fill="none"
                    stroke="url(#dashGrad)"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                  />
                </svg>
                <UploadIcon />
                <span className="mt-[16px] font-sans text-[16px] font-[500] text-[#111111]">
                  {isUploading
                    ? "Parsing résumé..."
                    : file
                    ? file.name
                    : "Drop résumé here"}
                </span>
                <span className="mt-[4px] font-sans text-[14px] text-[#4B5563]">
                  {isUploading
                    ? "Extracting information..."
                    : uploadStatus === "success"
                    ? "Resume parsed successfully"
                    : uploadStatus === "error"
                    ? uploadMessage || "Unable to parse resume. Please enter your details manually."
                    : file
                    ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                    : "or click to browse · PDF, DOC, DOCX · 5MB"}
                </span>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
              </div>

              <AnimatedButton
                type="submit"
                disabled={isSubmitting || isUploading || isSuccess}
                className="mt-[24px] flex h-[54px] w-full items-center justify-center gap-[8px] rounded-full bg-[#111111] font-sans text-[14px] font-[500] leading-[20px] text-white hover:bg-black transition-colors shadow-[0px_1px_2px_rgba(0,0,0,0.05)] disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : isUploading ? "Processing Résumé..." : "Submit Application"}
                <ArrowRight />
              </AnimatedButton>

              <p className="mx-auto mt-[16px] max-w-[258px] text-center font-sans text-[10px] leading-[15px] text-[#6B7280]">
                By submitting, you consent to Hillary Step Solutions reviewing your credentials in
                accordance with our Privacy Statement.
              </p>
            </div>
          </form>
        </FadeIn>
      </div>

      <FormSuccessPopup
        open={isSuccess}
        eyebrow="Application received"
        title={
          <>
            You&apos;re in.{" "}
            <span className="bg-gradient-to-r from-[#86EFAC] via-[#14532D] to-[#86EFAC] bg-[length:200%_auto] animate-[gradient-flow_3s_ease_infinite] bg-clip-text text-transparent">
              We&apos;ll take it from here.
            </span>
          </>
        }
        description="A principal in your practice will review your candidacy within ten business days."
        actionLabel="Submit another application"
        onAction={resetApplicationForm}
        onClose={resetApplicationForm}
      />
    </section>
  );
}

function ContactSection() {
  const [isClient, setIsClient] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    setIsClient(true);
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isClient) return null;

  return isDesktop ? <DesktopContact /> : <MobileContact />;
}

function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const resetContactForm = () => {
    setIsSuccess(false);
    setFormData({ name: "", email: "", phone: "", companyName: "", message: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isSuccess) return;
    setIsSubmitting(true);
    try {
      await contactApi.submitEnquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        companyName: formData.companyName.trim(),
        organization: formData.companyName.trim(),
        message: formData.message.trim(),
      });
      setIsSuccess(true);
      setFormData({ name: "", email: "", phone: "", companyName: "", message: "" });
    } catch (err) {
      console.error("Failed to submit contact", err);
      alert("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="h-full w-full rounded-[23px] bg-[#F3F3F4] px-[40px] max-md:px-[24px] py-[32px]">
        <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">
          <Field label="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          <Field label="Email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          <PhoneField value={formData.phone} onChange={(val: string) => setFormData({...formData, phone: val})} required />
          <Field label="Organization" value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} required />
        </div>

        <div className="mt-[16px]">
          <Label>Message</Label>
          <textarea 
            required
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            className="mt-[8px] w-full min-h-[100px] resize-none rounded-[16px] border border-[#E5E7EB] bg-white px-[16px] py-[12px] font-sans text-[16px] text-[#111111] shadow-sm focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF] focus:outline-hidden" 
          />
        </div>

        <AnimatedButton
          type="submit"
          disabled={isSubmitting || isSuccess}
          className="mt-[24px] flex h-[50px] w-fit items-center justify-center gap-[8px] rounded-full bg-[#111111] px-[32px] font-sans text-[14px] font-[500] leading-[20px] text-white hover:bg-black transition-colors shadow-[0px_1px_2px_rgba(0,0,0,0.05)] disabled:opacity-50"
        >
          {isSubmitting ? "Sending..." : isSuccess ? "Sent!" : "Send Enquiry"}
          <ArrowRight />
        </AnimatedButton>
      </form>

      <FormSuccessPopup
        open={isSuccess}
        eyebrow="Enquiry received"
        title={
          <>
            Your enquiry has been{" "}
            <span className="bg-gradient-to-r from-[#86EFAC] via-[#14532D] to-[#86EFAC] bg-[length:200%_auto] animate-[gradient-flow_3s_ease_infinite] bg-clip-text text-transparent">
              submitted successfully.
            </span>
          </>
        }
        description="Our team will review your message and get back to you shortly."
        actionLabel="Send another enquiry"
        onAction={resetContactForm}
        onClose={resetContactForm}
      />
    </>
  );
}

function DesktopContact() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const scrollRange = [0, 0.05, 0.4, 1];
  const itemLeft = useTransform(scrollYProgress, scrollRange, ["50%", "50%", "0%", "0%"]);
  const itemX = useTransform(scrollYProgress, scrollRange, ["-50%", "-50%", "0%", "0%"]);
  const formX = useTransform(scrollYProgress, scrollRange, [150, 150, 0, 0]);
  const formOpacity = useTransform(scrollYProgress, scrollRange, [0, 0, 1, 1]);
  const formPointer = useTransform(formOpacity, v => v > 0.1 ? "auto" : "none");

  return (
    <section ref={containerRef} id="contact" className="relative w-full bg-white h-[200vh]">
      <div className="sticky top-0 flex h-screen items-center">
        
        <div className="relative mx-auto flex w-full max-w-[1280px] px-[32px]">
          
          <div className="flex w-full flex-col">
            <m.div style={{ left: itemLeft, x: itemX, position: "relative" }} className="flex flex-col w-fit items-start">
              <m.p style={{ left: itemLeft, x: itemX, position: "relative" }} className="font-sans text-[12px] font-[600] leading-[16px] tracking-[1.2px] text-[#0070F3] uppercase text-left">
                CONTACT
              </m.p>
              <h2 className="mt-[24px] max-w-[560px] font-display text-[56px] font-[590] leading-[60px] tracking-[-1.5px] text-[#000000] text-left">
                Speak with us.
              </h2>
            </m.div>

            <div className="pt-[40px] w-full">
              <AddressScrub scrollYProgress={scrollYProgress} />
            </div>
          </div>

          <m.div
            style={{ x: formX, opacity: formOpacity, z: 0, pointerEvents: formPointer as any }}
            className="w-[560px] shrink-0 rounded-[24px] overflow-hidden bg-gradient-to-br from-[#007BFF] via-[#00FF11] to-[#FF6200] p-[1px] shadow-sm absolute right-[32px] top-1/2 -translate-y-1/2"
          >
            <ContactForm />
          </m.div>
        </div>
      </div>
    </section>
  );
}

function MobileContact() {
  return (
    <section id="contact" className="relative w-full bg-white pt-[60px] pb-[80px]">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-[48px] px-[24px]">

        <div className="flex w-full flex-col">
          <div className="flex flex-col w-full items-center">
            <p className="font-sans text-[12px] font-[600] leading-[16px] tracking-[1.2px] text-[#0070F3] uppercase text-center">
              CONTACT
            </p>
            <h2 className="mt-[24px] font-display text-[36px] leading-[40px] font-[590] tracking-[-1px] text-[#000000] text-center">
              Speak with us.
            </h2>
          </div>

          <div className="pt-[40px] w-full flex flex-col gap-[32px]">
            <Address label="Head Office" lines={["E-842, 8th Floor, Gaur Global Village", "GH Plot No. 4, Crossings Republik", "Ghaziabad, Uttar Pradesh – 201016", "GSTIN: 09AAFCH2272R1ZZ"]} />
            <Address label="Branch Office" lines={["49/A, Near Sai Palace Barat Ghar", "Pawan Bhoomi, Shaktinagar", "Jabalpur, Madhya Pradesh – 482001", "GSTIN: 23AAFCH2272R1Z9"]} />
            <Address label="South Asia" lines={["Maker Maxity, BKC", "Mumbai 400051 · India"]} />
            <Address label="General Enquiries" lines={["info@hillarystepsolutions.com"]} />
          </div>
        </div>

        <div className="w-full shrink-0 rounded-[24px] overflow-hidden bg-gradient-to-br from-[#007BFF] via-[#00FF11] to-[#FF6200] p-[1px] shadow-sm">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

function AddressScrub({ scrollYProgress }: { scrollYProgress: any }) {
  const scrollRange = [0, 0.05, 0.4, 1];

  const a0_x = useTransform(scrollYProgress, scrollRange, [0, 0, 0, 0]);
  const a0_y = useTransform(scrollYProgress, scrollRange, [0, 0, 0, 0]);

  const a1_x = useTransform(scrollYProgress, scrollRange, [328, 328, 0, 0]);
  const a1_y = useTransform(scrollYProgress, scrollRange, [0, 0, 136, 136]);

  const a2_x = useTransform(scrollYProgress, scrollRange, [656, 656, 0, 0]);
  const a2_y = useTransform(scrollYProgress, scrollRange, [0, 0, 272, 272]);

  const a3_x = useTransform(scrollYProgress, scrollRange, [984, 984, 0, 0]);
  const a3_y = useTransform(scrollYProgress, scrollRange, [0, 0, 352, 352]);

  const width = useTransform(scrollYProgress, scrollRange, ["296px", "296px", "560px", "560px"]);

  return (
    <div className="relative w-full h-[420px]">
      <m.div style={{ x: a0_x, y: a0_y, z: 0, width }} className="absolute top-0 left-0">
        <Address label="Head Office" lines={["E-842, 8th Floor, Gaur Global Village", "GH Plot No. 4, Crossings Republik", "Ghaziabad, Uttar Pradesh – 201016", "GSTIN: 09AAFCH2272R1ZZ"]} />
      </m.div>
      <m.div style={{ x: a1_x, y: a1_y, z: 0, width }} className="absolute top-0 left-0">
        <Address label="Branch Office" lines={["49/A, Near Sai Palace Barat Ghar", "Pawan Bhoomi, Shaktinagar", "Jabalpur, Madhya Pradesh – 482001", "GSTIN: 23AAFCH2272R1Z9"]} />
      </m.div>
      <m.div style={{ x: a2_x, y: a2_y, z: 0, width }} className="absolute top-0 left-0">
        <Address label="South Asia" lines={["Maker Maxity, BKC", "Mumbai 400051 · India"]} />
      </m.div>
      <m.div style={{ x: a3_x, y: a3_y, z: 0, width }} className="absolute top-0 left-0">
        <Address label="General Enquiries" lines={["info@hillarystepsolutions.com"]} />
      </m.div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="block font-sans text-[12px] font-[600] uppercase tracking-[1.2px] text-[#8B8B8B]">
      {children}
    </span>
  );
}

function Field({ label, type = "text", value, onChange, required }: { label: string; type?: string; value?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean }) {
  return (
    <div className="min-w-0">
      <Label>{label}</Label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="mt-[8px] h-[50px] w-full rounded-[16px] border border-[#E5E7EB] bg-white px-[16px] font-sans text-[16px] text-[#111111] shadow-sm focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF] focus:outline-hidden"
      />
    </div>
  );
}

function Select({ label, options, value, onChange }: { label: string; options: readonly string[]; value?: string; onChange?: (v: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = value || options[0];
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-w-0" ref={dropdownRef}>
      <Label>{label}</Label>
      <div className="relative mt-[8px]">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex h-[50px] w-full items-center justify-between rounded-[16px] border bg-white px-[16px] font-sans text-[16px] text-[#111111] shadow-sm transition-all focus:outline-hidden ${isOpen ? "border-[#007BFF] ring-1 ring-[#007BFF]" : "border-[#E5E7EB] hover:border-[#d1d5db]"}`}
        >
          {selected}
          <svg
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4a4a4a"
            strokeWidth="1.8"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-full overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white py-[8px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] transform-gpu animate-in fade-in slide-in-from-top-2 duration-200">
            {options.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => {
                  if (onChange) onChange(o);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center px-[16px] py-[10px] text-left font-sans text-[15px] transition-colors ${selected === o ? "bg-[#F8F9FB] text-[#007BFF] font-[500]" : "text-[#111111] hover:bg-[#F8F9FB] hover:text-[#007BFF]"}`}
              >
                {o}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PhoneField({ value, onChange, required }: { value?: string; onChange?: (v: string) => void; required?: boolean }) {
  const COUNTRY_CODES = ["+1 (USA)", "+91 (IND)", "+61 (AUS)"];
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(COUNTRY_CODES[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Extract just the phone number part if value is structured
  const displayValue = value ? value.replace(/^\+\d+\s*\(\w+\)\s*/, "") : "";

  useEffect(() => {
    if (value) {
      if (value.startsWith("+91")) setSelected(COUNTRY_CODES[1]);
      else if (value.startsWith("+61")) setSelected(COUNTRY_CODES[2]);
      else if (value.startsWith("+1")) setSelected(COUNTRY_CODES[0]);
      else {
        // Bare 10-digit Indian mobile from parser
        const digits = value.replace(/\D/g, "");
        if (/^[6-9]\d{9}$/.test(digits)) setSelected(COUNTRY_CODES[1]);
      }
    }
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-w-0">
      <Label>Phone</Label>
      <div className="mt-[8px] flex h-[50px] w-full rounded-[16px] border border-[#E5E7EB] bg-white shadow-sm focus-within:border-[#007BFF] focus-within:ring-1 focus-within:ring-[#007BFF]">
        <div className="relative flex items-center border-r border-[#E5E7EB] bg-[#F8F9FB] rounded-l-[16px]" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-full items-center justify-between gap-[8px] pl-[12px] pr-[12px] font-sans text-[14px] text-[#111111] focus:outline-hidden whitespace-nowrap"
          >
            {selected}
            <svg
              className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4a4a4a"
              strokeWidth="1.8"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-[140px] overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white py-[8px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] transform-gpu animate-in fade-in slide-in-from-top-2 duration-200">
              {COUNTRY_CODES.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    setSelected(code);
                    if (onChange) onChange(`${code} ${displayValue}`);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center px-[16px] py-[10px] text-left font-sans text-[14px] transition-colors ${selected === code ? "bg-[#F8F9FB] text-[#007BFF] font-[500]" : "text-[#111111] hover:bg-[#F8F9FB] hover:text-[#007BFF]"}`}
                >
                  {code}
                </button>
              ))}
            </div>
          )}
        </div>
        <input
          type="tel"
          required={required}
          value={displayValue}
          onChange={(e) => {
            if (onChange) onChange(`${selected} ${e.target.value}`);
          }}
          className="h-full min-w-0 flex-1 bg-transparent px-[16px] font-sans text-[16px] text-[#111111] focus:outline-hidden rounded-r-[16px]"
        />
      </div>
    </div>
  );
}

function Address({ label, lines, layout, transition }: { label: string; lines: string[]; layout?: boolean; transition?: any }) {
  return (
    <m.div layout={layout} transition={transition} className="flex flex-col gap-[8px]">
      <Label>{label}</Label>
      <div className="flex flex-col">
        {lines.map((l) => (
          <p key={l} className="font-sans text-[16px] leading-[24px] text-[#111111]">
            {l}
          </p>
        ))}
      </div>
    </m.div>
  );
}

function UploadIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#111"
      strokeWidth="1.7"
      strokeLinecap="round"
    >
      <path d="M12 17V4M12 4l-5 5M12 4l5 5M4 19h16" />
    </svg>
  );
}
