'use client'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function EventosPage() {
  const { data: session } = useSession()
  const [eventos, setEventos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/eventos').then(r => r.json()).then(d => { setEventos(d.eventos || []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800"><i className="fas fa-calendar-alt mr-2 text-eventx-primary"></i>Meus Eventos</h1>
        <Link href="/eventos/criar" className="btn-eventx-primary"><i className="fas fa-plus mr-2"></i>Novo Evento</Link>
      </div>

      {loading ? (
        <div className="text-center py-10"><i className="fas fa-spinner fa-spin text-3xl text-eventx-primary"></i></div>
      ) : eventos.length === 0 ? (
        <div className="eventx-card text-center py-12">
          <i className="fas fa-calendar-times text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum evento encontrado</h3>
          <p className="text-gray-400 mb-4">Comece criando seu primeiro evento!</p>
          <Link href="/eventos/criar" className="btn-eventx-primary">Criar Evento</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventos.map((evento: any) => (
            <div key={evento.id} className="eventx-card hover:border-eventx-primary border-2 border-transparent transition-all">
              <h3 className="text-lg font-bold text-gray-800 mb-2">{evento.nomeEvento}</h3>
              <div className="space-y-1 text-sm text-gray-500">
                <p><i className="fas fa-calendar mr-2"></i>{new Date(evento.dataEvento).toLocaleDateString('pt-BR')}</p>
                <p><i className="fas fa-clock mr-2"></i>{evento.horaInicio} - {evento.horaFim}</p>
                <p><i className="fas fa-tag mr-2"></i>{evento.tipoEvento}</p>
                <p><i className="fas fa-users mr-2"></i>{evento.publicoEstimado} pessoas</p>
              </div>
              <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold ${
                evento.statusEvento === 'Planejado' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
              }`}>{evento.statusEvento}</span>
              <div className="flex gap-2 mt-4">
                <Link href={`/eventos/${evento.id}`} className="text-sm text-eventx-primary hover:underline"><i className="fas fa-eye mr-1"></i>Ver</Link>
                <Link href={`/eventos/${evento.id}/editar`} className="text-sm text-blue-600 hover:underline"><i className="fas fa-edit mr-1"></i>Editar</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
