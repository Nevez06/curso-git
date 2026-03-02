import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sanitizeInput } from '@/utils/security'

// GET: Detalhes do evento
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const id = Number(params.id)
  if (!id || id <= 0) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })

  const evento = await prisma.evento.findUnique({
    where: { id },
    include: {
      organizador: { include: { pessoa: true } },
      local: true,
      listasConvidados: { include: { convidado: { include: { pessoa: true } } } },
      despesas: true,
      tarefasEventos: true,
      pedidos: true,
    }
  })

  if (!evento) return NextResponse.json({ error: 'Evento não encontrado' }, { status: 404 })

  return NextResponse.json({ evento })
}

// PUT: Atualizar evento
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const id = Number(params.id)
  try {
    const body = await req.json()
    const evento = await prisma.evento.update({
      where: { id },
      data: {
        nomeEvento: sanitizeInput(body.nomeEvento),
        descricaoEvento: sanitizeInput(body.descricaoEvento),
        dataEvento: new Date(body.dataEvento),
        tipoEvento: sanitizeInput(body.tipoEvento),
        horaInicio: sanitizeInput(body.horaInicio),
        horaFim: sanitizeInput(body.horaFim),
        publicoEstimado: Number(body.publicoEstimado) || 0,
        custoEstimado: Number(body.custoEstimado) || 0,
        statusEvento: body.statusEvento || 'Planejado',
        localId: body.localId ? Number(body.localId) : null,
      }
    })

    return NextResponse.json({ success: true, evento })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar evento' }, { status: 500 })
  }
}

// DELETE: Excluir evento
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const id = Number(params.id)
  try {
    await prisma.evento.delete({ where: { id } })
    return NextResponse.json({ success: true, message: 'Evento excluído' })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao excluir evento' }, { status: 500 })
  }
}
