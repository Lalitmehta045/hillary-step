"use client";

import { useState, useRef, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

const STEPS = [
  {
    id: "job-title",
    label: "Job Title",
    description: "Add the most relevant job title for the position you want to fill.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    id: "role-specification",
    label: "Role Specification",
    description: "Define the skills, experience, and qualifications required.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <path d="M12 18v-6" />
        <path d="m9 15 3-3 3 3" />
      </svg>
    ),
  },
];

export default function PostAJobPage() {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [formData, setFormData] = useState({
    jobTitle: "",
    organizationName: "",
    roleType: "",
    experienceLevel: "",
    skills: "",
    country: "",
    city: "",
    workMode: "",
    jobDescription: "",
    requirements: "",
  });

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
  };

  const handleNext = () => {
    if (activeStep < STEPS.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white font-display">
      <Navbar />
      {/* Fixed width 1210px container like Figma */}
      <div className="mx-auto w-full max-w-[1210px] px-[32px] max-md:px-[16px] pb-[96px]">
        {/* Title - centered */}
        <div className="pt-[100px] max-md:pt-[70px] mb-[40px] max-md:mb-[28px] text-center">
          <h1 className="font-display text-[44px] max-md:text-[28px] font-[700] leading-[52.8px] max-md:leading-[36px] tracking-[-1.1px] max-md:tracking-[-0.5px] text-[#111111]">
            <span className="bg-gradient-to-r from-[#1A6CFF] via-[#3AF900] to-[#FF9500] bg-clip-text text-transparent">Post a Job</span>{" "}
            Find the Right Talent.
          </h1>
        </div>

        {/* Two Column Layout - gap 48px */}
        <div className="flex gap-[48px] max-md:flex-col max-md:gap-[24px] items-start">
          {/* Left Sidebar - Steps */}
          <div className="w-[400px] max-md:w-[100vw] max-md:-mx-[16px] max-md:px-[16px] shrink-0 self-start flex flex-col max-md:flex-row gap-[8px] max-md:overflow-x-auto max-md:snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {STEPS.map((step, index) => {
              const isActive = index === activeStep;

              return (
                <m.button
                  layout
                  key={step.id}
                  ref={(el) => { stepRefs.current[index] = el; }}
                  type="button"
                  onClick={() => setActiveStep(index)}
                  className={`relative overflow-hidden flex w-full max-md:w-auto max-md:shrink-0 max-md:snap-start items-start max-md:items-center text-left transition-all duration-500 ease-out ${
                    isActive 
                      ? "gap-[16px] max-md:gap-[8px] p-[24px] pb-[28px] max-md:py-[12px] max-md:px-[20px] rounded-[16px] max-md:rounded-full bg-[#E1EFFA]" 
                      : "gap-[12px] max-md:gap-[8px] px-[24px] py-[20px] max-md:py-[12px] max-md:px-[20px] rounded-[12px] max-md:rounded-full hover:bg-gray-50/50 max-md:bg-[#FAFBFC] max-md:border max-md:border-[#E5E7EB]"
                  }`}
                >
                  <m.span layout="position" className={`shrink-0 text-[#111111] ${isActive ? "mt-[2px] max-md:mt-0" : ""}`}>
                    {step.icon}
                  </m.span>
                  
                  <div className={`min-w-0 flex-1 flex flex-col justify-start max-md:justify-center ${isActive ? "min-h-[104px] max-md:min-h-0" : ""}`}>
                    <m.p layout="position" className={`font-display font-[600] text-[#111111] max-md:whitespace-nowrap transition-all duration-300 ${
                      isActive 
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

          {/* Right Form Card (fill remaining ~698px) */}
          <div className="flex-1 min-w-0 max-md:w-full">
            <div className="rounded-[23px] border border-[#E5E7EB] bg-white p-[32px] max-md:p-[20px] shadow-[0_4px_20px_0px_rgba(0,0,0,0.04)] flex flex-col min-h-[560px] max-md:min-h-0">
              <h2 className="font-display text-[24px] font-[400] leading-[32px] tracking-[-0.24px] text-[#002868]">
                {activeStep === 0 && "Post a New Position"}
                {activeStep === 1 && "Role Specification"}
                {activeStep === 2 && "Location Details"}
                {activeStep === 3 && "Job Description"}
                {activeStep === 4 && "Upload Documentation"}
              </h2>

              <div className="mt-[32px] flex flex-col gap-[24px] flex-1">
                <AnimatePresence mode="wait">
                  <m.div
                    key={activeStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flex flex-col gap-[24px] w-full"
                  >
                    {/* Step 0: Job Title */}
                    {activeStep === 0 && (
                      <>
                    <div className="flex flex-col gap-[8px]">
                      <label className="font-display text-[13px] font-[400] leading-[16px] tracking-[0.26px] text-[#374151]">
                        Job Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Senior Backend Engineer"
                        value={formData.jobTitle}
                        onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                        className="h-[40px] w-full rounded-[10px] border border-[#E5E7EB] bg-[#F8F9FB] py-[10px] pr-[16px] pl-[18px] font-display text-[13px] font-[400] text-[#111111] placeholder-[#9CA3AF] outline-none transition-all duration-200 focus:border-[#1A6CFF] focus:bg-white focus:ring-2 focus:ring-[#1A6CFF]/10"
                      />
                    </div>
                    <div className="flex flex-col gap-[8px]">
                      <label className="font-display text-[13px] font-[400] leading-[16px] tracking-[0.26px] text-[#374151]">
                        Organization Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Senior Backend Engineer"
                        value={formData.organizationName}
                        onChange={(e) => handleInputChange("organizationName", e.target.value)}
                        className="h-[40px] w-full rounded-[10px] border border-[#E5E7EB] bg-[#F8F9FB] py-[10px] pr-[16px] pl-[18px] font-display text-[13px] font-[400] text-[#111111] placeholder-[#9CA3AF] outline-none transition-all duration-200 focus:border-[#1A6CFF] focus:bg-white focus:ring-2 focus:ring-[#1A6CFF]/10"
                      />
                    </div>
                  </>
                )}

                {/* Step 1: Role Specification */}
                {activeStep === 1 && (
                  <>
                    <div className="flex flex-col gap-[8px]">
                      <label className="font-display text-[13px] font-[400] leading-[16px] tracking-[0.26px] text-[#374151]">
                        Role Type
                      </label>
                      <select
                        value={formData.roleType}
                        onChange={(e) => handleInputChange("roleType", e.target.value)}
                        className="h-[40px] w-full rounded-[10px] border border-[#E5E7EB] bg-[#F8F9FB] py-[10px] pr-[16px] pl-[18px] font-display text-[13px] font-[400] text-[#111111] outline-none transition-all duration-200 focus:border-[#1A6CFF] focus:bg-white focus:ring-2 focus:ring-[#1A6CFF]/10"
                      >
                        <option value="">Select role type</option>
                        <option value="full-time">Full-Time</option>
                        <option value="part-time">Part-Time</option>
                        <option value="contract">Contract</option>
                        <option value="internship">Internship</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-[8px]">
                      <label className="font-display text-[13px] font-[400] leading-[16px] tracking-[0.26px] text-[#374151]">
                        Experience Level
                      </label>
                      <select
                        value={formData.experienceLevel}
                        onChange={(e) => handleInputChange("experienceLevel", e.target.value)}
                        className="h-[40px] w-full rounded-[10px] border border-[#E5E7EB] bg-[#F8F9FB] py-[10px] pr-[16px] pl-[18px] font-display text-[13px] font-[400] text-[#111111] outline-none transition-all duration-200 focus:border-[#1A6CFF] focus:bg-white focus:ring-2 focus:ring-[#1A6CFF]/10"
                      >
                        <option value="">Select experience level</option>
                        <option value="entry">Entry Level (0-2 years)</option>
                        <option value="mid">Mid Level (3-5 years)</option>
                        <option value="senior">Senior Level (5-8 years)</option>
                        <option value="lead">Lead / Principal (8+ years)</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-[8px]">
                      <label className="font-display text-[13px] font-[400] leading-[16px] tracking-[0.26px] text-[#374151]">
                        Required Skills
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. React, Node.js, TypeScript"
                        value={formData.skills}
                        onChange={(e) => handleInputChange("skills", e.target.value)}
                        className="h-[40px] w-full rounded-[10px] border border-[#E5E7EB] bg-[#F8F9FB] py-[10px] pr-[16px] pl-[18px] font-display text-[13px] font-[400] text-[#111111] placeholder-[#9CA3AF] outline-none transition-all duration-200 focus:border-[#1A6CFF] focus:bg-white focus:ring-2 focus:ring-[#1A6CFF]/10"
                      />
                    </div>
                  </>
                )}

                {/* Step 2: Location */}
                {activeStep === 2 && (
                  <>
                    <div className="flex flex-col gap-[8px]">
                      <label className="font-display text-[13px] font-[400] leading-[16px] tracking-[0.26px] text-[#374151]">
                        Country
                      </label>
                      <select
                        value={formData.country}
                        onChange={(e) => handleInputChange("country", e.target.value)}
                        className="h-[40px] w-full rounded-[10px] border border-[#E5E7EB] bg-[#F8F9FB] py-[10px] pr-[16px] pl-[18px] font-display text-[13px] font-[400] text-[#111111] outline-none transition-all duration-200 focus:border-[#1A6CFF] focus:bg-white focus:ring-2 focus:ring-[#1A6CFF]/10"
                      >
                        <option value="">Select country</option>
                        <option value="us">United States</option>
                        <option value="au">Australia</option>
                        <option value="in">India</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-[8px]">
                      <label className="font-display text-[13px] font-[400] leading-[16px] tracking-[0.26px] text-[#374151]">
                        City
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. New York, Sydney, Mumbai"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className="h-[40px] w-full rounded-[10px] border border-[#E5E7EB] bg-[#F8F9FB] py-[10px] pr-[16px] pl-[18px] font-display text-[13px] font-[400] text-[#111111] placeholder-[#9CA3AF] outline-none transition-all duration-200 focus:border-[#1A6CFF] focus:bg-white focus:ring-2 focus:ring-[#1A6CFF]/10"
                      />
                    </div>
                    <div className="flex flex-col gap-[8px]">
                      <label className="font-display text-[13px] font-[400] leading-[16px] tracking-[0.26px] text-[#374151]">
                        Work Mode
                      </label>
                      <div className="flex gap-[12px]">
                        {["On-site", "Remote", "Hybrid"].map((mode) => (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => handleInputChange("workMode", mode.toLowerCase())}
                            className={`flex h-[40px] flex-1 items-center justify-center rounded-[10px] border font-display text-[13px] font-[500] transition-all duration-200 ${
                              formData.workMode === mode.toLowerCase()
                                ? "border-[#1A6CFF] bg-[#1A6CFF]/5 text-[#1A6CFF]"
                                : "border-[#E5E7EB] bg-[#FAFBFC] text-[#6B7280] hover:border-[#D1D5DB]"
                            }`}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Step 3: Job Description */}
                {activeStep === 3 && (
                  <>
                    <div className="flex flex-col gap-[8px]">
                      <label className="font-display text-[13px] font-[400] leading-[16px] tracking-[0.26px] text-[#374151]">
                        Job Description
                      </label>
                      <textarea
                        placeholder="Describe the role, responsibilities, and what a typical day looks like..."
                        value={formData.jobDescription}
                        onChange={(e) => handleInputChange("jobDescription", e.target.value)}
                        rows={5}
                        className="w-full rounded-[10px] border border-[#E5E7EB] bg-[#F8F9FB] px-[18px] py-[12px] font-display text-[13px] font-[400] leading-[20px] text-[#111111] placeholder-[#9CA3AF] outline-none transition-all duration-200 focus:border-[#1A6CFF] focus:bg-white focus:ring-2 focus:ring-[#1A6CFF]/10 resize-none"
                      />
                    </div>
                    <div className="flex flex-col gap-[8px]">
                      <label className="font-display text-[13px] font-[400] leading-[16px] tracking-[0.26px] text-[#374151]">
                        Requirements
                      </label>
                      <textarea
                        placeholder="List the key requirements and qualifications..."
                        value={formData.requirements}
                        onChange={(e) => handleInputChange("requirements", e.target.value)}
                        rows={4}
                        className="w-full rounded-[10px] border border-[#E5E7EB] bg-[#F8F9FB] px-[18px] py-[12px] font-display text-[13px] font-[400] leading-[20px] text-[#111111] placeholder-[#9CA3AF] outline-none transition-all duration-200 focus:border-[#1A6CFF] focus:bg-white focus:ring-2 focus:ring-[#1A6CFF]/10 resize-none"
                      />
                    </div>
                  </>
                )}

                {/* Step 4: Documentation */}
                {activeStep === 4 && (
                  <div className="flex flex-col gap-[8px]">
                    <label className="font-display text-[13px] font-[400] leading-[16px] tracking-[0.26px] text-[#374151]">
                      Upload Documents
                    </label>
                    <div className="flex min-h-[160px] w-full flex-col items-center justify-center gap-[12px] rounded-[14px] border-2 border-dashed border-[#D1D5DB] bg-[#FAFBFC] px-[24px] py-[32px] transition-colors hover:border-[#1A6CFF]/40 hover:bg-[#1A6CFF]/[0.02]">
                      <div className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[#EFF6FF]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A6CFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                          <polyline points="17,8 12,3 7,8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                      </div>
                      <p className="font-display text-[13px] font-[500] text-[#374151]">
                        Drag & drop files here, or{" "}
                        <span className="text-[#1A6CFF] cursor-pointer hover:underline">browse</span>
                      </p>
                      <p className="font-display text-[11px] font-[400] text-[#9CA3AF]">
                        PDF, DOC, DOCX up to 10MB
                      </p>
                    </div>
                  </div>
                )}
                  </m.div>
                </AnimatePresence>
              </div>

              {/* Navigation Buttons */}
              <div className="mt-[32px] flex items-center justify-end gap-[12px] border-t border-[#E5E7EB] pt-[16px]">
                {activeStep > 0 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex h-[40px] items-center gap-[8px] rounded-[4px] border border-[#E5E7EB] bg-white px-[32px] font-display text-[13px] font-[510] text-[#374151] shadow-sm transition-all duration-200 hover:border-[#D1D5DB] hover:bg-[#F9FAFB]"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={activeStep === STEPS.length - 1 ? undefined : handleNext}
                  className="flex h-[40px] items-center gap-[8px] rounded-[4px] bg-[#002868] px-[32px] font-display text-[13px] font-[510] text-white shadow-sm transition-all duration-200 hover:bg-[#002868]/90"
                >
                  {activeStep === STEPS.length - 1 ? "Submit" : "Next"}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
