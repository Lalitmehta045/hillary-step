import { useEffect, useRef, useState } from "react";
import { m as motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [fine, setFine] = useState(false);
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 320, damping: 28, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 320, damping: 28, mass: 0.6 });
  const ringRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setFine(mq.matches);
    if (!mq.matches) return undefined;

    const checkInside = (target) => {
      return Boolean(
        target &&
          (target.closest?.(".ai-root") ||
            (target.classList && target.classList.contains("ai-root")))
      );
    };

    let lastX = -100;
    let lastY = -100;

    const move = (e) => {
      lastX = e.clientX;
      lastY = e.clientY;
      const isInside = checkInside(e.target);
      if (isInside) {
        x.set(e.clientX - 3);
        y.set(e.clientY - 3);
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    const over = (e) => {
      const isInside = checkInside(e.target);
      if (isInside) {
        const t = e.target.closest("a, button, [data-cursor]");
        ringRef.current?.classList.toggle("is-active", !!t);
      } else {
        ringRef.current?.classList.remove("is-active");
      }
    };

    const handleScroll = () => {
      if (lastX >= 0 && lastY >= 0) {
        const el = document.elementFromPoint(lastX, lastY);
        const isInside = checkInside(el);
        setVisible(isInside);
        if (!isInside) {
          ringRef.current?.classList.remove("is-active");
        }
      }
    };

    const leave = () => {
      setVisible(false);
      ringRef.current?.classList.remove("is-active");
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("blur", leave);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("blur", leave);
    };
  }, [x, y]);

  if (!fine) return null;

  return (
    <>
      <motion.div
        className="ai-cursor-dot"
        style={{ x, y }}
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.15 }}
        data-testid="custom-cursor-dot"
      />
      <motion.div
        ref={ringRef}
        className="ai-cursor-ring"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.15 }}
        data-testid="custom-cursor-ring"
      />
    </>
  );
}
