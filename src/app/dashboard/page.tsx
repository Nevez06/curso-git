'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [eventos, setEventos] = useState<any[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login-organizador')
    if (status === 'authenticated') {
      fetch('/api/eventos').then(r => r.json()).then(d => setEventos(d.eventos || []))
    }
  }, [status, router])

  if (status === 'loading') return <div className="flex justify-center py-20"><i className="fas fa-spinner fa-spin text-4xl text-eventx-primary"></i></div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Titulo */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Bem-vindo, Organizador! 🎉</h1>
        <p className="text-gray-500">Gerencie seus eventos com praticidade e eficiencia</p>
      </div>

      {/* Banner */}
      <div className="bg-gradient-to-r from-eventx-primary to-eventx-accent rounded-3xl p-8 md:p-12 mb-8 text-white">
        <p className="text-lg opacity-90">Compartilhe, planeje, convide e gerencie com facilidade</p>
        <h2 className="text-3xl md:text-4xl font-bold uppercase mt-2">EVENTOS EM UM SO LUGAR</h2>
        <Link href="/eventos/criar" className="inline-block mt-6 bg-white text-eventx-primary font-semibold py-3 px-8 rounded-full hover:bg-gray-100 transition-all">
          Criar meu evento
        </Link>
      </div>

      {/* Acoes Rapidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: 'fas fa-envelope', label: 'Convidar', sub: 'Pessoas', href: '/eventos' },
          { icon: 'fas fa-calendar-plus', label: 'Criar', sub: 'Evento', href: '/eventos/criar' },
          { icon: 'fas fa-store', label: 'Escolher', sub: 'Fornecedores', href: '/fornecedor' },
          { icon: 'fas fa-chart-bar', label: 'Gerenciar', sub: 'Orcamento', href: '/administracao' },
        ].map((action, i) => (
          <Link key={i} href={action.href} className="action-grid-item no-underline">
            <i className={`${action.icon} text-3xl`}></i>
            <div className="text-center">
              <span className="block font-semibold">{action.label}</span>
              <span className="block text-sm opacity-80">{action.sub}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Explorar Fornecedores */}
      <Link href="/fornecedor" className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all mb-8 no-underline text-gray-700">
        <i className="fas fa-star text-eventx-primary text-xl"></i>
        <span className="font-semibold">Explorar Fornecedores</span>
        <i className="fas fa-chevron-right ml-auto text-gray-400"></i>
      </Link>

      {/* Categorias */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-8">
        {[
          { icon: 'fas fa-envelope', label: 'Convites' },
          { icon: 'fas fa-palette', label: 'Decoracao' },
          { icon: 'fas fa-building', label: 'Espacos' },
          { icon: 'fas fa-camera', label: 'Fotografia' },
          { icon: 'fas fa-music', label: 'Musica' },
          { icon: 'fas fa-gift', label: 'Lembrancinhas' },
        ].map((cat, i) => (
          <div key={i} className="category-circle text-center">
            <div className="circle-bg"><i className={`${cat.icon} text-white text-xl`}></i></div>
            <span className="text-sm font-medium text-gray-600 mt-1">{cat.label}</span>
          </div>
        ))}
      </div>

      {/* Meus Eventos */}
      {eventos.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Meus Eventos</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {eventos.map((evento: any) => (
              <Link key={evento.id} href={`/eventos/${evento.id}`} className="eventx-card no-underline hover:border-eventx-primary border-2 border-transparent">
                <h4 className="font-bold text-gray-800">{evento.nomeEvento}</h4>
                <p className="text-sm text-gray-500 mt-1">
                  <i className="fas fa-calendar mr-1"></i> {new Date(evento.dataEvento).toLocaleDateString('pt-BR')}
                </p>
                <p className="text-sm text-gray-500">
                  <i className="fas fa-clock mr-1"></i> {evento.horaInicio} - {evento.horaFim}
                </p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                  evento.statusEvento === 'Planejado' ? 'bg-blue-100 text-blue-700' :
                  evento.statusEvento === 'Em andamento' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>{evento.statusEvento}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Botao flutuante IA */}
      <Link href="/ia" className="fixed bottom-6 right-6 bg-eventx-primary text-white rounded-full px-5 py-3 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2 no-underline z-40">
        <i className="fas fa-robot"></i>
        <span className="font-medium">Chat IA</span>
      </Link>
    </div>
  )
}
