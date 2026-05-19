interface Props {
  src?: string;
  nombre?: string;
  direccion?: string;
  fecha?: string;
  hora?: string;
  mapsUrl?: string;
  porDefinir?: boolean;
}

export default function Venue({ src, nombre, direccion, fecha, hora, mapsUrl, porDefinir }: Props) {
  return (
    <section className="bg-[#fff8fa] flex flex-col items-center px-6 py-14 gap-8 text-center reveal">
      <h2 className="font-dancing text-[10vw] text-[#c0486a] leading-tight">
        Lugar del evento
      </h2>

      {porDefinir ? (
        /* ── POR DEFINIR ── */
        <div className="flex flex-col items-center gap-6 py-6">
          <span className="text-[12vw]">📍</span>
          <p className="font-dancing text-[7vw] text-[#d4718a]">Próximamente...</p>
          <p className="font-lato text-[4vw] text-[#6b4a52] max-w-xs leading-relaxed">
            Te compartiremos el lugar muy pronto 🎀
          </p>
          <p className="font-lato text-[3.5vw] text-[#b5566e] font-bold tracking-wide">
            🗓 Sábado 6 de Junio, 2026 &nbsp;·&nbsp; 🕓 4:00 pm
          </p>
        </div>
      ) : (
        /* ── LUGAR DEFINIDO ── */
        <>
          {src && (
            <div className="w-full rounded-2xl overflow-hidden border-[3px] border-[#f5c2d0] shadow-lg leading-none">
              <img src={src} alt={nombre} className="w-full h-auto block" />
            </div>
          )}
          <div className="font-lato text-[4.2vw] text-[#6b4a52] leading-[1.9] max-w-xs">
            <strong className="font-playfair text-[6vw] text-[#2a1a1f] block mb-4">{nombre}</strong>
            {direccion?.split("\n").map((line, i) => <span key={i}>{line}<br /></span>)}
          </div>
          <p className="font-lato text-[4vw] text-[#b5566e] font-bold leading-relaxed">
            🗓 {fecha}<br />🕓 {hora}
          </p>
          {mapsUrl && (
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                background: "linear-gradient(135deg, #c0486a 0%, #d4718a 100%)",
                color: "white", borderRadius: 16, padding: "16px 32px",
                fontFamily: "var(--font-lato), sans-serif",
                fontSize: "4vw", fontWeight: 700, letterSpacing: "1px",
                textDecoration: "none",
                boxShadow: "0 6px 24px rgba(192,72,106,0.4)",
              }}>
              📍 Abrir en Google Maps
            </a>
          )}
        </>
      )}
    </section>
  );
}
