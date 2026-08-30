"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isHovering = false;
    let isVisible = false;
    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        if (dotRef.current) dotRef.current.style.opacity = "1";
        if (ringRef.current) ringRef.current.style.opacity = "1";
      }
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Fast check before climbing DOM
      const tag = target.tagName?.toLowerCase();
      let shouldHover =
        tag === "button" ||
        tag === "a" ||
        tag === "input" ||
        tag === "select" ||
        tag === "textarea" ||
        target.classList?.contains("cursor-pointer");

      if (!shouldHover && target.closest) {
        shouldHover = Boolean(
          target.closest("button, a, select, [role='button'], .cursor-pointer")
        );
      }

      if (shouldHover !== isHovering) {
        isHovering = shouldHover;
        if (dotRef.current) {
          dotRef.current.style.transform = isHovering
            ? "translate(-50%, -50%) scale(1.8)"
            : "translate(-50%, -50%) scale(1)";
        }
        if (ringRef.current) {
          ringRef.current.style.transform = isHovering
            ? "translate(-50%, -50%) scale(1.45)"
            : "translate(-50%, -50%) scale(1)";
          ringRef.current.style.backgroundColor = isHovering
            ? "rgba(0, 255, 157, 0.12)"
            : "transparent";
          ringRef.current.style.borderColor = isHovering
            ? "rgba(0, 255, 157, 0.7)"
            : "rgba(0, 255, 157, 0.35)";
        }
      }
    };

    const onMouseLeave = () => {
      isVisible = false;
      if (dotRef.current) dotRef.current.style.opacity = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
    };

    // 144Hz Smooth RAF Render Loop (Zero React State / Zero Re-renders)
    const render = () => {
      // Immediate 1:1 precision for inner dot
      if (dotRef.current && isVisible) {
        dotRef.current.style.left = `${mouseX}px`;
        dotRef.current.style.top = `${mouseY}px`;
      }

      // Smooth fluid lerp for outer ambient ring (stiffness/damping approximation)
      ringX += (mouseX - ringX) * 0.22;
      ringY += (mouseY - ringY) * 0.22;

      if (ringRef.current && isVisible) {
        ringRef.current.style.left = `${ringX}px`;
        ringRef.current.style.top = `${ringY}px`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave, { passive: true });

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Precision Inner Dot - Pure GPU Composite */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full pointer-events-none z-[99999] opacity-0"
        style={{
          backgroundColor: "#00FF9D",
          boxShadow: "0 0 10px #00FF9D, 0 0 20px rgba(0, 255, 157, 0.6)",
          transform: "translate(-50%, -50%)",
          transition: "transform 0.15s cubic-bezier(0.2, 0, 0, 1), opacity 0.2s ease",
          willChange: "left, top, transform",
        }}
      />

      {/* Radiant Ambient Ring - Fluid Lerp */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-9 h-9 rounded-full pointer-events-none z-[99998] opacity-0"
        style={{
          border: "1.5px solid rgba(0, 255, 157, 0.35)",
          backgroundColor: "transparent",
          transform: "translate(-50%, -50%)",
          transition: "transform 0.2s cubic-bezier(0.2, 0, 0, 1), background-color 0.2s ease, border-color 0.2s ease, opacity 0.2s ease",
          willChange: "left, top, transform",
        }}
      />
    </>
  );
}
