interface Props {
  collage: string;
  tira: string;
}

export default function Fotos({ collage, tira }: Props) {
  return (
    <section className="flex flex-col w-full reveal"
      style={{ background: "#fdf6f0" }}>


      {/* Tira fotográfica */}
      <div className="w-full px-4 pb-8">
        <div className="w-full rounded-2xl overflow-hidden shadow-md border border-[#f5c2d0]">
          <img src={tira} alt="My Story" className="w-full h-auto block" />
        </div>
      </div>

    </section>
  );
}
