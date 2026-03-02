'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CriarEventoPage() {
  const [form, setForm] = useState({ nomeEvento: '', descricaoEvento: '', dataEvento: '', tipoEvento: '', horaInicio: '', horaFim: '', publicoEstimado: '', custoEstimado: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/eventos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) { setError(data.error); setLoading(false); return }
      router.push('/eventos')
    } catch { setError('Erro ao criar evento'); setLoading(false) }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6"><i className="fas fa-calendar-plus mr-2 text-eventx-primary"></i>Criar Evento</h1>
      <form onSubmit={handleSubmit} className="eventx-card space-y-5">
        {error && <div className="alert-error"><i className="fas fa-exclamation-triangle"></i> {error}</div>}
        <div><label className="eventx-label">Nome do Evento *</label><input name="nomeEvento" value={form.nomeEvento} onChange={handleChange} className="eventx-input" required /></div>
        <div><label className="eventx-label">Descricao *</label><textarea name="descricaoEvento" value={form.descricaoEvento} onChange={handleChange} className="eventx-input" rows={4} required /></div>
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="eventx-label">Data do Evento *</label><input type="date" name="dataEvento" value={form.dataEvento} onChange={handleChange} className="eventx-input" required /></div>
          <div><label className="eventx-label">Tipo de Evento *</label>
            <select name="tipoEvento" value={form.tipoEvento} onChange={handleChange} className="eventx-input" required>
              <option value="">Selecione</option>
              <option>Casamento</option><option>Aniversario</option><option>Corporativo</option><option>Festa</option><option>Conferencia</option><option>Workshop</option><option>Outro</option>
            </select>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="eventx-label">Hora Inicio *</label><input type="time" name="horaInicio" value={form.horaInicio} onChange={handleChange} className="eventx-input" required /></div>
          <div><label className="eventx-label">Hora Fim *</label><input type="time" name="horaFim" value={form.horaFim} onChange={handleChange} className="eventx-input" required /></div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="eventx-label">Publico Estimado</label><input type="number" name="publicoEstimado" value={form.publicoEstimado} onChange={handleChange} className="eventx-input" /></div>
          <div><label className="eventx-label">Custo Estimado (R$)</label><input type="number" step="0.01" name="custoEstimado" value={form.custoEstimado} onChange={handleChange} className="eventx-input" /></div>
        </div>
        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="btn-eventx-primary disabled:opacity-50">{loading ? 'Criando...' : 'Criar Evento'}</button>
          <button type="button" onClick={() => router.back()} className="btn-eventx-secondary">Cancelar</button>
        </div>
      </form>
    </div>
  )
}
