import type { Metadata } from "next";
import Petals from "@/components/invitaciones/Petals";
import MusicPlayer from "@/components/invitaciones/MusicPlayer";
import CalendarioCountdown from "@/components/invitaciones/CalendarioCountdown";
import Fotos from "@/components/invitaciones/Fotos";
import DressCode from "@/components/invitaciones/DressCode";
import Venue from "@/components/invitaciones/Venue";
import Tira from "@/components/invitaciones/Tira";
import RSVP from "@/components/invitaciones/RSVP";
import Footer from "@/components/invitaciones/Footer";
import ScrollReveal from "@/components/invitaciones/ScrollReveal";
import ScrollHint from "@/components/invitaciones/ScrollHint";
import { images } from "@/lib/regina-images";

export const metadata: Metadata = {
  title: "XV Años – Regina 🎀",
  description: "¡Estás invitado a celebrar los XV años de Regina! 6 de Junio 2026",
};

function Divider() {
  return (
    <div className="w-full py-3 flex items-center justify-center gap-2"
      style={{ background: "#fdf0f3" }}>
      <div className="flex-1 h-[1px] max-w-[60px]" style={{ background: "linear-gradient(to right, transparent, #f0b8c8)" }} />
      <span style={{ color: "#e8a0b0", fontSize: "3vw" }}>✦ ✧ ✦</span>
      <div className="flex-1 h-[1px] max-w-[60px]" style={{ background: "linear-gradient(to left, transparent, #f0b8c8)" }} />
    </div>
  );
}

export default function XVRegina() {
  return (
    <main className="relative w-full overflow-x-hidden" style={{ background: "#fdf0f3" }}>
      <Petals />

      {/* ── SECCIÓN 1: INTRO ── */}
      <section className="w-full leading-none relative">
        <img src={images.intro} alt="Invitación XV años Regina" className="w-full h-auto block" />
        <ScrollHint />
      </section>

      {/* ── SECCIÓN 2: MÚSICA ── */}
      <section className="w-full" style={{ background: "#fff8fa", paddingBottom: "8vw" }}>
        <p style={{
          textAlign: "center",
          fontFamily: "'Dancing Script', cursive",
          fontSize: "clamp(18px, 5.5vw, 28px)",
          color: "#d4718a",
          padding: "6vw 4vw 2vw",
          margin: 0,
        }}>
          Dale play a mi canción favorita 🎵
        </p>
        <MusicPlayer src={images.musica} />
      </section>

      <Divider />

      {/* ── SECCIÓN 3: CALENDARIO + COUNTDOWN ── */}
      <CalendarioCountdown eventDate="2026-06-06T16:00:00" />

      <Divider />

      {/* ── SECCIÓN 4: FOTOS (collage + tira) ── */}
      <Fotos collage={images.collage} tira={images.tira} />

      <Divider />

      {/* ── SECCIÓN 5: DRESS CODE + LUGAR ── */}
      <DressCode />
      <Venue porDefinir />

      <Divider />

      {/* ── SECCIÓN 6: FLAMINGO + RSVP ── */}
      <RSVP
        src={images.flamingo}
        whatsapp="524272199374"
        mensaje="Hola Liz Barrón, te escribo referente a mi asistencia/inasistencia a la fiesta de Regina 🎀 Mi nombre es: "
      />

      {/* ── FOOTER ── */}
      <Footer />

      <ScrollReveal />
    </main>
  );
}
