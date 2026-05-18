'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegistroPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [emailSuggestion, setEmailSuggestion] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    whatsapp: '',
    slug: ''
  });

  const handleEmailChange = (val: string) => {
    setFormData({ ...formData, email: val });
    
    const parts = val.split('@');
    if (parts.length === 2) {
      const domain = parts[1].toLowerCase().trim();
      const commonTypos: { [key: string]: string } = {
        'gmai.com': 'gmail.com',
        'gamil.com': 'gmail.com',
        'gmial.com': 'gmail.com',
        'gmaill.com': 'gmail.com',
        'gml.com': 'gmail.com',
        'hotmai.com': 'hotmail.com',
        'hotmial.com': 'hotmail.com',
        'hormail.com': 'hotmail.com',
        'outloo.com': 'outlook.com',
        'yaho.com': 'yahoo.com'
      };
      if (commonTypos[domain]) {
        setEmailSuggestion(`${parts[0]}@${commonTypos[domain]}`);
      } else {
        setEmailSuggestion(null);
      }
    } else {
      setEmailSuggestion(null);
    }
  };

  const handleNombreChange = (val: string) => {
    const slug = val.toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    setFormData({ ...formData, nombre: val, slug });
  };

  const [whatsappData, setWhatsappData] = useState({ code: '52', number: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    // 🛡️ VALIDACIÓN AUTOMÁTICA Y ESTRICTA DE TYPOS EN EMAIL
    const parts = formData.email.split('@');
    if (parts.length === 2) {
      const domain = parts[1].toLowerCase().trim();
      const invalidDomains = [
        'gmai.com', 'gamil.com', 'gmial.com', 'gmaill.com', 'gml.com',
        'hotmai.com', 'hotmial.com', 'hormail.com',
        'outloo.com', 'yaho.com', 'yahoo.co'
      ];
      if (invalidDomains.includes(domain)) {
        alert(`⚠️ El dominio "@${domain}" es incorrecto o tiene un error de dedo.\n\nPor favor, corrígelo (ej. usando el botón "Sí, corregir correo" en pantalla) antes de proceder al pago para garantizar que recibas tus credenciales de acceso.`);
        return;
      }
    }
    
    setLoading(true);

    const fullWhatsapp = `${whatsappData.code}${whatsappData.number}`.replace(/\D/g, '');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          whatsapp: `+${fullWhatsapp}`
        })
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al procesar tu solicitud. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center py-12 px-4 font-sans">
      <div className="w-full max-w-[440px] space-y-8">
        
        {/* Logo & Header */}
        <div className="flex flex-col items-center space-y-6">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl rotate-3 shadow-xl flex items-center justify-center transform hover:rotate-0 transition-transform">
            <span className="text-white text-3xl font-black italic">B</span>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tu Bio Profesional</h1>
            <p className="text-slate-500 font-medium mt-1">Crea tu presencia digital en segundos.</p>
          </div>
        </div>

        {/* Card Formulario */}
        <form 
          onSubmit={handleSubmit} 
          className="bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-8 md:p-10 space-y-6"
        >
          {/* Campo: Nombre */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tu Nombre Completo</label>
            <input
              type="text"
              placeholder="Ej. Arturo Barrios"
              required
              className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-100 transition-all outline-none text-slate-800 font-bold"
              value={formData.nombre}
              onChange={(e) => handleNombreChange(e.target.value)}
            />
          </div>

          {/* Campo: Email */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email de Acceso</label>
            <input
              type="email"
              placeholder="hola@ejemplo.com"
              required
              className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-100 transition-all outline-none text-slate-800 font-bold"
              value={formData.email}
              onChange={(e) => handleEmailChange(e.target.value)}
            />
            {emailSuggestion && (
              <div className="mt-2 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col space-y-2 transition-all">
                <div className="flex items-start space-x-2">
                  <span className="text-amber-500 text-lg leading-none mt-0.5">⚠️</span>
                  <div className="text-xs text-amber-800 font-bold leading-relaxed">
                    ¿Quisiste decir <span className="text-amber-950 underline decoration-amber-400 font-black">{emailSuggestion}</span>? 
                    Por favor verifica para asegurar el envío de tus accesos.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, email: emailSuggestion });
                    setEmailSuggestion(null);
                  }}
                  className="self-end px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-black rounded-lg transition-colors cursor-pointer"
                >
                  Sí, corregir correo
                </button>
              </div>
            )}
          </div>

          {/* Campo: WhatsApp Dividido con Selector de País */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">WhatsApp de Contacto</label>
            <div className="flex space-x-3">
              <div className="relative w-32">
                <select
                  className="w-full pl-3 pr-8 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-100 transition-all outline-none text-slate-800 font-bold appearance-none cursor-pointer"
                  value={whatsappData.code}
                  onChange={(e) => setWhatsappData({ ...whatsappData, code: e.target.value })}
                >
                  <option value="52">🇲🇽 +52</option>
                  <option value="1">🇺🇸 +1</option>
                  <option value="34">🇪🇸 +34</option>
                  <option value="54">🇦🇷 +54</option>
                  <option value="57">🇨🇴 +57</option>
                  <option value="56">🇨🇱 +56</option>
                  <option value="51">🇵🇪 +51</option>
                  <option value="593">🇪🇨 +593</option>
                  <option value="58">🇻🇪 +58</option>
                  <option value="502">🇬🇹 +502</option>
                  <option value="506">🇨🇷 +506</option>
                  <option value="507">🇵🇦 +507</option>
                  <option value="1">🇩🇴 +1</option>
                  <option value="598">🇺🇾 +598</option>
                  <option value="591">🇧🇴 +591</option>
                  <option value="595">🇵🇾 +595</option>
                  <option value="503">🇸🇻 +503</option>
                  <option value="504">🇭🇳 +504</option>
                  <option value="505">🇳🇮 +505</option>
                  <option value="1-PR">🇵🇷 +1</option>
                  <option value="55">🇧🇷 +55</option>
                  <option value="39">🇮🇹 +39</option>
                  <option value="33">🇫🇷 +33</option>
                  <option value="49">🇩🇪 +49</option>
                  <option value="44">🇬🇧 +44</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <input
                type="tel"
                placeholder="55 1234 5678"
                required
                className="flex-1 px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-100 transition-all outline-none text-slate-800 font-bold"
                value={whatsappData.number}
                onChange={(e) => setWhatsappData({ ...whatsappData, number: e.target.value.replace(/\D/g, '') })}
              />
            </div>
          </div>

          {/* Campo: URL Personalizada */}
          <div className="bg-blue-50/50 rounded-3xl p-6 border border-blue-100/50 space-y-3">
            <label className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em]">URL Reservada</label>
            <div className="space-y-2">
              <div className="text-blue-600 font-black text-sm break-all">
                bios.creatuimagen.online/<span className="text-blue-800 underline decoration-blue-200">{formData.slug || 'tu-link'}</span>
              </div>
              <input
                type="text"
                placeholder="personalizar-link"
                className="w-full px-4 py-2 bg-white border border-blue-100 rounded-xl outline-none focus:border-blue-300 text-xs font-bold text-blue-900"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
              />
            </div>
          </div>

          {/* Botón de Pago */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="relative w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl text-lg shadow-xl shadow-blue-100 transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 overflow-hidden"
            >
              <div className="relative z-10 flex items-center justify-center">
                {loading ? (
                  <span className="flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Procesando...</span>
                  </span>
                ) : (
                  "Obtener mi Bio — $950 MXN"
                )}
              </div>
            </button>
            <p className="text-center text-[10px] text-slate-400 font-bold uppercase mt-4 tracking-tighter">
              🔒 Pago seguro procesado por Mercado Pago
            </p>
          </div>
        </form>

        {/* Footer info */}
        <p className="text-center text-slate-400 text-[11px] leading-relaxed px-6">
          Al continuar, aceptas que te enviemos tus accesos vía WhatsApp y Email. El proceso de configuración toma menos de 2 minutos.
        </p>
      </div>
    </div>
  );
}
