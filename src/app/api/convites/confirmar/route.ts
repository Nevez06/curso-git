import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const eventoId = Number(searchParams.get('eventoId'))
  const convidadoId = Number(searchParams.get('convidadoId'))

  if (!eventoId || !convidadoId) {
    return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 })
  }

  try {
    const listaConvidado = await prisma.listaConvidado.findFirst({
      where: { eventoId, convidadoId },
      include: {
        convidado: { include: { pessoa: true } },
        evento: true,
      }
    })

    if (!listaConvidado) {
      return NextResponse.json({ error: 'Convite não encontrado' }, { status: 404 })
    }

    await prisma.listaConvidado.update({
      where: { id: listaConvidado.id },
      data: { confirmaPresenca: 'Confirmado' }
    })

    return NextResponse.json({
      success: true,
      nomeConvidado: listaConvidado.convidado.pessoa.nome,
      nomeEvento: listaConvidado.evento.nomeEvento,
      dataEvento: new Date(listaConvidado.evento.dataEvento).toLocaleDateString('pt-BR'),
    })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao confirmar presença' }, { status: 500 })
  }
}
