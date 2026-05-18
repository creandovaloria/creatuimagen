import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function DiagnosticPage() {
  const supabaseAdmin = getSupabaseAdmin()
  const supabaseUser = await createClient()

  let adminVentas = null
  let adminVentasError = null
  let userVentas = null
  let userVentasError = null

  // 1. Query with Admin client (Bypasses RLS, uses service role key)
  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .schema('crm')
        .from('ventas')
        .select('*')
      adminVentas = data
      adminVentasError = error
    } catch (err: any) {
      adminVentasError = { message: err.message }
    }
  } else {
    adminVentasError = { message: 'Supabase Admin client not initialized (missing environment variables on server)' }
  }

  // 2. Query with User client (standard logged in user)
  try {
    const { data, error } = await supabaseUser
      .schema('crm')
      .from('ventas')
      .select('*')
    userVentas = data
    userVentasError = error
  } catch (err: any) {
    userVentasError = { message: err.message }
  }

  // 3. Comparación de llaves (Ocultando el centro sensible)
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

  const anonInfo = {
    length: anonKey.length,
    prefix: anonKey.substring(0, 15),
    suffix: anonKey.substring(anonKey.length - 15),
  }

  const serviceInfo = {
    length: serviceKey.length,
    prefix: serviceKey.substring(0, 15),
    suffix: serviceKey.substring(serviceKey.length - 15),
    isEqual: anonKey === serviceKey
  }

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-xl border border-slate-100 mt-10">
      <h1 className="text-3xl font-black text-slate-900 mb-6">🛠️ Diagnóstico de Conexión CRM</h1>
      
      <div className="space-y-8">
        {/* DIAGNÓSTICO DE LLAVES EN VERCEL */}
        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
          <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            Comparación de Llaves de Supabase (Vercel Env Vars)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 bg-white rounded-2xl border border-slate-100">
              <p className="font-bold text-slate-500 mb-2 uppercase text-[9px]">NEXT_PUBLIC_SUPABASE_ANON_KEY</p>
              <p><b>Longitud:</b> {anonInfo.length} caracteres</p>
              <p><b>Inicio:</b> {anonInfo.prefix}...</p>
              <p><b>Final:</b> ...{anonInfo.suffix}</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-100">
              <p className="font-bold text-slate-500 mb-2 uppercase text-[9px]">SUPABASE_SERVICE_ROLE_KEY</p>
              <p><b>Longitud:</b> {serviceInfo.length} caracteres</p>
              <p><b>Inicio:</b> {serviceInfo.prefix}...</p>
              <p><b>Final:</b> ...{serviceInfo.suffix}</p>
            </div>
          </div>
          <div className="mt-4 p-4 rounded-2xl text-sm font-black border text-center">
            {serviceInfo.isEqual ? (
              <span className="text-red-600 bg-red-50 border-red-100 p-2 px-4 rounded-xl inline-block">
                ⚠️ ALERTA CRÍTICA: ¡Las llaves SERVICE_ROLE y ANON son idénticas en Vercel!
              </span>
            ) : (
              <span className="text-emerald-600 bg-emerald-50 border-emerald-100 p-2 px-4 rounded-xl inline-block">
                ✅ Las llaves son distintas en Vercel (Estructura OK)
              </span>
            )}
          </div>
        </div>

        {/* CLIENTE ADMINISTRADOR (Service Role) */}
        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
          <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            1. Consulta con Cliente Administrador (Service Role)
          </h2>
          {adminVentasError ? (
            <div className="bg-red-50 text-red-700 p-4 rounded-2xl border border-red-100 font-mono text-xs">
              ❌ ERROR: {JSON.stringify(adminVentasError, null, 2)}
            </div>
          ) : (
            <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl border border-emerald-100 text-sm">
              ✅ ÉXITO: Se encontraron <b>{adminVentas?.length || 0}</b> registros de ventas.
              {adminVentas && adminVentas.length > 0 && (
                <pre className="mt-4 bg-white/50 p-4 rounded-xl font-mono text-xs overflow-auto max-h-40">
                  {JSON.stringify(adminVentas, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>

        {/* CLIENTE USUARIO LOGUEADO (Authenticated) */}
        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
          <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-500"></span>
            2. Consulta con Usuario Logueado (Authenticated)
          </h2>
          {userVentasError ? (
            <div className="bg-red-50 text-red-700 p-4 rounded-2xl border border-red-100 font-mono text-xs">
              ❌ ERROR: {JSON.stringify(userVentasError, null, 2)}
            </div>
          ) : (
            <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl border border-emerald-100 text-sm">
              ✅ ÉXITO: Se encontraron <b>{userVentas?.length || 0}</b> registros de ventas.
              {userVentas && userVentas.length > 0 && (
                <pre className="mt-4 bg-white/50 p-4 rounded-xl font-mono text-xs overflow-auto max-h-40">
                  {JSON.stringify(userVentas, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

