import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ sucesso: false }, { status: 401 })

  try {
    const organizador = await prisma.organizador.findFirst({
      where: { pessoa: { email: session.user.email! } }
    })
    if (!organizador) return NextResponse.json({ sucesso: false, eventos: [] })

    const eventos = await prisma.evento.findMany({
      where: { organizadorId: organizador.id },
      select: { id: true, nomeEvento: true, dataEvento: true, statusEvento: true },
      orderBy: { dataEvento: 'desc' }
    })

    return NextResponse.json({
      sucesso: true,
      eventos: eventos.map(e => ({
        id: e.id,
        nome: e.nomeEvento,
        data: new Date(e.dataEvento).toLocaleDateString('pt-BR'),
        status: e.statusEvento,
      }))
    })
  } catch (error) {
    return NextResponse.json({ sucesso: false })
  }
}
