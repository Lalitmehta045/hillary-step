"use client";

import { useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { MSMECertifiedContent } from "@/components/site/MSMECertifiedContent";
import { MCAParametersModal } from "@/components/site/MCAParametersModal";
import { ASICStandardsModal } from "@/components/site/ASICStandardsModal";
import { USLaborCodesModal } from "@/components/site/USLaborCodesModal";
import { PrivacySecurityModal } from "@/components/site/PrivacySecurityModal";

export default function MSMEPage() {
  const [isMCAModalOpen, setIsMCAModalOpen] = useState(false);
  const [isASICModalOpen, setIsASICModalOpen] = useState(false);
  const [isLaborModalOpen, setIsLaborModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const handleNavigateType = (type: "mca" | "asic" | "labor" | "privacy") => {
    if (type === "mca") setIsMCAModalOpen(true);
    if (type === "asic") setIsASICModalOpen(true);
    if (type === "labor") setIsLaborModalOpen(true);
    if (type === "privacy") setIsPrivacyModalOpen(true);
  };

  return (
    <div className="min-h-screen w-full bg-white font-display flex flex-col selection:bg-[#007BFF]/10 selection:text-[#007BFF]">
      <Navbar />
      <main className="flex-1 w-full pt-[90px] md:pt-[110px]">
        <MSMECertifiedContent onNavigateType={handleNavigateType} />
      </main>
      <Footer />

      {/* Navigation Modals */}
      <MCAParametersModal
        isOpen={isMCAModalOpen}
        onClose={() => setIsMCAModalOpen(false)}
        onNavigateType={(t) => {
          setIsMCAModalOpen(false);
          if (t === "asic") setIsASICModalOpen(true);
          else if (t === "labor") setIsLaborModalOpen(true);
          else if (t === "privacy") setIsPrivacyModalOpen(true);
        }}
      />
      <ASICStandardsModal
        isOpen={isASICModalOpen}
        onClose={() => setIsASICModalOpen(false)}
        onNavigateType={(t) => {
          setIsASICModalOpen(false);
          if (t === "mca") setIsMCAModalOpen(true);
          else if (t === "labor") setIsLaborModalOpen(true);
          else if (t === "privacy") setIsPrivacyModalOpen(true);
        }}
      />
      <USLaborCodesModal
        isOpen={isLaborModalOpen}
        onClose={() => setIsLaborModalOpen(false)}
        onNavigateType={(t) => {
          setIsLaborModalOpen(false);
          if (t === "mca") setIsMCAModalOpen(true);
          else if (t === "asic") setIsASICModalOpen(true);
          else if (t === "privacy") setIsPrivacyModalOpen(true);
        }}
      />
      <PrivacySecurityModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        onNavigateType={(t) => {
          setIsPrivacyModalOpen(false);
          if (t === "mca") setIsMCAModalOpen(true);
          else if (t === "asic") setIsASICModalOpen(true);
          else if (t === "labor") setIsLaborModalOpen(true);
        }}
      />
    </div>
  );
}
