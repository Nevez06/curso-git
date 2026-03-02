// Servico EventBot (convertido de EventBotService.cs)
import { prisma } from '@/lib/prisma'
import { Decimal } from '@prisma/client/runtime/library'

export class EventBotService {

  static async processarPergunta(pergunta: string, eventoId?: number, userId?: number): Promise<string> {
    try {
      const lower = pergunta.toLowerCase()

      if ((lower.includes('orçamento') && lower.includes('criar')) ||
          (lower.includes('planejar') && lower.includes('evento')) ||
          lower.includes('sugerir fornecedor') || lower.includes('recomendar')) {
        return await this.criarOrcamentoInteligente(eventoId, pergunta)
      }

      const resposta = await this.processarPerguntaComContexto(pergunta, eventoId)
      await this.salvarInteracao(pergunta, resposta, eventoId, userId)
      return resposta
    } catch (ex) {
      return 'Desculpe, ocorreu um erro. Tente perguntar algo mais específico.'
    }
  }

  private static async processarPerguntaComContexto(pergunta: string, eventoId?: number): Promise<string> {
    const lower = pergunta.toLowerCase()
    if (lower.includes('progresso') || lower.includes('andamento')) return await this.analisarProgresso(eventoId)
    if (lower.includes('convidados') || lower.includes('confirmaram')) return await this.analisarConvidados(eventoId)
    if (lower.includes('tarefas') || lower.includes('pendentes')) return await this.analisarTarefas(eventoId)
    if (lower.includes('orçamento') || lower.includes('gastos') || lower.includes('despesas')) return await this.analisarOrcamento(eventoId)
    if (lower.includes('fornecedor')) return await this.analisarFornecedores()
    if (lower.includes('economia') || lower.includes('economizar')) return this.darDicasEconomia()
    return this.respostaGenerica(eventoId)
  }

  static async analisarProgresso(eventoId?: number): Promise<string> {
    if (!eventoId) {
      const count = await prisma.evento.count()
      return `📊 **Resumo Geral**\n\nVocê tem **${count} eventos** cadastrados. Selecione um evento para análises detalhadas! 🎯`
    }

    const evento = await prisma.evento.findUnique({
      where: { id: eventoId },
      include: { listasConvidados: true, despesas: true, tarefasEventos: true, pedidos: true }
    })
    if (!evento) return '❌ Evento não encontrado.'

    const diasRestantes = Math.ceil((new Date(evento.dataEvento).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    const tarefasConcluidas = evento.tarefasEventos.filter(t => t.statusConclusao === 'Concluída').length
    const tarefasTotal = evento.tarefasEventos.length
    const convidadosConfirmados = evento.listasConvidados.filter(c => c.confirmaPresenca === 'Confirmado').length
    const totalConvidados = evento.listasConvidados.length
    const despesasTotal = evento.despesas.reduce((s, d) => s + Number(d.valor), 0)
    const custoEstimado = Number(evento.custoEstimado)
    const percentualOrcamento = custoEstimado > 0 ? (despesasTotal / custoEstimado) * 100 : 0
    const status = diasRestantes < 7 ? '🔥 URGENTE' : diasRestantes < 30 ? '⚠️ ATENÇÃO' : '✅ NO PRAZO'

    return `## 📊 Progresso: **${evento.nomeEvento}**\n\n` +
      `### 📅 Timeline\n- **Status:** ${status}\n- **Dias restantes:** ${diasRestantes}\n- **Data:** ${new Date(evento.dataEvento).toLocaleDateString('pt-BR')}\n\n` +
      `### ✅ Tarefas\n- **Concluídas:** ${tarefasConcluidas}/${tarefasTotal} (${tarefasTotal > 0 ? Math.round(tarefasConcluidas * 100 / tarefasTotal) : 0}%)\n\n` +
      `### 👥 Convidados\n- **Confirmados:** ${convidadosConfirmados}/${totalConvidados}\n\n` +
      `### 💰 Orçamento\n- **Gasto:** R$ ${despesasTotal.toFixed(2)} de R$ ${custoEstimado.toFixed(2)} (${percentualOrcamento.toFixed(0)}%)`
  }

  private static async analisarConvidados(eventoId?: number): Promise<string> {
    if (!eventoId) return 'Selecione um evento para analisar os convidados! 🎯'
    const evento = await prisma.evento.findUnique({
      where: { id: eventoId },
      include: { listasConvidados: true }
    })
    if (!evento) return '❌ Evento não encontrado.'
    const confirmados = evento.listasConvidados.filter(c => c.confirmaPresenca === 'Confirmado').length
    const pendentes = evento.listasConvidados.filter(c => c.confirmaPresenca === 'Pendente').length
    const total = evento.listasConvidados.length
    if (total === 0) return `## 👥 **${evento.nomeEvento}**\n\nNenhum convidado cadastrado.`
    return `## 👥 Convidados: **${evento.nomeEvento}**\n\n- ✅ Confirmados: ${confirmados}\n- ⏳ Pendentes: ${pendentes}\n- Total: ${total}`
  }

  private static async analisarTarefas(eventoId?: number): Promise<string> {
    if (!eventoId) return 'Selecione um evento para ver as tarefas! 🎯'
    const evento = await prisma.evento.findUnique({
      where: { id: eventoId },
      include: { tarefasEventos: true }
    })
    if (!evento) return '❌ Evento não encontrado.'
    const concluidas = evento.tarefasEventos.filter(t => t.statusConclusao === 'Concluída').length
    const pendentes = evento.tarefasEventos.filter(t => t.statusConclusao === 'Pendente').length
    return `## ✅ Tarefas: **${evento.nomeEvento}**\n\n- Concluídas: ${concluidas}\n- Pendentes: ${pendentes}\n- Total: ${evento.tarefasEventos.length}`
  }

  static async analisarOrcamento(eventoId?: number): Promise<string> {
    if (!eventoId) return 'Selecione um evento para análise financeira! 🎯'
    const evento = await prisma.evento.findUnique({
      where: { id: eventoId },
      include: { despesas: true }
    })
    if (!evento) return '❌ Evento não encontrado.'
    const totalGasto = evento.despesas.reduce((s, d) => s + Number(d.valor), 0)
    const custoEstimado = Number(evento.custoEstimado)
    const restante = custoEstimado - totalGasto
    const percentual = custoEstimado > 0 ? (totalGasto / custoEstimado) * 100 : 0
    const status = percentual <= 70 ? '✅ SAUDÁVEL' : percentual <= 90 ? '⚠️ ATENÇÃO' : '🔴 CRÍTICO'
    return `## 💰 Financeiro: **${evento.nomeEvento}**\n\n- **Status:** ${status}\n- **Orçamento:** R$ ${custoEstimado.toFixed(2)}\n- **Gasto:** R$ ${totalGasto.toFixed(2)} (${percentual.toFixed(0)}%)\n- **Disponível:** R$ ${restante.toFixed(2)}`
  }

  private static async analisarFornecedores(): Promise<string> {
    const fornecedores = await prisma.fornecedor.findMany({ include: { pessoa: true, produtos: true } })
    if (!fornecedores.length) return '📝 Nenhum fornecedor cadastrado.'
    const melhores = fornecedores.filter(f => Number(f.avaliacaoMedia) > 0).sort((a, b) => Number(b.avaliacaoMedia) - Number(a.avaliacaoMedia)).slice(0, 5)
    let result = `## 🏪 Fornecedores (${fornecedores.length} total)\n\n`
    if (melhores.length) {
      result += '### ⭐ Melhor avaliados:\n'
      melhores.forEach(f => { result += `- **${f.pessoa.nome}** ⭐ ${Number(f.avaliacaoMedia).toFixed(1)}\n` })
    }
    return result
  }

  private static darDicasEconomia(): string {
    return `## 💡 Dicas de Economia\n\n` +
      `- 🤝 Negocie pacotes com fornecedores\n` +
      `- 📅 Evite datas populares\n` +
      `- ⏰ Reserve com antecedência\n` +
      `- 📊 Reserve 10-15% para imprevistos\n` +
      `- 🎯 Priorize: Local > Comida > Decoração > Extras`
  }

  private static respostaGenerica(eventoId?: number): string {
    return `## 🤖 Assistente EventX\n\nPosso ajudar com:\n- 📊 Análise de progresso\n- 👥 Gestão de convidados\n- 💰 Controle de orçamento\n- ✅ Tarefas\n- 🏪 Fornecedores\n- 💡 Dicas de economia`
  }

  private static async criarOrcamentoInteligente(eventoId?: number, pergunta?: string): Promise<string> {
    if (!eventoId) return 'Selecione um evento para criar um orçamento.'
    const evento = await prisma.evento.findUnique({ where: { id: eventoId } })
    if (!evento) return 'Evento não encontrado.'
    const custoEstimado = Number(evento.custoEstimado)
    const porPessoa = custoEstimado / Math.max(evento.publicoEstimado, 1)
    return `## 💰 Orçamento: **${evento.nomeEvento}**\n\n` +
      `- **Público:** ${evento.publicoEstimado} pessoas\n- **Total:** R$ ${custoEstimado.toFixed(2)}\n- **Por pessoa:** R$ ${porPessoa.toFixed(2)}\n\n` +
      `### Distribuição:\n- 🏠 Local (40%): R$ ${(custoEstimado * 0.4).toFixed(2)}\n- 🍽️ Alimentação (30%): R$ ${(custoEstimado * 0.3).toFixed(2)}\n- 🎨 Decoração (15%): R$ ${(custoEstimado * 0.15).toFixed(2)}\n- 🎵 Entretenimento (10%): R$ ${(custoEstimado * 0.1).toFixed(2)}\n- 🛡️ Reserva (5%): R$ ${(custoEstimado * 0.05).toFixed(2)}`
  }

  private static async salvarInteracao(pergunta: string, resposta: string, eventoId?: number, userId?: number) {
    try {
      if (eventoId) {
        await prisma.assistenteVirtual.create({
          data: {
            algoritmoIA: 'EventBot NextJS',
            sugestoes: `Pergunta: ${pergunta}\nResposta: ${resposta}`,
            eventoId,
          }
        })
      }
    } catch (ex) {
      console.error('Erro ao salvar interação:', ex)
    }
  }
}
