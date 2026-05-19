export default function Footer() {
  return (
    <footer className="w-full"
      style={{ background: "linear-gradient(135deg, #2a1a1f 0%, #3d1f28 100%)" }}>
      {/* Línea decorativa top */}
      <div className="w-full h-[2px]"
        style={{ background: "linear-gradient(to right, transparent, #d4718a, transparent)" }} />

      <div className="flex flex-col items-center gap-2 py-6 px-6 text-center">
        <span className="text-[4vw] text-[#e8a0b0]">✦</span>
        <p className="font-lato text-[2.8vw] text-[#f0b8c8] tracking-wide">
          Realizado por{" "}
          <a href="https://invitaciones.arturobarrios.com/" target="_blank" rel="noopener noreferrer"
            className="font-bold text-white underline underline-offset-2">
            arturobarrios.com
          </a>
        </p>
        <div className="w-8 h-[1px] bg-[#d4718a] opacity-40 my-1" />
        <p className="font-lato text-[2.6vw] text-[#e8a0b0]">
          En colaboración con
        </p>
        <p className="font-dancing text-[4.5vw] text-white">
          Liz Barron Event Planner
        </p>
      </div>

      {/* Línea decorativa bottom */}
      <div className="w-full h-[1px]"
        style={{ background: "linear-gradient(to right, transparent, #d4718a40, transparent)" }} />
    </footer>
  );
}
