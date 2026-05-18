'use client'

import { useState } from 'react'

interface EmailManagementPanelProps {
  slug: string
  currentEmail: string
  profileName: string
}

export default function EmailManagementPanel({ slug, currentEmail, profileName }: EmailManagementPanelProps) {
  const [email, setEmail] = useState(currentEmail || '')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null)

  const handleResendEmail = async () => {
    if (!email || !email.includes('@')) {
      setResult({ type: 'error', message: 'Por favor ingresa un correo electrónico válido.' })
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/admin/resend-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, newEmail: email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setResult({ type: 'error', message: data.error || 'Error desconocido' })
        return
      }

      if (data.success) {
        setResult({ type: 'success', message: `✅ Email actualizado y correo de bienvenida reenviado a ${email}` })
      } else if (data.emailUpdated && !data.emailSent) {
        setResult({ type: 'warning', message: `⚠️ Email actualizado en la base de datos, pero falló el envío del correo: ${data.error}` })
      }
    } catch (err: any) {
      setResult({ type: 'error', message: `Error de red: ${err.message}` })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-amber-200 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center text-lg">
          📧
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800">Gestión de Correo del Cliente</h3>
          <p className="text-xs text-slate-500">Solo visible para administradores</p>
        </div>
        <span className="ml-auto text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-bold">
          ADMIN
        </span>
      </div>

      {/* Info actual */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5">
        <p className="text-xs text-slate-500 mb-1 font-semibold uppercase tracking-wide">Cliente</p>
        <p className="text-sm font-bold text-slate-800">{profileName}</p>
        <p className="text-xs text-slate-500 mt-2 mb-1 font-semibold uppercase tracking-wide">Email actual en BD</p>
        <p className="text-sm font-mono text-blue-600">{currentEmail || '(sin email)'}</p>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
            Nuevo Email Correcto del Cliente
          </label>
          <input
            type="email"
            id="admin-email-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo.correcto@ejemplo.com"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none text-slate-700 font-mono text-sm"
          />
        </div>

        <button
          id="admin-resend-email-btn"
          onClick={handleResendEmail}
          disabled={isLoading || !email}
          className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="animate-spin">⏳</span>
              Actualizando y reenviando...
            </>
          ) : (
            <>
              📨 Actualizar Email y Reenviar Bienvenida
            </>
          )}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className={`mt-4 p-4 rounded-xl text-sm font-medium border ${
          result.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-800'
            : result.type === 'warning'
            ? 'bg-amber-50 border-amber-200 text-amber-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {result.message}
        </div>
      )}

      {/* Warning note */}
      <p className="text-xs text-slate-400 mt-4 leading-relaxed">
        💡 Esto actualiza el email en Supabase y reenvía el correo de bienvenida con las credenciales de acceso al nuevo email indicado.
      </p>
    </div>
  )
}
