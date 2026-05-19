"use client";
import { useEffect, useState } from "react";

export default function ScrollHint() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => { if (window.scrollY > 400) setVisible(false); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="flex flex-col items-center gap-1 py-4 pointer-events-none">
      <span className="font-lato text-[3vw] text-[#b5566e] tracking-widest uppercase opacity-80">
        desliza
      </span>
      <div className="w-[1px] h-6 bg-[#b5566e] opacity-60 animate-bounce" />
      <span className="text-[#b5566e] text-[4vw] animate-bounce">↓</span>
    </div>
  );
}
