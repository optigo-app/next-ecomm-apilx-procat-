"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const StyleInjector = ({ styleContent }) => {
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (!styleContent) return;

    const styleTag = document.createElement("style");
    styleTag.type = "text/css";
    styleTag.innerHTML = styleContent;
    document.head.appendChild(styleTag);

    const animateBackground = () => {
      const element = document.querySelector(".setFullThemeBack");
      if (!element) return;
      element.classList.remove("animateThemeFill");
      void element.offsetWidth;
      element.classList.add("animateThemeFill");
    };
    const timeout = setTimeout(animateBackground, 50);
    requestAnimationFrame(() => setApplied(true));

    return () => {
      document.head.removeChild(styleTag);
      setApplied(false);
      clearTimeout(timeout);
    };
  }, [styleContent]);

  return (
    <AnimatePresence>
      {applied && (
        <motion.div
          key="bg-reveal"
          initial={{
            clipPath: "circle(0% at 0% 0%)",
            opacity: 1,
          }}
          animate={{
            clipPath: "circle(150% at 0% 0%)",
            opacity: 1,
          }}
          exit={{
            clipPath: "circle(0% at 0% 0%)",
            opacity: 0,
          }}
          transition={{
            duration: 1.2,
            ease: [0.76, 0, 0.24, 1],
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            pointerEvents: "none",
            backgroundColor: window
              .getComputedStyle(document.body).backgroundColor || "transparent",
            mixBlendMode: "normal",
          }}
        />
      )}
    </AnimatePresence>
  );
};

export default StyleInjector;
