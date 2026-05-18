import Link from "next/link"
import { createClient } from '@/lib/supabase/server'
import SignOutButton from '@/components/admin/SignOutButton'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <span className="font-bold text-lg text-slate-800">
            {user?.email === 'creandovalor.ia@gmail.com' ? 'Panel de Control' : 'Mi Cuenta'}
          </span>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {user?.email === 'creandovalor.ia@gmail.com' ? (
            <Link 
              href="/admin" 
              className="flex items-center px-3 py-2 text-sm font-black rounded-md bg-indigo-50 text-indigo-700"
            >
              📊 Centro de Comando
            </Link>
          ) : (
            <Link 
              href="/admin" 
              className="flex items-center px-3 py-2 text-sm font-black rounded-md bg-indigo-50 text-indigo-700"
            >
              📱 Mis Bios Digitales
            </Link>
          )}
          {user?.email === 'creandovalor.ia@gmail.com' && (
            <div className="pt-4 mt-4 border-t border-slate-100">
              <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Negocio & CRM</span>
              <div className="mt-2 space-y-1">
                <Link 
                  href="/admin/ventas" 
                  className="flex items-center px-3 py-2 text-sm font-black rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors"
                >
                  💰 Centro de Ventas
                </Link>
              </div>
              <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest block mt-4">Sistema</span>
              <div className="mt-2 space-y-1">
                <a 
                  href="https://supabase.com" 
                  target="_blank"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  🗄️ Supabase
                </a>
                <a 
                  href="https://vercel.com/creando-valor-ias-projects/creatuimagen-platform" 
                  target="_blank"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  🚀 Vercel
                </a>
                <a 
                  href="https://resend.com/emails" 
                  target="_blank"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  📧 Resend
                </a>
                <a 
                  href="https://www.mercadopago.com.mx/developers/panel/app/6795360745009030/edit-app" 
                  target="_blank"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  💳 Mercado Pago
                </a>
              </div>
            </div>
          )}
        </nav>
        <div className="p-4 border-t border-slate-200 bg-slate-50/50">
          <div className="text-[10px] font-medium text-slate-400 mb-2 px-3 truncate">
            {user?.email}
          </div>
          <SignOutButton />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold text-slate-800">Crea Tu Imagen</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

