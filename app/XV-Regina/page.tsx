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
      </section>

      {/* ── SECCIÓN 2: MÚSICA ── */}
      <section className="w-full" style={{ background: "#fff8fa", paddingBottom: "8vw" }}>
        <p className="font-dancing" style={{
          textAlign: "center",
          fontSize: "clamp(32px, 9vw, 52px)",
          color: "#d4718a",
          padding: "6vw 4vw 2vw",
          margin: 0,
          lineHeight: 1.2,
        }}>
          Dale play a mi canción favorita 🎵
        </p>
        <div className="flex justify-center pb-2">
          <span className="text-[#d4718a] animate-bounce" style={{ fontSize: "8vw" }}>↓</span>
        </div>
        <MusicPlayer src={images.musica} />
        <ScrollHint />
      </section>

      <Divider />

      {/* ── SECCIÓN 3: CALENDARIO + COUNTDOWN ── */}
      <CalendarioCountdown eventDate="2026-06-06T14:00:00" />

      <Divider />

      {/* ── SECCIÓN 4: FOTOS (collage + tira) ── */}
      <Fotos collage={images.collage} tira={images.tira} />

      <Divider />

      {/* ── SECCIÓN 5: DRESS CODE + LUGAR ── */}
      <DressCode />

      <Divider />

      <Venue
        src={images.restaurante}
        nombre="Jardín de Fiestas Bambú"
        direccion={"Carretera a Santa Rosa Xajay\nEl Mirador, Cerrada Saturno s/n\nPasando el centro expósitor de feria.\nAtrás del Fracc. Pedregal del Río y Restaurante Cortijo 7."}
        fecha="Sábado 6 de Junio, 2026"
        hora="Recepción 2:00 pm"
        mapsUrl="https://maps.app.goo.gl/wS7SUtj4kFXjmXLa7"
      />

      <Divider />

      {/* ── SECCIÓN 6: REGALOS ── */}
      <section className="flex flex-col items-center px-8 py-12 gap-4 text-center reveal"
        style={{ background: "#fff8fa" }}>
        <span style={{ fontSize: "10vw" }}>💌</span>
        <p className="font-dancing" style={{ fontSize: "clamp(22px, 7vw, 36px)", color: "#c0486a", lineHeight: 1.3 }}>
          Mesa de regalos
        </p>
        <p className="font-lato" style={{ fontSize: "clamp(14px, 4vw, 18px)", color: "#6b4a52", lineHeight: 1.8, maxWidth: 320 }}>
          Tu presencia es mi mejor regalo, pero si deseas consentirme, agradeceré tu detalle en sobre 💌
        </p>
      </section>

      <Divider />

      {/* ── SECCIÓN 7: FLAMINGO + RSVP ── */}
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
