"use client"

import { useState } from 'react'
import { updatePerfilConVCF, PerfilData, ContactoVCFData } from '@/lib/supabase'

interface ProfileFormProps {
  profile: PerfilData & { vcf: ContactoVCFData | null }
  isAdmin?: boolean
}

const InputField = ({ label, name, type = "text", placeholder = "", value, onChange }: any) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</label>
    <input 
      type={type} 
      name={name} 
      value={value || ''} 
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-700"
    />
  </div>
)

export default function ProfileForm({ profile, isAdmin = false }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    // Perfil Básico
    nombre: profile.nombre,
    rol: profile.rol,
    bio: profile.bio || '',
    foto_url: profile.foto_url || '',
    theme_primary: profile.theme_primary,
    theme_accent: profile.theme_accent,
    // Redes Fijas
    instagram: profile.instagram || '',
    linkedin: profile.linkedin || '',
    tiktok: profile.tiktok || '',
    facebook: profile.facebook || '',
    youtube: profile.youtube || '',
     whatsapp: profile.whatsapp || '',
    usa_colores_tema: profile.usa_colores_tema || false,
    custom_domain: profile.custom_domain || '',
    user_id: profile.user_id || '',
    // VCard
    vcard_nombre_legal: profile.vcf?.nombre_legal || '',
    vcard_telefono: profile.vcf?.telefono || '',
    vcard_email: profile.vcf?.email || '',
    vcard_website: profile.vcf?.website || '',
    vcard_company: profile.vcf?.company || '',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
    setFormData(prev => ({ ...prev, [target.name]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return
      const file = e.target.files[0]
      const maxMb = Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB || 2)
      if (file.size > maxMb * 1024 * 1024) {
        setMessage(`❌ Error: La imagen pesa más de ${maxMb}MB.`)
        return
      }
      
      setIsUploading(true)
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const fileExt = file.name.split('.').pop()
      const fileName = `${profile.slug}-${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName)
      setFormData(prev => ({ ...prev, foto_url: publicUrl }))
      setMessage('✅ Foto cargada. ¡No olvides guardar!')
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage('')

    const perfilUpdates = {
      nombre: formData.nombre,
      rol: formData.rol,
      bio: formData.bio,
      foto_url: formData.foto_url,
      theme_primary: formData.theme_primary,
      theme_accent: formData.theme_accent,
      instagram: formData.instagram,
      linkedin: formData.linkedin,
      tiktok: formData.tiktok,
      facebook: formData.facebook,
      youtube: formData.youtube,
       whatsapp: formData.whatsapp,
      usa_colores_tema: formData.usa_colores_tema,
      custom_domain: formData.custom_domain,
      user_id: formData.user_id || null,
    }

    const vcfUpdates = {
      nombre_legal: formData.vcard_nombre_legal,
      telefono: formData.vcard_telefono,
      email: formData.vcard_email,
      website: formData.vcard_website,
      company: formData.vcard_company,
    }

    let error: any = null

    if (isAdmin) {
      // Admin: usa el endpoint que bypasea RLS con service_role
      const res = await fetch('/api/admin/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: profile.slug,
          perfilId: profile.id,
          perfilUpdates,
          vcfUpdates,
        }),
      })
      const data = await res.json()
      if (!res.ok) error = { message: data.error }
    } else {
      // Usuario normal: usa el cliente anónimo sujeto a RLS
      const result = await updatePerfilConVCF(
        profile.slug,
        profile.id,
        perfilUpdates,
        vcfUpdates,
      )
      error = result.error
    }

    if (error) setMessage(`❌ Error: ${error.message}`)
    else setMessage('✅ Perfil actualizado correctamente')
    setIsSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Formulario */}
        <div className="lg:col-span-2 space-y-8">
          
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-sm">1</span>
              Información del Perfil
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Nombre Público" name="nombre" value={formData.nombre} onChange={handleChange} />
              <InputField label="Cargo / Profesión" name="rol" value={formData.rol} onChange={handleChange} />
              <div className="sm:col-span-2">
                <InputField 
                  label="Dominio Personalizado (Opcional)" 
                  name="custom_domain" 
                  placeholder="ej: lilianachaglla.com" 
                  value={formData.custom_domain} 
                  onChange={handleChange} 
                />
                <p className="text-[10px] text-slate-400 mt-1 italic">
                  Configura esto solo si el cliente tiene un dominio propio apuntando a Vercel.
                </p>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Biografía / Presentación</label>
              <textarea 
                name="bio" 
                value={formData.bio} 
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-700 text-sm"
                placeholder="Escribe una breve descripción..."
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">Foto de Perfil</label>
              <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md bg-white">
                    {formData.foto_url ? (
                      <img src={formData.foto_url} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-2xl">👤</div>
                    )}
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer disabled:opacity-50"
                  />
                  <p className="text-[10px] text-slate-400 italic">Recomendado: Imagen cuadrada, máximo 2MB.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center text-sm">2</span>
              Diseño y Colores
            </h4>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Color Primario</label>
                <div className="flex gap-3 items-center bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <input type="color" name="theme_primary" value={formData.theme_primary} onChange={handleChange} className="h-10 w-12 rounded-lg cursor-pointer bg-transparent" />
                  <code className="text-xs font-mono text-slate-500">{formData.theme_primary}</code>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Color de Acento</label>
                <div className="flex gap-3 items-center bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <input type="color" name="theme_accent" value={formData.theme_accent} onChange={handleChange} className="h-10 w-12 rounded-lg cursor-pointer bg-transparent" />
                  <code className="text-xs font-mono text-slate-500">{formData.theme_accent}</code>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="w-8 h-8 bg-green-50 text-green-600 rounded-lg flex items-center justify-center text-sm">3</span>
              Redes Sociales e Integraciones
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <InputField label="WhatsApp (Link)" name="whatsapp" placeholder="https://wa.me/..." value={formData.whatsapp} onChange={handleChange} />
              <InputField label="Instagram" name="instagram" placeholder="https://instagram.com/..." value={formData.instagram} onChange={handleChange} />
              <InputField label="LinkedIn" name="linkedin" placeholder="https://linkedin.com/..." value={formData.linkedin} onChange={handleChange} />
              <InputField label="TikTok" name="tiktok" placeholder="https://tiktok.com/@..." value={formData.tiktok} onChange={handleChange} />
            </div>
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <input id="usa_colores" name="usa_colores_tema" type="checkbox" checked={formData.usa_colores_tema} onChange={handleChange} className="w-5 h-5 rounded-md text-blue-600 border-slate-300 focus:ring-blue-500 transition-all" />
              <label htmlFor="usa_colores" className="text-sm font-semibold text-slate-700 cursor-pointer">Usar los colores del tema en los iconos de redes sociales</label>
            </div>
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center text-sm">4</span>
              Datos de Contacto (VCard)
            </h4>
            <p className="text-[11px] text-slate-400 -mt-2">
              Estos son los datos que se descargarán cuando el usuario haga clic en el botón "Guardar Contacto".
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <InputField label="Nombre Legal Completo" name="vcard_nombre_legal" placeholder="Ej: Liliana Elizabeth Chaglla Rodríguez" value={formData.vcard_nombre_legal} onChange={handleChange} />
              <InputField label="Teléfono de Contacto" name="vcard_telefono" placeholder="Ej: +52 55 1234 5678" value={formData.vcard_telefono} onChange={handleChange} />
              <InputField label="Email de Contacto" name="vcard_email" placeholder="Ej: informacion@gmail.com" value={formData.vcard_email} onChange={handleChange} />
              <InputField label="Empresa / Organización" name="vcard_company" placeholder="Ej: Crea Tu Imagen" value={formData.vcard_company} onChange={handleChange} />
              <div className="sm:col-span-2">
                <InputField label="Sitio Web (Opcional)" name="vcard_website" placeholder="Ej: https://lilianachaglla.com" value={formData.vcard_website} onChange={handleChange} />
              </div>
            </div>
          </section>

        </div>

        {/* Columna Derecha: Acciones y Resumen */}
        <div className="space-y-6">
          <div className="sticky top-24 space-y-6">
            <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400">Acciones</h4>
              <button 
                type="submit" 
                disabled={isSaving}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-900/20 active:scale-95 disabled:opacity-50"
              >
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <a 
                href={`/${profile.slug}`} 
                target="_blank" 
                className="w-full bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-2xl font-bold block text-center transition-all border border-slate-700"
              >
                Ver Perfil Público ↗
              </a>
            </div>

            {message && (
              <div className={`p-4 rounded-2xl text-sm font-bold animate-in fade-in slide-in-from-top-2 ${message.startsWith('✅') ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                {message}
              </div>
            )}

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Acceso de Cliente</h4>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Supabase User ID</label>
                  <input 
                    type="text" 
                    name="user_id" 
                    value={formData.user_id} 
                    onChange={handleChange}
                    placeholder="ID del usuario en Auth"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-mono outline-none focus:border-blue-500"
                  />
                </div>
                <p className="text-[9px] text-slate-400 italic leading-tight">
                  Copia el ID del usuario desde el Dashboard de Supabase (Auth) y pégalo aquí para que el cliente pueda gestionar su propio perfil.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Información de Sistema</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-slate-400">Slug:</span> <span className="font-mono font-bold">{profile.slug}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">ID:</span> <span className="font-mono text-[10px]">{profile.id}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
