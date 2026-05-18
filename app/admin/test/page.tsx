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

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-xl border border-slate-100 mt-10">
      <h1 className="text-3xl font-black text-slate-900 mb-6">🛠️ Diagnóstico de Conexión CRM</h1>
      
      <div className="space-y-8">
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
