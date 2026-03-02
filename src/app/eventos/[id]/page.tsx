'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function EventoDetalhesPage({ params }: { params: { id: string } }) {
  const [evento, setEvento] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/eventos/${params.id}`).then(r => r.json()).then(d => { setEvento(d.evento); setLoading(false) }).catch(() => setLoading(false))
  }, [params.id])

  if (loading) return <div className="flex justify-center py-20"><i className="fas fa-spinner fa-spin text-4xl text-eventx-primary"></i></div>
  if (!evento) return <div className="text-center py-20"><h2 className="text-2xl text-gray-500">Evento nao encontrado</h2></div>

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{evento.nomeEvento}</h1>
          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${evento.statusEvento === 'Planejado' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{evento.statusEvento}</span>
        </div>
        <div className="flex gap-2">
          <Link href={`/eventos/${params.id}/editar`} className="btn-eventx-secondary text-sm"><i className="fas fa-edit mr-1"></i>Editar</Link>
          <Link href="/eventos" className="text-sm text-gray-500 hover:text-gray-700 py-2 px-4"><i className="fas fa-arrow-left mr-1"></i>Voltar</Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="eventx-card">
          <h3 className="font-bold text-lg mb-3"><i className="fas fa-info-circle mr-2 text-eventx-primary"></i>Informacoes</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Data:</strong> {new Date(evento.dataEvento).toLocaleDateString('pt-BR')}</p>
            <p><strong>Horario:</strong> {evento.horaInicio} - {evento.horaFim}</p>
            <p><strong>Tipo:</strong> {evento.tipoEvento}</p>
            <p><strong>Publico:</strong> {evento.publicoEstimado} pessoas</p>
            <p><strong>Orcamento:</strong> R$ {Number(evento.custoEstimado).toFixed(2)}</p>
          </div>
        </div>

        <div className="eventx-card">
          <h3 className="font-bold text-lg mb-3"><i className="fas fa-align-left mr-2 text-eventx-primary"></i>Descricao</h3>
          <p className="text-gray-600">{evento.descricaoEvento}</p>
        </div>

        {/* Convidados */}
        <div className="eventx-card">
          <h3 className="font-bold text-lg mb-3"><i className="fas fa-users mr-2 text-eventx-primary"></i>Convidados ({evento.listasConvidados?.length || 0})</h3>
          {evento.listasConvidados?.length > 0 ? (
            <div className="space-y-2">
              {evento.listasConvidados.map((lc: any) => (
                <div key={lc.id} className="flex justify-between items-center text-sm border-b pb-2">
                  <span>{lc.convidado?.pessoa?.nome}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${lc.confirmaPresenca === 'Confirmado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{lc.confirmaPresenca}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-400 text-sm">Nenhum convidado</p>}
        </div>

        {/* Despesas */}
        <div className="eventx-card">
          <h3 className="font-bold text-lg mb-3"><i className="fas fa-money-bill mr-2 text-eventx-primary"></i>Despesas</h3>
          {evento.despesas?.length > 0 ? (
            <div className="space-y-2">
              {evento.despesas.map((d: any) => (
                <div key={d.id} className="flex justify-between text-sm border-b pb-2">
                  <span>{d.descricao}</span>
                  <span className="font-semibold">R$ {Number(d.valor).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold pt-2">
                <span>Total</span>
                <span>R$ {evento.despesas.reduce((s: number, d: any) => s + Number(d.valor), 0).toFixed(2)}</span>
              </div>
            </div>
          ) : <p className="text-gray-400 text-sm">Nenhuma despesa</p>}
        </div>
      </div>
    </div>
  )
}
