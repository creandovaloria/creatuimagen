"use client"

import { useState } from 'react'
import { PerfilLinkData, insertPerfilLink, deletePerfilLink } from '@/lib/supabase'

export default function LinksManager({ 
  perfilId, 
  initialLinks,
  isAdmin = false
}: { 
  perfilId: string, 
  initialLinks: PerfilLinkData[],
  isAdmin?: boolean
}) {
  const [links, setLinks] = useState<PerfilLinkData[]>(initialLinks)
  const [isAdding, setIsAdding] = useState(false)
  const [newLink, setNewLink] = useState({ titulo: '', url: '', icono: '🔗', orden: 0 })
  const [isSaving, setIsSaving] = useState(false)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const payload = {
      perfil_id: perfilId,
      titulo: newLink.titulo,
      url: newLink.url,
      icono: newLink.icono,
      orden: links.length // Append to end
    }

    let insertedData: any = null
    let error: any = null

    if (isAdmin) {
      const res = await fetch('/api/admin/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'insert', linkData: payload })
      })
      const resData = await res.json()
      if (res.ok) insertedData = resData.data
      else error = { message: resData.error }
    } else {
      const result = await insertPerfilLink(payload)
      insertedData = result.data
      error = result.error
    }

    if (!error && insertedData) {
      setLinks([...links, insertedData])
      setNewLink({ titulo: '', url: '', icono: '🔗', orden: 0 })
      setIsAdding(false)
    } else {
      alert("Error al agregar link: " + (error?.message || "Error desconocido"))
    }
    setIsSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que quieres eliminar este enlace?")) return
    
    let error: any = null

    if (isAdmin) {
      const res = await fetch('/api/admin/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', linkId: id })
      })
      const resData = await res.json()
      if (!res.ok) error = { message: resData.error }
    } else {
      const result = await deletePerfilLink(id)
      error = result.error
    }

    if (!error) {
      setLinks(links.filter(l => l.id !== id))
    } else {
      alert("Error al eliminar: " + error.message)
    }
  }

  return (
    <div>
      {/* Existing Links List */}
      <div className="space-y-3 mb-6">
        {links.length === 0 && (
          <div className="text-center py-6 text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
            No hay enlaces todavía.
          </div>
        )}
        
        {links.map((link) => (
          <div key={link.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg group hover:border-slate-300 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="text-2xl bg-white h-10 w-10 flex items-center justify-center rounded-md shadow-sm border border-slate-100">
                {link.icono}
              </div>
              <div>
                <h4 className="font-medium text-slate-800">{link.titulo}</h4>
                <p className="text-xs text-slate-500 max-w-[200px] sm:max-w-xs truncate">{link.url}</p>
              </div>
            </div>
            <button 
              onClick={() => handleDelete(link.id)}
              className="text-slate-400 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-all"
              title="Eliminar enlace"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      {/* Add New Link Form */}
      {isAdding ? (
        <form onSubmit={handleAdd} className="bg-indigo-50/50 p-5 rounded-xl border border-indigo-100 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold text-indigo-900">Nuevo Enlace</h4>
            <button type="button" onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-slate-700 text-sm">Cancelar</button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-xs font-medium text-slate-700 mb-1">Emoji / Ícono</label>
              <input 
                type="text" 
                value={newLink.icono} 
                onChange={e => setNewLink({...newLink, icono: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-md sm:text-sm"
                placeholder="🔗"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-xs font-medium text-slate-700 mb-1">Título</label>
              <input 
                type="text" 
                value={newLink.titulo} 
                onChange={e => setNewLink({...newLink, titulo: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-md sm:text-sm"
                placeholder="Ej. Mi LinkedIn"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">URL (Destino)</label>
            <input 
              type="url" 
              value={newLink.url} 
              onChange={e => setNewLink({...newLink, url: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-md sm:text-sm"
              placeholder="https://..."
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isSaving}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md font-medium transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Guardando...' : 'Agregar Enlace'}
          </button>
        </form>
      ) : (
        <button 
          onClick={() => setIsAdding(true)}
          className="w-full py-3 border-2 border-dashed border-slate-300 text-slate-600 font-medium rounded-xl hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center space-x-2"
        >
          <span>➕</span>
          <span>Agregar Nuevo Enlace</span>
        </button>
      )}
    </div>
  )
}
