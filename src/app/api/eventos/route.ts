import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sanitizeInput, isValidInput } from '@/utils/security'

// GET: Listar eventos do organizador logado
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const userId = Number((session.user as any).id)
  const organizador = await prisma.organizador.findFirst({
    where: { id: userId }
  })

  // Buscar pelo email se não encontrar pelo ID
  let organizadorId = organizador?.id
  if (!organizadorId) {
    const org = await prisma.organizador.findFirst({
      where: { pessoa: { email: session.user.email! } }
    })
    organizadorId = org?.id
  }

  if (!organizadorId) {
    return NextResponse.json({ eventos: [] })
  }

  const eventos = await prisma.evento.findMany({
    where: { organizadorId },
    include: { local: true },
    orderBy: { dataEvento: 'desc' }
  })

  return NextResponse.json({ eventos })
}

// POST: Criar evento
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { nomeEvento, descricaoEvento, dataEvento, tipoEvento, horaInicio, horaFim, publicoEstimado, custoEstimado, localId } = body

    if (!nomeEvento || !descricaoEvento || !dataEvento || !tipoEvento || !horaInicio || !horaFim) {
      return NextResponse.json({ error: 'Campos obrigatórios não preenchidos' }, { status: 400 })
    }

    if (!isValidInput(nomeEvento)) {
      return NextResponse.json({ error: 'Nome do evento contém caracteres inválidos' }, { status: 400 })
    }

    // Encontrar organizador
    const organizador = await prisma.organizador.findFirst({
      where: { pessoa: { email: session.user.email! } }
    })

    if (!organizador) {
      return NextResponse.json({ error: 'Organizador não encontrado' }, { status: 404 })
    }

    const evento = await prisma.evento.create({
      data: {
        nomeEvento: sanitizeInput(nomeEvento),
        descricaoEvento: sanitizeInput(descricaoEvento),
        dataEvento: new Date(dataEvento),
        tipoEvento: sanitizeInput(tipoEvento),
        horaInicio: sanitizeInput(horaInicio),
        horaFim: sanitizeInput(horaFim),
        publicoEstimado: Number(publicoEstimado) || 0,
        custoEstimado: Number(custoEstimado) || 0,
        statusEvento: 'Planejado',
        organizadorId: organizador.id,
        localId: localId ? Number(localId) : null,
      }
    })

    return NextResponse.json({ success: true, evento }, { status: 201 })
  } catch (error: any) {
    console.error('Erro ao criar evento:', error)
    return NextResponse.json({ error: 'Erro ao criar evento' }, { status: 500 })
  }
}
