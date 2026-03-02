'use client'
import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Message { role: 'user' | 'bot'; content: string }

export default function IAPage() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [eventos, setEventos] = useState<any[]>([])
  const [selectedEvento, setSelectedEvento] = useState<number | null>(null)
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/ia/meus-eventos').then(r => r.json()).then(d => setEventos(d.eventos || [])).catch(() => {})
    setMessages([{ role: 'bot', content: '## 🤖 Assistente Virtual EventX\n\nOla! Sou seu assistente especializado em gestao de eventos.\n\n**Como posso ajudar?**\n- 📊 Analise de progresso\n- 👥 Gestao de convidados\n- 💰 Controle de orcamento\n- ✅ Tarefas pendentes\n- 🏪 Sugestoes de fornecedores\n- 💡 Dicas de economia' }])
  }, [])

  useEffect(() => { chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' }) }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const pergunta = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: pergunta }])
    setLoading(true)

    try {
      const res = await fetch('/api/ia/perguntar', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pergunta, eventoId: selectedEvento })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'bot', content: data.resposta || 'Sem resposta.' }])
    } catch {
      setMessages(prev => [...prev, { role: 'bot', content: '❌ Erro ao processar pergunta.' }])
    }
    setLoading(false)
  }

  const quickActions = [
    { label: '📊 Progresso', text: 'Qual o progresso do meu evento?' },
    { label: '👥 Convidados', text: 'Quantos convidados confirmaram?' },
    { label: '💰 Orcamento', text: 'Como esta meu orcamento?' },
    { label: '✅ Tarefas', text: 'Quais tarefas estao pendentes?' },
    { label: '💡 Economia', text: 'Como posso economizar?' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="lg:w-64 space-y-4">
          <div className="eventx-card">
            <h3 className="font-bold text-sm mb-3"><i className="fas fa-calendar mr-2 text-eventx-primary"></i>Selecionar Evento</h3>
            <select value={selectedEvento || ''} onChange={e => setSelectedEvento(e.target.value ? Number(e.target.value) : null)} className="eventx-input text-sm">
              <option value="">Todos os eventos</option>
              {eventos.map((e: any) => <option key={e.id} value={e.id}>{e.nome}</option>)}
            </select>
          </div>
          <div className="eventx-card">
            <h3 className="font-bold text-sm mb-3"><i className="fas fa-bolt mr-2 text-eventx-primary"></i>Acoes Rapidas</h3>
            <div className="space-y-2">
              {quickActions.map((a, i) => (
                <button key={i} onClick={() => { setInput(a.text); }} className="w-full text-left text-sm py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors">{a.label}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat */}
        <div className="flex-1 flex flex-col">
          <div className="eventx-card flex-1 flex flex-col" style={{ minHeight: '500px' }}>
            <div className="flex items-center gap-3 pb-4 border-b mb-4">
              <div className="w-10 h-10 bg-eventx-primary rounded-full flex items-center justify-center">
                <i className="fas fa-robot text-white"></i>
              </div>
              <div>
                <h2 className="font-bold text-gray-800">Assistente EventX</h2>
                <span className="text-xs text-green-500"><i className="fas fa-circle text-[8px] mr-1"></i>Online</span>
              </div>
            </div>

            {/* Messages */}
            <div ref={chatRef} className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2" style={{ maxHeight: '400px' }}>
              {messages.map((msg, i) => (
                <div key={i} className={`chat-bubble ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}`}>
                  <div className="whitespace-pre-wrap text-sm" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/## (.*)/g, '<h3 class="text-lg font-bold mb-2">$1</h3>').replace(/### (.*)/g, '<h4 class="font-semibold mb-1">$1</h4>').replace(/- (.*)/g, '<div class="ml-2">- $1</div>').replace(/\n/g, '<br/>') }} />
                </div>
              ))}
              {loading && <div className="chat-bubble chat-bubble-bot"><i className="fas fa-spinner fa-spin mr-2"></i>Pensando...</div>}
            </div>

            {/* Input */}
            <div className="flex gap-2 pt-4 border-t">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()}
                className="eventx-input flex-1" placeholder="Digite sua pergunta..." />
              <button onClick={sendMessage} disabled={loading || !input.trim()} className="btn-eventx-primary disabled:opacity-50 px-6">
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
