"use client";

import { useEffect, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import { ITSolutionsContent } from "./ITSolutionsContent";

interface ITSolutionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ITSolutionsModal({ isOpen, onClose }: ITSolutionsModalProps) {
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
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] flex items-end justify-center px-[24px] pt-[24px] pb-0 max-md:px-[12px]"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#1A6CFF]/12 backdrop-blur-[4px]"
            onClick={onClose}
          />

          <m.div
            ref={modalRef}
            data-lenis-prevent="true"
            initial={{ opacity: 0, y: "100%", scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: "100%", scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col w-full max-w-[1140px] max-md:max-w-[calc(100vw-24px)] h-full max-h-[calc(100vh-24px)] overflow-y-auto overflow-x-hidden overscroll-contain bg-white rounded-t-[16px] rounded-b-none shadow-2xl z-10 [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky Close Button Header */}
            <div className="sticky top-0 z-50 w-full flex justify-end pointer-events-none p-[24px] pb-0 -mb-[56px]">
              <button
                onClick={onClose}
                className="pointer-events-auto w-[36px] h-[36px] flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-md border border-[#1A6CFF]/20 text-[#1A6CFF] transition-all hover:bg-[#1A6CFF]/10 hover:scale-110"
                aria-label="Close modal"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <ITSolutionsContent />
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
