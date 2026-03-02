import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { EventBotService } from '@/services/eventbot.service'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  try {
    const { pergunta, eventoId } = await req.json()
    if (!pergunta?.trim()) return NextResponse.json({ sucesso: false, resposta: '⚠️ Pergunta vazia.' })

    const userId = Number((session.user as any).id)
    const resposta = await EventBotService.processarPergunta(pergunta, eventoId || undefined, userId)
    return NextResponse.json({ sucesso: true, resposta })
  } catch (error: any) {
    return NextResponse.json({ sucesso: false, resposta: `❌ Erro: ${error.message}` })
  }
}
