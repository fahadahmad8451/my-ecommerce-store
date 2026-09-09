"use client";

import { useRef } from "react";

export function MagneticButton({
  children,
  className = "",
  onClick
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  function handleMove(e: React.MouseEvent<HTMLButtonElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    ref.current.style.transform = `translate(${x * 0.16}px, ${y * 0.16}px)`;
  }

  function reset() {
    if (!ref.current) return;
    ref.current.style.transform = "translate(0,0)";
  }

  return (
    <button
      ref={ref}
      className={`magnetic-button ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onClick={onClick}
    >
      <span>{children}</span>
    </button>
  );
}
