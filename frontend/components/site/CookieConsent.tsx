"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COOKIE_KEY = "hs-cookie-consent";

type ConsentState = "accepted" | "rejected" | "pending";

export function CookieConsent() {
  const [consent, setConsent] = useState<ConsentState | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Cookie categories for the settings panel
  const [categories, setCategories] = useState({
    necessary: true,
    analytics: true,
    marketing: true,
    preferences: true,
  });

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_KEY);
    if (stored === "accepted" || stored === "rejected") {
      setConsent(stored);
    } else {
      setConsent("pending");
    }
  }, []);

  const handleAcceptAll = useCallback(() => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setConsent("accepted");
  }, []);

  const handleRejectAll = useCallback(() => {
    localStorage.setItem(COOKIE_KEY, "rejected");
    setConsent("rejected");
  }, []);

  const handleSaveSettings = useCallback(() => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    localStorage.setItem("hs-cookie-categories", JSON.stringify(categories));
    setConsent("accepted");
  }, [categories]);

  // Don't render until we've checked localStorage
  if (consent === null || consent !== "pending") return null;

  return (
    <AnimatePresence>
      {consent === "pending" && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            key="cookie-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-[2px]"
            onClick={() => {}} // prevent click-through
          />

          {/* Cookie Banner */}
          <motion.div
            key="cookie-banner"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
              mass: 0.8,
            }}
            className="fixed inset-x-0 bottom-0 z-[9999] flex justify-center px-4 pb-4 md:px-6 md:pb-6"
          >
            <div className="relative w-full max-w-[640px] overflow-hidden rounded-[20px] border border-white/20 bg-white shadow-[0_-8px_60px_rgba(0,0,0,0.12),0_0_0_1px_rgba(255,255,255,0.1)]">
              {/* Gradient accent top bar */}
              <div className="h-[3px] w-full bg-gradient-to-r from-[#1A6CFF] via-[#40F600] to-[#FF9500]" />

              <div className="flex flex-col gap-5 p-6 md:p-8">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1A6CFF]/10 to-[#40F600]/10">
                      <CookieIcon />
                    </div>
                    <h2 className="font-display text-[18px] font-[600] leading-[24px] text-[#111]">
                      We Value Your Privacy
                    </h2>
                  </div>
                </div>

                {/* Description */}
                <p className="font-display text-[14px] font-[400] leading-[22px] text-[#5e5e5e]">
                  Welcome to Hillary Step Solutions! We use cookies to enhance
                  your browsing experience, analyse site traffic, and
                  personalise content. Cookies help us understand your
                  preferences and deliver relevant information. For more
                  details, please review our{" "}
                  <a
                    href="#"
                    className="inline-flex items-center gap-[2px] font-[500] text-[#1A6CFF] underline decoration-[#1A6CFF]/30 underline-offset-2 transition-colors hover:text-[#1E3A8A] hover:decoration-[#1E3A8A]/50"
                  >
                    Cookies Policy
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="inline-flex items-center gap-[2px] font-[500] text-[#1A6CFF] underline decoration-[#1A6CFF]/30 underline-offset-2 transition-colors hover:text-[#1E3A8A] hover:decoration-[#1E3A8A]/50"
                  >
                    Privacy Statement
                  </a>
                  .
                </p>

                {/* Settings Toggle (expandable) */}
                <AnimatePresence>
                  {showSettings && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-3 rounded-2xl border border-[#E5E7EB] bg-[#F8F9FB] p-4">
                        {(
                          [
                            {
                              key: "necessary" as const,
                              label: "Strictly Necessary",
                              desc: "Essential for the website to function.",
                              locked: true,
                            },
                            {
                              key: "analytics" as const,
                              label: "Analytics",
                              desc: "Help us understand site usage.",
                              locked: false,
                            },
                            {
                              key: "marketing" as const,
                              label: "Marketing",
                              desc: "Used to deliver relevant ads.",
                              locked: false,
                            },
                            {
                              key: "preferences" as const,
                              label: "Preferences",
                              desc: "Remember your settings and choices.",
                              locked: false,
                            },
                          ] as const
                        ).map((cat) => (
                          <label
                            key={cat.key}
                            className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white"
                          >
                            <div className="flex flex-col">
                              <span className="font-display text-[13px] font-[500] text-[#111]">
                                {cat.label}
                              </span>
                              <span className="font-display text-[12px] font-[400] text-[#8e8e8e]">
                                {cat.desc}
                              </span>
                            </div>
                            <div className="relative shrink-0">
                              <input
                                type="checkbox"
                                checked={categories[cat.key]}
                                disabled={cat.locked}
                                onChange={(e) =>
                                  setCategories((prev) => ({
                                    ...prev,
                                    [cat.key]: e.target.checked,
                                  }))
                                }
                                className="peer sr-only"
                              />
                              <div
                                className={`h-6 w-11 rounded-full transition-colors ${
                                  categories[cat.key]
                                    ? "bg-gradient-to-r from-[#1A6CFF] to-[#40F600]"
                                    : "bg-[#D1D5DB]"
                                } ${cat.locked ? "opacity-60" : "cursor-pointer"}`}
                                onClick={() => {
                                  if (!cat.locked) {
                                    setCategories((prev) => ({
                                      ...prev,
                                      [cat.key]: !prev[cat.key],
                                    }));
                                  }
                                }}
                              >
                                <div
                                  className={`absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                                    categories[cat.key]
                                      ? "translate-x-5"
                                      : "translate-x-0"
                                  }`}
                                />
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Cookies Settings link */}
                <button
                  type="button"
                  onClick={() => setShowSettings((v) => !v)}
                  className="group mx-auto flex items-center gap-1.5 font-display text-[14px] font-[600] text-[#111] underline decoration-[#111]/20 underline-offset-[3px] transition-all hover:decoration-[#1A6CFF] hover:text-[#1A6CFF]"
                >
                  Cookies Settings
                  <motion.svg
                    animate={{ rotate: showSettings ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </motion.svg>
                </button>

                {/* Action buttons */}
                <div className="flex flex-col gap-3">
                  {/* Reject All */}
                  <button
                    type="button"
                    onClick={handleRejectAll}
                    className="group relative flex h-[52px] w-full items-center justify-center overflow-hidden rounded-full border-2 border-[#111] font-display text-[15px] font-[600] text-[#111] transition-all duration-300 hover:border-[#1A6CFF] hover:text-[#1A6CFF] hover:shadow-[0_4px_20px_rgba(26,108,255,0.15)] active:scale-[0.98]"
                  >
                    <span className="relative z-10">Reject All</span>
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#1A6CFF]/5 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                  </button>

                  {/* Accept All Cookies */}
                  <button
                    type="button"
                    onClick={showSettings ? handleSaveSettings : handleAcceptAll}
                    className="group relative flex h-[52px] w-full items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[#1A6CFF] via-[#2D8CFF] to-[#1A6CFF] bg-[length:200%_100%] font-display text-[15px] font-[600] text-white shadow-[0_4px_20px_rgba(26,108,255,0.3)] transition-all duration-500 hover:bg-right hover:shadow-[0_6px_30px_rgba(26,108,255,0.45)] active:scale-[0.98]"
                  >
                    <span className="relative z-10">
                      {showSettings ? "Save Preferences" : "Accept All Cookies"}
                    </span>
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function CookieIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1A6CFF"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="8" cy="9" r="1" fill="#1A6CFF" />
      <circle cx="15" cy="8" r="1" fill="#40F600" />
      <circle cx="10" cy="14" r="1" fill="#FF9500" />
      <circle cx="15" cy="14" r="1" fill="#1A6CFF" />
      <path d="M16 4c-1 1-1 3 0 4 1 1 3 1 4 0" />
      <path d="M20 12c-1 0-2 .5-2 2" />
    </svg>
  );
}
