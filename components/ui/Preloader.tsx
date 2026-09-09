"use client";

import { useEffect, useState } from "react";

export function Preloader() {
  const [hidden, setHidden] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let value = 0;
    const interval = window.setInterval(() => {
      value += Math.floor(Math.random() * 11) + 6;
      if (value >= 100) {
        value = 100;
        setProgress(100);
        window.clearInterval(interval);
        window.setTimeout(() => setHidden(true), 450);
      } else {
        setProgress(value);
      }
    }, 90);

    return () => window.clearInterval(interval);
  }, []);

  if (hidden) return null;

  return (
    <div className={`preloader ${progress === 100 ? "done" : ""}`}>
      <div className="preloader-top">
        <strong>DESKAVYN™</strong>
        <span>INTERACTIVE COMMERCE SYSTEM</span>
      </div>

      <div className="preloader-center">
        <div className="preloader-mark">
          <i />
          <i />
          <i />
        </div>
        <div className="preloader-percent">{String(progress).padStart(3, "0")}%</div>
      </div>

      <div className="preloader-bottom">
        <span>LOADING WORKSPACE</span>
        <div className="preloader-line">
          <i style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}
