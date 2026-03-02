import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST: Adicionar despesa a um evento
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  try {
    const { eventoId, descricao, valor } = await req.json()
    if (!eventoId || !descricao || !valor) {
      return NextResponse.json({ error: 'Campos obrigatórios' }, { status: 400 })
    }

    const despesa = await prisma.despesa.create({
      data: {
        eventoId: Number(eventoId),
        descricao,
        valor: Number(valor),
      }
    })

    // Atualizar administracao
    const totalDespesas = await prisma.despesa.aggregate({
      where: { eventoId: Number(eventoId) },
      _sum: { valor: true }
    })

    await prisma.administracao.upsert({
      where: { id: 0 }, // upsert by eventoId
      create: {
        idEvento: Number(eventoId),
        valorTotal: totalDespesas._sum.valor || 0,
        orcamento: 0,
      },
      update: {
        valorTotal: totalDespesas._sum.valor || 0,
      }
    }).catch(() => {
      // Se falhar o upsert, criar normalmente
      return prisma.administracao.create({
        data: {
          idEvento: Number(eventoId),
          valorTotal: totalDespesas._sum.valor || 0,
          orcamento: 0,
        }
      })
    })

    return NextResponse.json({ success: true, despesa })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao adicionar despesa' }, { status: 500 })
  }
}
