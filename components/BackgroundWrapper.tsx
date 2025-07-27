"use client";

import React, { useRef, useEffect, useState } from "react";

export default function BackgroundWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        setMousePos({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    const el = wrapperRef.current;
    if (el) {
      el.addEventListener("mousemove", handleMouseMove);
      return () => el.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative min-h-screen overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%,
            rgba(99, 102, 241, 0.15) 0%,
            rgba(168, 85, 247, 0.1) 35%,
            transparent 70%),
          linear-gradient(135deg,
            #0f0f23 0%,
            #1e1b4b 25%,
            #312e81 50%,
            #1e1b4b 75%,
            #0f0f23 100%)
        `,
      }}
    >
      {children}
    </div>
  );
}
