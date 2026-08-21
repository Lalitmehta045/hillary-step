"use client";

import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight } from "./Hero";
import { AnimatedButton } from "@/components/ui/AnimatedButton";

const successEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

type FormSuccessPopupProps = {
  open: boolean;
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  actionLabel: string;
  onAction: () => void;
  onClose: () => void;
};

export function FormSuccessPopup({
  open,
  eyebrow,
  title,
  description,
  actionLabel,
  onAction,
  onClose,
}: FormSuccessPopupProps) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <m.div
          className="fixed inset-0 z-[10050] flex items-center justify-center p-[20px] max-md:p-[16px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: successEase }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="form-success-title"
        >
          <m.button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-[#0a1a0c]/45 backdrop-blur-[6px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <m.div
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 28, scale: 0.94 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 16, scale: 0.96 }
            }
            transition={{ duration: 0.45, ease: successEase }}
            className="relative z-10 w-full max-w-[440px] overflow-hidden rounded-[24px] bg-gradient-to-tr from-[#00FF11] via-[#007BFF] to-[#FF6200] p-[1px] shadow-[0_24px_80px_rgba(0,0,0,0.28)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative overflow-hidden rounded-[23px] bg-white px-[36px] py-[44px] max-md:px-[24px] max-md:py-[36px]">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(134,239,172,0.32),transparent_55%),radial-gradient(ellipse_at_100%_100%,rgba(0,123,255,0.1),transparent_45%)]"
              />

              <button
                type="button"
                onClick={onClose}
                aria-label="Close success popup"
                className="absolute right-[16px] top-[16px] z-20 flex h-[32px] w-[32px] items-center justify-center rounded-full border border-[#E5E7EB] bg-white/90 text-[#6B7280] transition-colors hover:border-[#14532D]/25 hover:text-[#14532D]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              <div className="relative z-10 mx-auto flex max-w-[360px] flex-col items-center text-center">
                <div className="relative mb-[24px] flex h-[84px] w-[84px] items-center justify-center">
                  {!reduceMotion && (
                    <>
                      <m.span
                        aria-hidden
                        className="absolute inset-0 rounded-full border border-[#14532D]/20"
                        initial={{ scale: 0.7, opacity: 0.6 }}
                        animate={{ scale: 1.55, opacity: 0 }}
                        transition={{
                          duration: 1.4,
                          ease: "easeOut",
                          repeat: Infinity,
                          repeatDelay: 0.6,
                        }}
                      />
                      <m.span
                        aria-hidden
                        className="absolute inset-[6px] rounded-full border border-[#22c55e]/25"
                        initial={{ scale: 0.85, opacity: 0.5 }}
                        animate={{ scale: 1.35, opacity: 0 }}
                        transition={{
                          duration: 1.4,
                          ease: "easeOut",
                          delay: 0.2,
                          repeat: Infinity,
                          repeatDelay: 0.6,
                        }}
                      />
                    </>
                  )}
                  <m.div
                    initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 280,
                      damping: 18,
                      delay: 0.08,
                    }}
                    className="relative flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gradient-to-br from-[#86EFAC] via-[#22c55e] to-[#14532D] shadow-[0_12px_40px_rgba(34,197,94,0.28)]"
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <m.path
                        d="M5 13l4 4L19 7"
                        stroke="white"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.55, ease: successEase, delay: 0.28 }}
                      />
                    </svg>
                  </m.div>
                </div>

                <m.p
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: successEase, delay: 0.32 }}
                  className="font-display text-[11px] font-[600] leading-[16px] tracking-[1.4px] text-[#14532D] uppercase"
                >
                  {eyebrow}
                </m.p>

                <m.h3
                  id="form-success-title"
                  initial={
                    reduceMotion
                      ? false
                      : { opacity: 0, y: 14, filter: "blur(8px)" }
                  }
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.65, ease: successEase, delay: 0.4 }}
                  className="mt-[10px] font-display text-[30px] max-md:text-[26px] font-[590] leading-[1.15] tracking-[-0.7px] text-[#111111]"
                >
                  {title}
                </m.h3>

                <m.p
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: successEase, delay: 0.52 }}
                  className="mt-[14px] font-sans text-[15px] max-md:text-[14px] font-[400] leading-[24px] text-[#4B5563]"
                >
                  {description}
                </m.p>

                <m.div
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: successEase, delay: 0.64 }}
                  className="mt-[28px] w-full"
                >
                  <AnimatedButton
                    type="button"
                    onClick={onAction}
                    className="flex h-[48px] w-full items-center justify-center gap-[8px] rounded-full bg-[#111111] px-[28px] font-sans text-[14px] font-[500] text-white transition-colors hover:bg-black shadow-[0px_1px_2px_rgba(0,0,0,0.05)]"
                  >
                    {actionLabel}
                    <ArrowRight />
                  </AnimatedButton>
                </m.div>
              </div>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

