"use client";

import { useEffect, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import { MCAParametersContent } from "./MCAParametersContent";

interface MCAParametersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateType?: (type: "privacy" | "msme" | "asic" | "labor") => void;
}

export function MCAParametersModal({
  isOpen,
  onClose,
  onNavigateType,
}: MCAParametersModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    // @ts-ignore
    window.lenis?.stop();

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      // @ts-ignore
      window.lenis?.start();
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] flex items-end justify-center px-3 sm:px-6 pt-4 pb-0"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-[6px]"
            onClick={onClose}
          />

          {/* Modal Card */}
          <m.div
            ref={modalRef}
            data-lenis-prevent="true"
            initial={{ opacity: 0, y: "100%", scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: "100%", scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col w-full max-w-[1240px] h-full max-h-[calc(100vh-20px)] sm:max-h-[calc(100vh-32px)] overflow-y-auto overflow-x-hidden overscroll-contain bg-white rounded-t-[20px] rounded-b-none shadow-2xl z-10 [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky Close Button Header */}
            <div className="sticky top-0 z-50 w-full flex justify-end pointer-events-none p-4 sm:p-6 pb-0 -mb-[52px]">
              <button
                onClick={onClose}
                className="pointer-events-auto w-[38px] h-[38px] flex items-center justify-center rounded-full bg-white/95 backdrop-blur-md shadow-md border border-gray-200/80 text-[#1E3A8A] transition-all hover:bg-white hover:scale-110 hover:text-[#FF6A00] focus:outline-none cursor-pointer"
                aria-label="Close MCA Compliance document"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Main MCA Compliance Content */}
            <MCAParametersContent
              onClose={onClose}
              onNavigateType={onNavigateType}
            />
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
