interface Props {
  src: string;
  whatsapp: string;
  mensaje: string;
}

export default function RSVP({ src, whatsapp, mensaje }: Props) {
  const waUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent(mensaje)}`;

  return (
    <section className="flex flex-col items-center px-8 py-12 gap-7 text-center reveal"
      style={{ background: "linear-gradient(160deg, #fff0f4 0%, #fde8ed 60%, #f9d6e0 100%)" }}>

      {/* Flamingo */}
      <div className="relative flex justify-center">
        <div className="absolute inset-0 rounded-full blur-2xl opacity-30"
          style={{ background: "#d4718a", transform: "scale(0.7) translateY(20%)" }} />
        <img src={src} alt="Flamingo"
          className="relative w-[55vw] max-w-[240px] h-auto drop-shadow-xl soft-pulse" />
      </div>

      {/* Mensaje */}
      <div className="flex flex-col gap-3 max-w-sm">
        <p className="font-dancing text-[7vw] text-[#c0486a] leading-snug">
          ¡Me haría muy feliz<br />que vinieras!
        </p>
        <p className="font-lato text-[3.8vw] text-[#6b4a52] leading-relaxed">
          Tu presencia hará que mi cumpleaños sea aún más especial.
          Espero compartir risas, momentos lindos y celebrar juntos este día. 🎀
        </p>
      </div>

      {/* Botón confirmar */}
      <a href={waUrl} target="_blank" rel="noopener noreferrer"
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: "12px", width: "100%", maxWidth: "380px",
          borderRadius: "24px", padding: "26px 32px",
          background: "linear-gradient(135deg, #c0486a 0%, #d4718a 100%)",
          color: "white",
          fontFamily: "var(--font-lato), sans-serif",
          fontSize: "5.5vw", fontWeight: "700",
          letterSpacing: "2px", textTransform: "uppercase",
          textDecoration: "none",
          boxShadow: "0 10px 36px rgba(192,72,106,0.5)",
        }}>
        <span style={{ fontSize: "7vw" }}>💬</span>
        Confirmar asistencia
      </a>

      <p className="font-lato text-[3vw] text-[#b5566e] opacity-70">
        Con Liz Barrón, Event Planner
      </p>
    </section>
  );
}
