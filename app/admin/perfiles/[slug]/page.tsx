import { createClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import ProfileForm from '@/components/admin/ProfileForm'
import LinksManager from '@/components/admin/LinksManager'
import SignOutButton from '@/components/admin/SignOutButton'
import EmailManagementPanel from '@/components/admin/EmailManagementPanel'

export const dynamic = 'force-dynamic'

export default async function EditProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()
  
  // 0. Verificar si el usuario está autenticado
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect(`/login`)
  }

  // 1. Obtener datos principales del perfil usando el cliente admin (bypasseando RLS para control inteligente)
  const adminClient = getSupabaseAdmin()
  if (!adminClient) {
    return notFound()
  }

  const { data: profile, error: perfilError } = await adminClient
    .from('perfiles')
    .select('*')
    .eq('slug', resolvedParams.slug)
    .single()

  if (perfilError || !profile) {
    return notFound()
  }

  // 2. Control de Acceso Multi-cuenta Premium
  const isAdmin = user.email === 'creandovalor.ia@gmail.com'
  const isOwner = user.id === profile.user_id

  if (!isAdmin && !isOwner) {
    // Si no es el dueño ni el admin, mostramos pantalla inteligente de Acceso Restringido
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center p-6 text-center max-w-lg mx-auto">
        <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-xl shadow-amber-500/5 animate-pulse">
          🔒
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Acceso Restringido</h2>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          Esta Bio digital (<span className="font-bold text-slate-800">/{resolvedParams.slug}</span>) pertenece a otra cuenta y no tienes permisos para editarla.
        </p>

        <div className="bg-slate-50 border border-slate-100 p-5 rounded-[1.5rem] w-full text-left text-xs text-slate-500 mb-8 space-y-2">
          <p>📧 <b>Sesión Activa:</b> <span className="font-bold text-slate-800">{user.email}</span></p>
          {profile.email && (
            <p>🔑 <b>Email Asociado a la Bio:</b> <span className="font-bold text-slate-800">{profile.email}</span></p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <div className="flex-1">
            <SignOutButton />
          </div>
          <Link 
            href="/admin" 
            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs py-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center"
          >
            Volver a Mi Cuenta
          </Link>
        </div>
      </div>
    )
  }

  // 3. Obtener links y VCF usando el cliente privilegiado que corresponda
  const dbClient = isAdmin ? adminClient : supabase


  // 2. Obtener links
  const { data: links } = await dbClient
    .from('perfil_links')
    .select('*')
    .eq('perfil_id', profile.id)
    .order('orden', { ascending: true })

  // 3. Obtener datos de contacto VCF (opcional)
  const { data: vcf } = await dbClient
    .from('contactos_vcf')
    .select('*')
    .eq('perfil_id', profile.id)
    .maybeSingle()

  const fullProfile = {
    ...profile,
    links: links || [],
    vcf: vcf || null
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin" className="text-slate-500 hover:text-slate-700">
            ← Volver
          </Link>
          <h2 className="text-2xl font-bold text-slate-800">Editar Perfil: {profile.nombre}</h2>
        </div>
        <a 
          href={`/${profile.slug}`} 
          target="_blank" 
          className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Ver Tarjeta ↗
        </a>
      </div>

      <div className="space-y-8">
        {/* Top: Profile & VCard Form */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <ProfileForm profile={fullProfile} isAdmin={isAdmin} />
        </div>

        {/* Admin Only: Email Management Panel */}
        {isAdmin && (
          <EmailManagementPanel
            slug={profile.slug}
            currentEmail={profile.email || ''}
            profileName={profile.nombre}
          />
        )}

        {/* Bottom: Dynamic Links */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Enlaces Dinámicos Extras</h3>
          <p className="text-sm text-slate-500 mb-6">
            Usa esta sección para agregar botones dinámicos adicionales (como agendar citas, descargar un PDF, enlaces a tu blog, etc).
          </p>
          <LinksManager perfilId={fullProfile.id} initialLinks={fullProfile.links} />
        </div>
      </div>
    </div>
  )
}
