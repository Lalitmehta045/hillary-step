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
          className="fixed inset-0 z-[9999] flex items-end justify-center px-[24px] pt-[24px] pb-0 max-md:px-0 max-md:pt-0"
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
            className="relative flex flex-col w-full max-w-[1140px] max-md:max-w-full h-full max-h-[calc(100vh-24px)] max-md:max-h-[94dvh] max-md:h-[94dvh] overflow-y-auto overflow-x-hidden overscroll-contain bg-white rounded-t-[20px] max-md:rounded-t-[24px] rounded-b-none shadow-2xl z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky Close Button Header */}
            <div className="sticky top-0 z-50 w-full flex items-center justify-between pointer-events-none p-[24px] max-md:p-[14px] max-md:px-[16px] pb-0 max-md:pb-0 -mb-[56px] max-md:-mb-[44px]">
              <div className="md:hidden flex-1 flex justify-center pl-8">
                <div className="w-10 h-1 rounded-full bg-gray-300" />
              </div>
              <button
                onClick={onClose}
                className="pointer-events-auto w-[36px] h-[36px] max-md:w-[32px] max-md:h-[32px] flex items-center justify-center rounded-full bg-white/95 backdrop-blur-md shadow-md border border-[#1A6CFF]/20 text-[#1A6CFF] transition-all hover:bg-[#1A6CFF]/10 hover:scale-110 active:scale-90"
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
