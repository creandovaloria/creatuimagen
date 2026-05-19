interface Props {
  collage: string;
  tira: string;
}

export default function Fotos({ collage, tira }: Props) {
  return (
    <section className="flex flex-col w-full reveal"
      style={{ background: "#fdf6f0" }}>


      {/* Label sección */}
      <div className="flex items-center gap-3 px-6 pt-8 pb-4">
        <div className="flex-1 h-[1px] bg-[#f0b8c8]" />
        <span className="font-dancing text-[6vw] text-[#d4718a]">momentos</span>
        <div className="flex-1 h-[1px] bg-[#f0b8c8]" />
      </div>

      {/* Collage */}
      <div className="w-full px-4 pb-4">
        <div className="w-full rounded-2xl overflow-hidden shadow-md border border-[#f5c2d0]">
          <img src={collage} alt="Fotos de Regina" className="w-full h-auto block" />
        </div>
      </div>

      {/* Tira fotográfica */}
      <div className="w-full px-4 pb-8">
        <div className="w-full rounded-2xl overflow-hidden shadow-md border border-[#f5c2d0]">
          <img src={tira} alt="My Story" className="w-full h-auto block" />
        </div>
      </div>

    </section>
  );
}
