"use client";

import { useState, useRef, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";
import { CandidacySection } from "./Forms";
import { jobsApi, type JobDocumentMeta } from "@/lib/api/jobs";
import { ApiError } from "@/lib/api-client";

const MAX_DOCUMENTS = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];

const STEPS = [
  {
    id: "job-title",
    label: "Job Title",
    description: "Add the most relevant job title for the position you want to fill.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    id: "role-specification",
    label: "Role Specification",
    description: "Define the skills, experience, and qualifications required.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M8 7h8" />
        <path d="M8 12h8" />
        <path d="M8 17h5" />
      </svg>
    ),
  },
  {
    id: "location",
    label: "Location",
    description: "Specify the work location or remote preference.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    id: "job-description",
    label: "Job Description",
    description: "Write a detailed description of the role and responsibilities.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <path d="M10 13h4" />
        <path d="M10 17h4" />
        <path d="M10 9h1" />
      </svg>
    ),
  },
  {
    id: "documentation",
    label: "Documentation",
    description: "Upload any supporting documents or attachments.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <path d="M12 18v-6" />
        <path d="m9 15 3-3 3 3" />
      </svg>
    ),
  },
];

export function GlobalStaffingContent({ isModal = false }: { isModal?: boolean }) {
  const [activeTab, setActiveTab] = useState<"post" | "find">("post");
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);
  const turnstileTokenRef = useRef<string | null>(null);
  const documentsRef = useRef<JobDocumentMeta[]>([]);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
  const [formData, setFormData] = useState({
    title: "",
    organizationName: "",
    type: "",
    experienceLevel: "",
    skills: "",
    country: "",
    city: "",
    workMode: "",
    description: "",
    requirements: "",
  });
  const [documents, setDocuments] = useState<JobDocumentMeta[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const syncDocuments = (next: JobDocumentMeta[]) => {
    documentsRef.current = next;
    setDocuments(next);
  };

  const assignTurnstileToken = (token: string) => {
    turnstileTokenRef.current = token;
  };

  const clearTurnstileToken = () => {
    turnstileTokenRef.current = null;
  };

  const refreshTurnstile = () => {
    clearTurnstileToken();
    turnstileRef.current?.reset();
  };

  const ensureTurnstileToken = async (timeoutMs = 15000): Promise<string | undefined> => {
    if (!siteKey) return undefined;
    const existing = turnstileTokenRef.current?.trim();
    if (existing) return existing;

    return new Promise((resolve, reject) => {
      const started = Date.now();
      const tick = () => {
        const token = turnstileTokenRef.current?.trim();
        if (token) {
          resolve(token);
          return;
        }
        if (Date.now() - started >= timeoutMs) {
          reject(new Error("Turnstile token timed out"));
          return;
        }
        requestAnimationFrame(tick);
      };
      tick();
    });
  };

  // Auto-scroll active step tab into view on mobile
  useEffect(() => {
    const activeBtn = stepRefs.current[activeStep];
    if (activeBtn) {
      activeBtn.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeStep]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const uploadDocumentFile = async (file: File): Promise<boolean> => {
    const fileExt = "." + (file.name.split(".").pop() || "").toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(fileExt)) {
      setUploadMessage("Invalid file type. Only PDF, DOC, and DOCX are allowed.");
      setErrorMessage("Invalid file type. Only PDF, DOC, and DOCX are allowed.");
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      setUploadMessage("File exceeds 5MB size limit.");
      setErrorMessage("File too large (max 5MB).");
      return false;
    }
    if (documentsRef.current.length >= MAX_DOCUMENTS) {
      setUploadMessage(`You can upload up to ${MAX_DOCUMENTS} documents.`);
      setErrorMessage(`You can upload up to ${MAX_DOCUMENTS} documents.`);
      return false;
    }

    setIsUploadingDoc(true);
    setUploadMessage("Uploading…");
    setErrorMessage("");

    try {
      let token: string | undefined;
      try {
        token = await ensureTurnstileToken();
      } catch {
        setUploadMessage("Security verification failed. Please try again.");
        setErrorMessage("Security verification failed. Please try again.");
        refreshTurnstile();
        return false;
      }

      if (siteKey && !token) {
        setUploadMessage("Security verification failed. Please try again.");
        setErrorMessage("Security verification failed. Please try again.");
        refreshTurnstile();
        return false;
      }

      const response = await jobsApi.uploadDocument(file, token);
      refreshTurnstile();

      if (documentsRef.current.length >= MAX_DOCUMENTS) {
        setUploadMessage(`You can upload up to ${MAX_DOCUMENTS} documents.`);
        setErrorMessage(`You can upload up to ${MAX_DOCUMENTS} documents.`);
        return false;
      }

      syncDocuments([
        ...documentsRef.current,
        {
          key: response.key,
          fileName: response.fileName || file.name,
          fileSize: response.fileSize || file.size,
          mimeType: response.mimeType || file.type,
        },
      ]);
      setUploadMessage("Document uploaded");
      return true;
    } catch (err: unknown) {
      console.error("Failed to upload document", err);
      const apiErr = err instanceof ApiError ? err : null;
      const message = apiErr?.message || (err instanceof Error ? err.message : "");
      const isTurnstileFailure =
        apiErr?.status === 403 ||
        /turnstile/i.test(message) ||
        /security verification/i.test(message);

      if (isTurnstileFailure) {
        setUploadMessage("Security verification failed. Please try again.");
        setErrorMessage("Security verification failed. Please try again.");
        refreshTurnstile();
      } else {
        const msg = message || "Unable to upload document. Please try again.";
        setUploadMessage(msg);
        setErrorMessage(msg);
      }
      return false;
    } finally {
      setIsUploadingDoc(false);
    }
  };

  const handleDocFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    for (const file of files) {
      const ok = await uploadDocumentFile(file);
      if (!ok && documentsRef.current.length >= MAX_DOCUMENTS) break;
    }
  };

  const handleDocDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDocDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDocDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files || []);
    for (const file of files) {
      await uploadDocumentFile(file);
    }
  };

  const removeDocument = (key: string) => {
    syncDocuments(documentsRef.current.filter((d) => d.key !== key));
    setUploadMessage("");
  };

  const handleNext = async () => {
    if (activeStep === 0 && !formData.title.trim()) {
      setErrorMessage("Please enter a Job Title before proceeding.");
      return;
    }
    setErrorMessage("");

    if (activeStep < STEPS.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      if (!formData.title.trim()) {
        setActiveStep(0);
        setErrorMessage("Please enter a Job Title.");
        return;
      }

      if (isUploadingDoc) {
        setErrorMessage("Please wait for document upload to finish.");
        return;
      }

      setIsSubmitting(true);
      setErrorMessage("");

      const countryMap: Record<string, string> = {
        us: "United States",
        au: "Australia",
        in: "India",
        "United States": "United States",
        "Australia": "Australia",
        "India": "India",
      };
      const roleTypeMap: Record<string, string> = {
        "full-time": "Full-Time",
        "part-time": "Part-Time",
        "contract": "Contract",
        "internship": "Internship",
      };
      const expMap: Record<string, string> = {
        entry: "Entry Level (0-2 years)",
        mid: "Mid Level (3-5 years)",
        senior: "Senior Level (5-8 years)",
        lead: "Lead / Principal (8+ years)",
      };

      try {
        await jobsApi.createPublicJob({
          jobTitle: formData.title.trim(),
          organizationName: formData.organizationName.trim() || undefined,
          roleType: roleTypeMap[formData.type] || formData.type || undefined,
          experienceLevel: expMap[formData.experienceLevel] || formData.experienceLevel || undefined,
          country: countryMap[formData.country] || formData.country || undefined,
          city: formData.city.trim() || undefined,
          jobDescription: formData.description.trim() || undefined,
          documents: documents.length
            ? documents.map((d) => ({
                key: d.key,
                fileName: d.fileName,
                fileSize: d.fileSize,
                mimeType: d.mimeType,
              }))
            : undefined,
        });
        setSubmitSuccess(true);
      } catch (err: any) {
        console.error("Failed to post job", err);
        const msg = err?.message || "Failed to submit job posting. Please try again.";
        setErrorMessage(msg);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    setErrorMessage("");
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  return (
    <div className={`w-full font-display ${isModal ? "px-[80px] pt-[80px] pb-[80px] max-md:px-[24px]" : "pt-[100px] max-md:pt-[110px]"}`}>
      {/* Modal Specific Top Header */}
      {isModal && (
        <div className="mb-[64px]">
          <p className="text-[14px] font-[600] tracking-wide text-[#3AF900] uppercase mb-[12px]">
            Global Staffing
          </p>
          <h2 className="font-display text-[48px] font-[700] leading-[1.1] tracking-[-1px] text-[#111111] mb-[20px]">
            <span className="bg-gradient-to-r from-[#86EFAC] via-[#14532D] to-[#86EFAC] bg-[length:200%_auto] animate-[gradient-flow_3s_ease_infinite] bg-clip-text text-transparent">Global Talent.</span> Local<br />Understanding.
          </h2>
          <p className="text-[18px] leading-[28px] text-[#6B7280] max-w-[700px]">
            We connect businesses with qualified professionals across markets, helping organizations build reliable teams without the complexity of international hiring.
          </p>
        </div>
      )}

      {/* Toggle Buttons */}
      <div className="flex justify-center mb-[48px] max-md:mb-[32px]">
        <div className="relative flex w-[320px] rounded-full bg-[#F3F3F4] p-[4px]">
          {/* Animated Background */}
          <m.div
            className="absolute top-[4px] bottom-[4px] w-[156px] rounded-full bg-white shadow-[0px_2px_8px_rgba(0,0,0,0.06)]"
            initial={false}
            animate={{ x: activeTab === "post" ? 0 : 156 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />

          <button
            type="button"
            onClick={() => setActiveTab("post")}
            className={`relative z-10 flex-1 rounded-full py-[12px] text-center font-sans text-[15px] font-[600] transition-colors duration-200 ${activeTab === "post" ? "text-[#111111]" : "text-[#6B7280] hover:text-[#111111]"}`}
          >
            Post a Job
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("find")}
            className={`relative z-10 flex-1 rounded-full py-[12px] text-center font-sans text-[15px] font-[600] transition-colors duration-200 ${activeTab === "find" ? "text-[#111111]" : "text-[#6B7280] hover:text-[#111111]"}`}
          >
            Find a Job
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "find" && (
          <m.div
            key="find"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Candidacy */}
            <CandidacySection isModal={isModal} />
          </m.div>
        )}

        {activeTab === "post" && (
          <m.div
            key="post"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Title */}
            <div className={`${isModal ? "mb-[48px] text-center" : "mb-[40px] max-md:mb-[28px] text-center"}`}>
              <h2 className={`${isModal ? "text-[36px] leading-[44px] tracking-[-0.5px]" : "text-[44px] max-md:text-[28px] leading-[52.8px] max-md:leading-[36px] tracking-[-1.1px] max-md:tracking-[-0.5px]"} font-[700] text-[#111111]`}>
                <span className="bg-gradient-to-r from-[#86EFAC] via-[#14532D] to-[#86EFAC] bg-[length:200%_auto] animate-[gradient-flow_3s_ease_infinite] bg-clip-text text-transparent">Post a Job</span> Find the Right Talent.
              </h2>
            </div>

            {/* Layout wrapper */}
            <div className={`flex ${isModal ? "flex-row max-md:flex-col gap-[48px] items-stretch" : "gap-[48px] max-md:flex-col max-md:gap-[24px] items-start"}`}>

        {/* Left Sidebar - Steps */}
        <div className={`${isModal ? "w-[320px] max-md:w-full shrink-0 flex flex-col max-md:flex-row gap-[12px] max-md:overflow-x-auto max-md:snap-x [&::-webkit-scrollbar]:hidden" : "w-[400px] max-md:w-[100vw] max-md:-mx-[16px] max-md:px-[16px] shrink-0 self-start flex flex-col max-md:flex-row gap-[8px] max-md:overflow-x-auto max-md:snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"}`}>
          {STEPS.map((step, index) => {
            const isActive = index === activeStep;

            if (isModal) {
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(index)}
                  className={`flex flex-col items-start gap-[12px] p-[24px] max-md:px-[20px] max-md:py-[12px] rounded-[12px] text-left transition-colors relative overflow-hidden ${isActive ? "bg-[#E1EFFA] text-[#111111]" : "text-[#4B5563] hover:text-[#111111] hover:bg-black/5"
                    }`}
                  title={step.label}
                >
                  <div className="flex items-center gap-[16px]">
                    <span className="shrink-0">{step.icon}</span>
                    <span className={`text-[18px] font-[600] leading-tight ${isActive ? "text-[#111111]" : ""}`}>{step.label}</span>
                  </div>
                  {isActive && (
                    <m.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-[15px] leading-[22px] text-[#6B7280] max-md:hidden mt-[8px]"
                    >
                      {step.description}
                    </m.p>
                  )}
                  {isActive && (
                    <m.div
                      layoutId="modal-active-border"
                      className="absolute bottom-0 left-0 right-0 h-[4px]"
                      style={{
                        background: "linear-gradient(90deg, #1A6CFF, #3AF900, #FF9500)",
                        borderRadius: "0 0 12px 12px",
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              );
            }

            return (
              <m.button
                layout
                key={step.id}
                ref={(el) => { stepRefs.current[index] = el; }}
                type="button"
                onClick={() => setActiveStep(index)}
                className={`relative overflow-hidden flex w-full max-md:w-auto max-md:shrink-0 max-md:snap-start items-start max-md:items-center text-left transition-all duration-500 ease-out ${isActive
                  ? "gap-[16px] max-md:gap-[8px] p-[24px] pb-[28px] max-md:py-[12px] max-md:px-[20px] rounded-[16px] max-md:rounded-full bg-[#E1EFFA]"
                  : "gap-[12px] max-md:gap-[8px] px-[24px] py-[20px] max-md:py-[12px] max-md:px-[20px] rounded-[12px] max-md:rounded-full hover:bg-gray-50/50 max-md:bg-[#FAFBFC] max-md:border max-md:border-[#E5E7EB]"
                  }`}
              >
                <m.span layout="position" className={`shrink-0 text-[#111111] ${isActive ? "mt-[2px] max-md:mt-0" : ""}`}>
                  {/* Keep icon large for non-modal */}
                  <svg width="20" height="20" viewBox={step.icon.props.viewBox} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    {step.icon.props.children}
                  </svg>
                </m.span>

                <div className={`min-w-0 flex-1 flex flex-col justify-start max-md:justify-center ${isActive ? "min-h-[104px] max-md:min-h-0" : ""}`}>
                  <m.p layout="position" className={`font-display font-[600] text-[#111111] max-md:whitespace-nowrap transition-all duration-300 ${isActive
                    ? "text-[20px] max-md:text-[15px] leading-[28px] max-md:leading-tight"
                    : "text-[17px] max-md:text-[15px] leading-[22px] max-md:leading-tight"
                    }`}>
                    {step.label}
                  </m.p>

                  <AnimatePresence initial={false}>
                    {isActive && (
                      <m.p
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="font-display text-[15px] font-[400] leading-[24px] text-[#4B5563] max-md:hidden max-w-[240px] overflow-hidden"
                      >
                        {step.description}
                      </m.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Gradient bottom border */}
                {isActive && (
                  <m.div
                    layoutId="active-gradient-border"
                    className="absolute bottom-0 left-0 right-0 h-[4px] max-md:hidden"
                    style={{
                      background: "linear-gradient(90deg, #1A6CFF, #3AF900, #FF9500)",
                      borderRadius: "0 0 16px 16px",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </m.button>
            );
          })}
        </div>

        {/* Right Form Card */}
        <div className={`${isModal ? "flex-1 min-w-0" : "flex-1 min-w-0 max-md:w-full"}`}>
          <div className={`${isModal ? "rounded-[16px] border border-[#E5E7EB] bg-white p-[32px] shadow-[0_2px_8px_0px_rgba(0,0,0,0.04)] flex flex-col min-h-[500px] h-full" : "rounded-[23px] border border-[#E5E7EB] bg-white p-[32px] max-md:p-[20px] shadow-[0_4px_20px_0px_rgba(0,0,0,0.04)] flex flex-col min-h-[560px] max-md:min-h-0"}`}>
            {submitSuccess ? (
              <div className="flex flex-col items-center justify-center text-center py-12 px-4 flex-1 my-auto">
                <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-6 shadow-sm">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-[#111111] mb-2 font-display">
                  Job Submitted Successfully
                </h2>
                <p className="text-[#4B5563] max-w-[460px] text-sm leading-relaxed mb-8 font-sans">
                  Your position for <span className="font-semibold text-[#111111]">{formData.title}</span> {formData.organizationName ? `at ${formData.organizationName}` : ''} has been submitted. Our recruitment team will review your specifications and get in touch shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      title: "",
                      organizationName: "",
                      type: "",
                      experienceLevel: "",
                      skills: "",
                      country: "",
                      city: "",
                      workMode: "",
                      description: "",
                      requirements: "",
                    });
                    syncDocuments([]);
                    setUploadMessage("");
                    setActiveStep(0);
                    setSubmitSuccess(false);
                    setErrorMessage("");
                  }}
                  className="px-8 py-3 bg-[#002868] text-white rounded-lg text-sm font-semibold hover:bg-[#002868]/90 transition-colors shadow-sm"
                >
                  Post Another Position
                </button>
              </div>
            ) : (
              <>
                <h2 className={`font-display font-[400] text-[#002868] ${isModal ? "text-[20px] leading-[28px] tracking-tight" : "text-[24px] leading-[32px] tracking-[-0.24px]"}`}>
                  {activeStep === 0 && "Post a New Position"}
                  {activeStep === 1 && "Role Specification"}
                  {activeStep === 2 && "Location Details"}
                  {activeStep === 3 && "Job Description"}
                  {activeStep === 4 && "Upload Documentation"}
                </h2>

                {errorMessage && (
                  <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                    {errorMessage}
                  </div>
                )}

                {isModal && <div className="h-[1px] w-full bg-[#E5E7EB] my-[16px]" />}

                <div className={`flex flex-col flex-1 ${isModal ? "gap-[20px]" : "mt-[32px] gap-[24px]"}`}>
                  <AnimatePresence mode="wait">
                    <m.div
                      key={activeStep}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className={`flex flex-col w-full ${isModal ? "gap-[20px]" : "gap-[24px]"}`}
                    >
                      {/* Step 0: Job Title */}
                      {activeStep === 0 && (
                        <>
                          <div className="flex flex-col gap-[8px]">
                            <label className={`font-display font-[400] text-[#374151] ${isModal ? "text-[14px] leading-[18px]" : "text-[13px] leading-[16px]"}`}>
                              Job Title <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Senior Backend Engineer"
                              value={formData.title}
                              onChange={(e) => handleInputChange("title", e.target.value)}
                              className={`w-full rounded-[10px] border border-[#E5E7EB] bg-[#F8F9FB] px-[16px] font-display font-[400] text-[#111111] placeholder-[#9CA3AF] outline-none transition-all duration-200 focus:border-[#1A6CFF] focus:bg-white focus:ring-2 focus:ring-[#1A6CFF]/10 ${isModal ? "h-[48px] text-[14px]" : "h-[40px] text-[13px] py-[10px]"}`}
                            />
                          </div>
                          <div className="flex flex-col gap-[8px]">
                            <label className={`font-display font-[400] text-[#374151] ${isModal ? "text-[14px] leading-[18px]" : "text-[13px] leading-[16px]"}`}>
                              Organization Name
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Company Inc."
                              value={formData.organizationName}
                              onChange={(e) => handleInputChange("organizationName", e.target.value)}
                              className={`w-full rounded-[10px] border border-[#E5E7EB] bg-[#F8F9FB] px-[16px] font-display font-[400] text-[#111111] placeholder-[#9CA3AF] outline-none transition-all duration-200 focus:border-[#1A6CFF] focus:bg-white focus:ring-2 focus:ring-[#1A6CFF]/10 ${isModal ? "h-[48px] text-[14px]" : "h-[40px] text-[13px] py-[10px]"}`}
                            />
                          </div>
                        </>
                      )}

                      {/* Step 1: Role Specification */}
                      {activeStep === 1 && (
                        <>
                          <div className="flex flex-col gap-[8px]">
                            <label className={`font-display font-[400] text-[#374151] ${isModal ? "text-[14px] leading-[18px]" : "text-[13px] leading-[16px]"}`}>
                              Role Type
                            </label>
                            <select
                              value={formData.type}
                              onChange={(e) => handleInputChange("type", e.target.value)}
                              className={`w-full rounded-[10px] border border-[#E5E7EB] bg-[#F8F9FB] px-[16px] font-display font-[400] text-[#111111] outline-none transition-all duration-200 focus:border-[#1A6CFF] focus:bg-white focus:ring-2 focus:ring-[#1A6CFF]/10 ${isModal ? "h-[48px] text-[14px]" : "h-[40px] text-[13px] py-[10px]"}`}
                            >
                              <option value="">Select role type</option>
                              <option value="Full-Time">Full-Time</option>
                              <option value="Part-Time">Part-Time</option>
                              <option value="Contract">Contract</option>
                              <option value="Internship">Internship</option>
                            </select>
                          </div>
                          <div className="flex flex-col gap-[8px]">
                            <label className={`font-display font-[400] text-[#374151] ${isModal ? "text-[14px] leading-[18px]" : "text-[13px] leading-[16px]"}`}>
                              Experience Level
                            </label>
                            <select
                              value={formData.experienceLevel}
                              onChange={(e) => handleInputChange("experienceLevel", e.target.value)}
                              className={`w-full rounded-[10px] border border-[#E5E7EB] bg-[#F8F9FB] px-[16px] font-display font-[400] text-[#111111] outline-none transition-all duration-200 focus:border-[#1A6CFF] focus:bg-white focus:ring-2 focus:ring-[#1A6CFF]/10 ${isModal ? "h-[48px] text-[14px]" : "h-[40px] text-[13px] py-[10px]"}`}
                            >
                              <option value="">Select experience level</option>
                              <option value="Entry Level (0-2 years)">Entry Level (0-2 years)</option>
                              <option value="Mid Level (3-5 years)">Mid Level (3-5 years)</option>
                              <option value="Senior Level (5-8 years)">Senior Level (5-8 years)</option>
                              <option value="Lead / Principal (8+ years)">Lead / Principal (8+ years)</option>
                            </select>
                          </div>
                        </>
                      )}

                      {/* Step 2: Location */}
                      {activeStep === 2 && (
                        <>
                          <div className="flex flex-col gap-[8px]">
                            <label className={`font-display font-[400] text-[#374151] ${isModal ? "text-[14px] leading-[18px]" : "text-[13px] leading-[16px]"}`}>
                              Country
                            </label>
                            <select
                              value={formData.country}
                              onChange={(e) => handleInputChange("country", e.target.value)}
                              className={`w-full rounded-[10px] border border-[#E5E7EB] bg-[#F8F9FB] px-[16px] font-display font-[400] text-[#111111] outline-none transition-all duration-200 focus:border-[#1A6CFF] focus:bg-white focus:ring-2 focus:ring-[#1A6CFF]/10 ${isModal ? "h-[48px] text-[14px]" : "h-[40px] text-[13px] py-[10px]"}`}
                            >
                              <option value="">Select country</option>
                              <option value="United States">United States</option>
                              <option value="Australia">Australia</option>
                              <option value="India">India</option>
                            </select>
                          </div>
                          <div className="flex flex-col gap-[8px]">
                            <label className={`font-display font-[400] text-[#374151] ${isModal ? "text-[14px] leading-[18px]" : "text-[13px] leading-[16px]"}`}>
                              City
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. New York, Sydney, Mumbai"
                              value={formData.city}
                              onChange={(e) => handleInputChange("city", e.target.value)}
                              className={`w-full rounded-[10px] border border-[#E5E7EB] bg-[#F8F9FB] px-[16px] font-display font-[400] text-[#111111] placeholder-[#9CA3AF] outline-none transition-all duration-200 focus:border-[#1A6CFF] focus:bg-white focus:ring-2 focus:ring-[#1A6CFF]/10 ${isModal ? "h-[48px] text-[14px]" : "h-[40px] text-[13px] py-[10px]"}`}
                            />
                          </div>
                        </>
                      )}

                      {/* Step 3: Job Description */}
                      {activeStep === 3 && (
                        <div className="flex flex-col gap-[8px]">
                          <label className={`font-display font-[400] text-[#374151] ${isModal ? "text-[14px] leading-[18px]" : "text-[13px] leading-[16px]"}`}>
                            Job Description
                          </label>
                          <textarea
                            placeholder="Describe the role..."
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            rows={isModal ? 6 : 5}
                            className={`w-full rounded-[10px] border border-[#E5E7EB] bg-[#F8F9FB] px-[16px] py-[16px] font-display font-[400] text-[#111111] placeholder-[#9CA3AF] outline-none transition-all duration-200 focus:border-[#1A6CFF] focus:bg-white focus:ring-2 focus:ring-[#1A6CFF]/10 resize-none ${isModal ? "text-[14px] leading-[22px]" : "text-[13px] leading-[20px]"}`}
                          />
                        </div>
                      )}

                      {/* Step 4: Documentation */}
                      {activeStep === 4 && (
                        <div className="flex flex-col gap-[12px]">
                          <label className={`font-display font-[400] text-[#374151] ${isModal ? "text-[14px] leading-[18px]" : "text-[13px] leading-[16px]"}`}>
                            Upload Documents (Optional)
                          </label>
                          {siteKey && (
                            <div className="mb-[4px]">
                              <Turnstile
                                ref={turnstileRef}
                                siteKey={siteKey}
                                onSuccess={(token) => assignTurnstileToken(token)}
                                onError={() => clearTurnstileToken()}
                                onExpire={() => clearTurnstileToken()}
                                options={{
                                  theme: "light",
                                  appearance: "always",
                                }}
                              />
                            </div>
                          )}
                          <div
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                if (!isUploadingDoc) fileInputRef.current?.click();
                              }
                            }}
                            onDragOver={handleDocDragOver}
                            onDragEnter={handleDocDragOver}
                            onDragLeave={handleDocDragLeave}
                            onDrop={handleDocDrop}
                            onClick={() => {
                              if (!isUploadingDoc) fileInputRef.current?.click();
                            }}
                            className={`flex w-full cursor-pointer flex-col items-center justify-center gap-[12px] rounded-[10px] border-2 border-dashed px-[24px] transition-colors ${
                              isDragging
                                ? "border-[#1A6CFF] bg-[#1A6CFF]/[0.04]"
                                : "border-[#D1D5DB] bg-[#FAFBFC] hover:border-[#1A6CFF]/40 hover:bg-[#1A6CFF]/[0.02]"
                            } ${isModal ? "min-h-[180px] py-[32px]" : "min-h-[160px] py-[32px]"} ${isUploadingDoc ? "pointer-events-none opacity-70" : ""}`}
                          >
                            <p className={`font-display font-[500] text-[#374151] text-center ${isModal ? "text-[14px]" : "text-[13px]"}`}>
                              {isUploadingDoc
                                ? "Uploading…"
                                : "Drag & drop files or specifications here"}
                            </p>
                            <p className={`font-display font-[400] text-[#9CA3AF] text-center ${isModal ? "text-[13px]" : "text-[12px]"}`}>
                              {uploadMessage || "or click to browse · PDF, DOC, DOCX · 5MB · max 5 files"}
                            </p>
                            <input
                              ref={fileInputRef}
                              type="file"
                              className="hidden"
                              accept=".pdf,.doc,.docx"
                              multiple
                              onChange={handleDocFileChange}
                            />
                          </div>
                          {documents.length > 0 && (
                            <ul className="flex flex-col gap-[8px]">
                              {documents.map((doc) => (
                                <li
                                  key={doc.key}
                                  className="flex items-center justify-between gap-[12px] rounded-[8px] border border-[#E5E7EB] bg-white px-[12px] py-[10px]"
                                >
                                  <div className="min-w-0 flex flex-col">
                                    <span className="truncate font-display text-[13px] font-[500] text-[#111111]">
                                      {doc.fileName}
                                    </span>
                                    <span className="font-display text-[12px] text-[#9CA3AF]">
                                      {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeDocument(doc.key)}
                                    className="shrink-0 rounded-[6px] px-[10px] py-[6px] font-display text-[12px] font-[500] text-[#B91C1C] hover:bg-[#FEF2F2]"
                                  >
                                    Remove
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </m.div>
                  </AnimatePresence>
                </div>

                {/* Navigation Buttons */}
                <div className={`flex items-center justify-end gap-[12px] border-t border-[#E5E7EB] mt-auto pt-[24px]`}>
                  {activeStep > 0 && (
                    <button
                      type="button"
                      onClick={handleBack}
                      className={`flex items-center gap-[8px] rounded-[8px] border border-[#E5E7EB] bg-white font-display font-[510] text-[#374151] shadow-sm transition-all duration-200 hover:border-[#D1D5DB] hover:bg-[#F9FAFB] h-[48px] px-[24px] text-[14px]`}
                    >
                      Back
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={isSubmitting || isUploadingDoc}
                    onClick={handleNext}
                    className={`flex items-center gap-[8px] rounded-[8px] bg-[#002868] font-display font-[510] text-white shadow-sm transition-all duration-200 hover:bg-[#002868]/90 h-[48px] px-[32px] text-[14px] disabled:opacity-50`}
                  >
                    {isSubmitting ? "Submitting..." : isUploadingDoc ? "Uploading..." : activeStep === STEPS.length - 1 ? "Submit Job Posting" : "Next"}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal Specific Bottom Section */}
      {isModal && (
        <div className="mt-[64px] flex w-full flex-col items-center">
          <div className="w-full rounded-[24px] bg-[#F8FAFC] border border-[#E5E7EB]/60 px-[48px] py-[40px] max-md:px-[24px] max-md:py-[32px]">
            <h3 className="text-center font-display text-[15px] font-[700] uppercase tracking-[1px] text-[#1A6CFF] mb-[40px] max-md:mb-[32px]">
              What happens next?
            </h3>
            
            <div className="flex items-start justify-between gap-[24px] max-md:flex-col max-md:gap-[32px]">
              {/* Item 1 */}
              <div className="flex items-start gap-[16px] flex-1">
                <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-[#E8F0FE] text-[#002868]">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-display text-[15px] font-[700] text-[#1A6CFF] leading-tight">01</span>
                  <span className="font-display text-[17px] font-[600] text-[#111111] mt-[4px] leading-tight">We review</span>
                  <span className="font-sans text-[14px] text-[#4B5563] mt-[8px] leading-[20px]">Our team reviews your requirements carefully.</span>
                </div>
              </div>

              {/* Arrow 1 */}
              <div className="text-[#9CA3AF] flex-shrink-0 mt-[18px] max-md:hidden">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>

              {/* Item 2 */}
              <div className="flex items-start gap-[16px] flex-1">
                <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-[#E8F0FE] text-[#002868]">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                    <path d="M9 14h6" />
                    <path d="M9 18h6" />
                    <path d="M9 10h.01" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-display text-[15px] font-[700] text-[#1A6CFF] leading-tight">02</span>
                  <span className="font-display text-[17px] font-[600] text-[#111111] mt-[4px] leading-tight">We shortlist</span>
                  <span className="font-sans text-[14px] text-[#4B5563] mt-[8px] leading-[20px]">We shortlist the best matched candidates.</span>
                </div>
              </div>

              {/* Arrow 2 */}
              <div className="text-[#9CA3AF] flex-shrink-0 mt-[18px] max-md:hidden">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>

              {/* Item 3 */}
              <div className="flex items-start gap-[16px] flex-1">
                <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-[#E8F0FE] text-[#002868]">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-display text-[15px] font-[700] text-[#1A6CFF] leading-tight">03</span>
                  <span className="font-display text-[17px] font-[600] text-[#111111] mt-[4px] leading-tight">You meet candidates</span>
                  <span className="font-sans text-[14px] text-[#4B5563] mt-[8px] leading-[20px]">You meet, interview, and choose the right fit.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-[24px] flex items-center justify-center gap-[8px] text-[#6B7280]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span className="font-sans text-[13px] font-[500]">Your information is kept confidential and used only to process your staffing request.</span>
          </div>
        </div>
      )}
        </m.div>
      )}
      </AnimatePresence>
    </div>
  );
}
