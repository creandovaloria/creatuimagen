"use client";
import { useEffect, useState } from "react";

interface Props { eventDate: string; }

const DAYS = ["D","L","M","M","J","V","S"];
const JUN_2026 = [
  null,1,2,3,4,5,6,
  7,8,9,10,11,12,13,
  14,15,16,17,18,19,20,
  21,22,23,24,25,26,27,
  28,29,30,null,null,null,null,
];

function pad(n: number) { return String(n).padStart(2, "0"); }

export default function CalendarioCountdown({ eventDate }: Props) {
  const [time, setTime] = useState({ d: "00", h: "00", m: "00", s: "00" });

  useEffect(() => {
    const target = new Date(eventDate).getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) return;
      setTime({
        d: pad(Math.floor(diff / 86400000)),
        h: pad(Math.floor(diff % 86400000 / 3600000)),
        m: pad(Math.floor(diff % 3600000 / 60000)),
        s: pad(Math.floor(diff % 60000 / 1000)),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [eventDate]);

  return (
    <section className="flex flex-col items-center px-6 py-10 gap-6 reveal"
      style={{ background: "linear-gradient(180deg, #fff8fa 0%, #fdf0f3 100%)" }}>

      {/* Mes */}
      <span className="font-dancing text-[14vw] text-[#d4718a] leading-none">Junio</span>

      {/* Calendario */}
      <div className="w-full max-w-xs bg-white rounded-3xl p-5 shadow-sm border border-[#f5c2d0]">
        <div className="grid grid-cols-7 text-center gap-y-1">
          {DAYS.map((d, i) => (
            <span key={i} className="font-lato text-[2.8vw] font-bold text-[#2a1a1f] pb-2 tracking-wide">{d}</span>
          ))}
          {JUN_2026.map((day, i) => (
            <span key={i} className={`font-lato text-[3.8vw] py-1.5 font-light ${
              !day ? "text-transparent" :
              day === 6 ? "font-bold text-[#c0486a]" : "text-[#2a1a1f]"
            }`}>
              {day === 6 ? (
                <span className="inline-flex items-center justify-center w-[7.5vw] h-[7.5vw] max-w-[30px] max-h-[30px] border-2 border-[#d4718a] rounded-full">
                  6
                </span>
              ) : (day ?? "")}
            </span>
          ))}
        </div>
      </div>

      {/* Mensaje + countdown */}
      <div className="flex flex-col items-center gap-4 w-full max-w-xs">
        <p className="font-dancing text-[6.5vw] text-[#c0486a] text-center">
          ¡Falta muy poco!
        </p>

        <p className="font-dancing text-[5.5vw] text-[#d4718a] text-center leading-snug">
          para vivir juntos este momento<br />tan especial 💕
        </p>

        {/* Arco */}
        <div className="w-[55%] h-3 border-t border-l border-r border-[#f0b8c8] rounded-t-full -mb-1" />

        {/* Countdown */}
        <div className="flex items-center gap-[2vw] bg-white border-2 border-[#f0b8c8] rounded-3xl px-4 py-6 shadow-md w-full justify-center">
          {[
            { val: time.d, lbl: "DÍAS" },
            { sep: ":" },
            { val: time.h, lbl: "HORAS" },
            { sep: ":" },
            { val: time.m, lbl: "MIN" },
            { sep: ":" },
            { val: time.s, lbl: "SEG" },
          ].map((item, i) =>
            "sep" in item ? (
              <span key={i} className="font-playfair text-[10vw] text-[#f0b8c8] leading-none pb-4">{item.sep}</span>
            ) : (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="font-playfair font-bold text-[#c0486a] leading-none" style={{ fontSize: "clamp(36px, 13vw, 64px)" }}>{item.val}</span>
                <span className="font-lato text-[2.8vw] tracking-widest text-[#d4718a] uppercase font-bold">{item.lbl}</span>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
