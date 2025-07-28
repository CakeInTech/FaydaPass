// BackgroundWrapper.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";

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
        background: "#000000",
      }}
    >
      {children}
    </div>
  );
}