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
    <section className="bg-[#fff8fa] flex flex-col items-center px-6 py-10 gap-5 text-center reveal">
      <h2 className="font-dancing text-[10vw] text-[#c0486a] leading-tight">
        Lugar del evento
      </h2>

      {porDefinir ? (
        /* ── POR DEFINIR ── */
        <div className="flex flex-col items-center gap-4 py-6">
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
          <div className="font-lato text-[4vw] text-[#6b4a52] leading-relaxed">
            <strong className="font-playfair text-[5.5vw] text-[#2a1a1f] block mb-1">{nombre}</strong>
            {direccion?.split("\n").map((line, i) => <span key={i}>{line}<br /></span>)}<br />
            🗓 {fecha} &nbsp;·&nbsp; 🕓 {hora}
          </div>
          {mapsUrl && (
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-gray-800 border border-gray-300 rounded-full px-8 py-3 font-lato text-[3.8vw] font-bold tracking-wide shadow-sm">
              📍 Abrir en Google Maps
            </a>
          )}
        </>
      )}
    </section>
  );
}
