"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import "./ProfileFlowCard.css";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type Profile = {
  initials: string;
  bg: string;
  text: string;
};

const profiles: Profile[] = [
  { initials: "JD", bg: "#E8EBFF", text: "#3546C7" },
  { initials: "SK", bg: "#E5F9ED", text: "#078B4C" },
  { initials: "AL", bg: "#FFF1C9", text: "#D66B00" },

  { initials: "RM", bg: "#E8F3FF", text: "#2672C8" },
  { initials: "NK", bg: "#F3E9FF", text: "#8A42C4" },
  { initials: "PS", bg: "#FFE8E8", text: "#C44848" },

  { initials: "AM", bg: "#E4F8F6", text: "#087F79" },
  { initials: "RK", bg: "#FFF0E5", text: "#C65B16" },
  { initials: "TS", bg: "#EDEAFF", text: "#6551B8" },

  { initials: "MV", bg: "#E8F7FF", text: "#237DAA" },
  { initials: "AR", bg: "#F1F7E8", text: "#5E8C25" },
  { initials: "VN", bg: "#FFEAF4", text: "#B13D78" },
];

function GraduationIcon() {
  return (
    <svg
      width="29"
      height="29"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 11.5L16 5L28 11.5L16 18L4 11.5Z"
        stroke="#0BA94B"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      <path
        d="M9 14.2V20.2C9 20.2 11.7 24 16 24C20.3 24 23 20.2 23 20.2V14.2"
        stroke="#0BA94B"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      <path
        d="M28 12V18"
        stroke="#0BA94B"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      <circle
        cx="28"
        cy="19.5"
        r="1.3"
        fill="#0BA94B"
      />
    </svg>
  );
}

function ProfileCircle({
  profile,
  className = "",
}: {
  profile: Profile;
  className?: string;
}) {
  return (
    <div
      className={`profile-circle ${className}`}
      style={{
        backgroundColor: profile.bg,
        color: profile.text,
      }}
    >
      {profile.initials}
    </div>
  );
}

export interface ProfileFlowCardProps {
  className?: string;
}

export function ProfileFlowCard({ className = "" }: ProfileFlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const profileAreaRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const container = cardRef.current;
    const profileArea = profileAreaRef.current;

    if (!container || !profileArea) return;

    let activeCall: gsap.core.Tween | null = null;

    const ctx = gsap.context(() => {
      const slots = gsap.utils.toArray<HTMLElement>(
        ".profile-slot"
      );

      /*
       * Initial state:
       * Profiles are positioned outside the right side.
       */
      gsap.set(slots, {
        x: 95,
        opacity: 0,
        scale: 0.82,
      });

      /*
       * ------------------------------------------------
       * INITIAL ARRIVAL
       * ------------------------------------------------
       *
       * All three profiles enter from the right,
       * following the dotted connection line.
       */
      const intro = gsap.timeline();

      slots.forEach((slot, index) => {
        intro.to(
          slot,
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 0.65,
            ease: "power3.out",
          },
          index * 0.18
        );
      });

      /*
       * Hold the completed arrangement.
       */
      intro.to({}, { duration: 1.3 });

      /*
       * ------------------------------------------------
       * CONTINUOUS PROFILE REPLACEMENT
       * ------------------------------------------------
       */

      let profileIndex = 3;
      let slotIndex = 0;

      const replaceProfile = () => {
        const slot = slots[slotIndex];
        if (!slot) return;

        /*
         * Existing profile subtly shrinks/fades.
         */
        gsap.to(slot, {
          scale: 0.72,
          opacity: 0,
          duration: 0.25,
          ease: "power2.in",
          onComplete: () => {
            /*
             * Change the initials/color.
             */
            const profile =
              profiles[profileIndex % profiles.length];

            const element =
              slot.querySelector<HTMLElement>(
                ".profile-circle"
              );

            if (element) {
              element.textContent = profile.initials;
              element.style.backgroundColor = profile.bg;
              element.style.color = profile.text;
            }

            /*
             * New profile comes from the RIGHT.
             */
            gsap.fromTo(
              slot,
              {
                x: 95,
                opacity: 0,
                scale: 0.78,
              },
              {
                x: 0,
                opacity: 1,
                scale: 1,
                duration: 0.62,
                ease: "power3.out",
              }
            );

            profileIndex++;
          },
        });

        slotIndex = (slotIndex + 1) % slots.length;
      };

      /*
       * Start replacements after intro.
       */
      function scheduleNext() {
        replaceProfile();
        activeCall = gsap.delayedCall(1.15, scheduleNext);
      }

      activeCall = gsap.delayedCall(1.8, scheduleNext);
    }, container);

    return () => {
      if (activeCall) {
        activeCall.kill();
      }
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`profile-flow-card ${className}`.trim()}
    >
      <div className="profile-flow-inner">
        {/* LEFT ICON */}
        <div className="education-icon">
          <GraduationIcon />
        </div>

        {/* DOTTED CONNECTION */}
        <div className="profile-connection">
          <div className="connection-line" />
        </div>

        {/* PROFILE GROUP */}
        <div
          ref={profileAreaRef}
          className="profile-group"
        >
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="profile-slot"
            >
              <ProfileCircle
                profile={profiles[index]}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfileFlowCard;
