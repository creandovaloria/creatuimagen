export default function DressCode() {
  return (
    <section className="bg-[#fff8fa] flex flex-col items-center px-6 py-12 gap-5 text-center reveal">

      {/* Título */}
      <span className="font-dancing text-[11vw] text-[#c0486a] leading-none">
        Dress Code
      </span>

      {/* Subtítulo */}
      <p className="font-playfair text-[5vw] text-[#2a1a1f] italic leading-snug">
        ¡Vístete fabuloso!<br />
        <span className="font-bold not-italic">Cóctel elegante</span>
      </p>

      {/* Separador */}
      <div className="flex items-center gap-3 w-full max-w-xs">
        <div className="flex-1 h-[1px] bg-[#f0b8c8]" />
        <span className="text-[4vw] text-[#e8a0b0]">✦</span>
        <div className="flex-1 h-[1px] bg-[#f0b8c8]" />
      </div>

      {/* Aviso rosa */}
      <div className="bg-[#fde8ed] border border-[#f0b8c8] rounded-2xl px-6 py-4 max-w-xs w-full">
        <p className="font-lato text-[5.5vw] text-[#b5566e] font-bold leading-relaxed">
          🌸 ¡Reserva el rosa para la quinceañera! 🌸
        </p>
      </div>

      {/* Separador */}
      <div className="flex items-center gap-3 w-full max-w-xs">
        <div className="flex-1 h-[1px] bg-[#f0b8c8]" />
        <span className="text-[4vw] text-[#e8a0b0]">✦</span>
        <div className="flex-1 h-[1px] bg-[#f0b8c8]" />
      </div>

      {/* Chicas */}
      <div className="flex flex-col items-center gap-2 max-w-xs">
        <span className="text-[8vw]">💃</span>
        <p className="font-lato text-[4vw] text-[#3a1a22] leading-relaxed">
          <span className="font-bold text-[#c0486a]">✨ Chicas:</span><br />
          Vestiditos lindos midi o cortos,<br />
          ¡a brillar!
        </p>
      </div>

      {/* Separador suave */}
      <div className="w-8 h-[1px] bg-[#f0b8c8]" />

      {/* Chicos */}
      <div className="flex flex-col items-center gap-2 max-w-xs">
        <span className="text-[8vw]">🎉</span>
        <p className="font-lato text-[4vw] text-[#3a1a22] leading-relaxed">
          <span className="font-bold text-[#c0486a]">Chicos:</span><br />
          Traje oscuro + corbata,<br />
          ¡listos para la fiesta!
        </p>
      </div>

    </section>
  );
}
