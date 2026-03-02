import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { sanitizeInput, isValidEmail, isValidInput } from '@/utils/security'

// POST: Criar convite (adicionar convidado a evento)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  try {
    const { eventoId, nomeConvidado, emailConvidado } = await req.json()

    if (!eventoId || !nomeConvidado || !emailConvidado) {
      return NextResponse.json({ error: 'Campos obrigatórios' }, { status: 400 })
    }
    if (!isValidInput(nomeConvidado)) {
      return NextResponse.json({ error: 'Nome contém caracteres inválidos' }, { status: 400 })
    }
    if (!isValidEmail(emailConvidado)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }

    const evento = await prisma.evento.findUnique({ where: { id: Number(eventoId) } })
    if (!evento) return NextResponse.json({ error: 'Evento não encontrado' }, { status: 404 })

    // Verificar/criar pessoa e convidado
    let pessoa = await prisma.pessoa.findFirst({ where: { email: emailConvidado } })
    let convidado

    if (pessoa) {
      convidado = await prisma.convidado.findFirst({ where: { pessoaId: pessoa.id } })
      if (!convidado) {
        convidado = await prisma.convidado.create({ data: { pessoaId: pessoa.id } })
        // Criar user para o convidado
        const passwordHash = await bcrypt.hash(Math.random().toString(36).substring(2, 10) + '@Aa1', 12)
        await prisma.user.create({
          data: {
            email: emailConvidado,
            passwordHash,
            userName: emailConvidado,
            tipoUsuario: 'Convidado',
            emailConfirmed: true,
          }
        }).catch(() => {}) // Ignora se já existe
      }
    } else {
      pessoa = await prisma.pessoa.create({
        data: {
          nome: sanitizeInput(nomeConvidado),
          email: sanitizeInput(emailConvidado),
          cpf: '00000000000',
          endereco: 'Não informado',
        }
      })
      const passwordHash = await bcrypt.hash(Math.random().toString(36).substring(2, 10) + '@Aa1', 12)
      await prisma.user.create({
        data: {
          email: emailConvidado,
          passwordHash,
          userName: emailConvidado,
          tipoUsuario: 'Convidado',
          emailConfirmed: true,
        }
      }).catch(() => {})
      convidado = await prisma.convidado.create({ data: { pessoaId: pessoa.id } })
    }

    // Verificar se já foi convidado
    const jaConvidado = await prisma.listaConvidado.findFirst({
      where: { convidadoId: convidado.id, eventoId: Number(eventoId) }
    })
    if (jaConvidado) {
      return NextResponse.json({ error: `${pessoa.nome} já está na lista de convidados` }, { status: 409 })
    }

    const listaConvidado = await prisma.listaConvidado.create({
      data: {
        convidadoId: convidado.id,
        eventoId: Number(eventoId),
        confirmaPresenca: 'Pendente',
      }
    })

    return NextResponse.json({ success: true, message: `Convidado ${pessoa.nome} adicionado!`, listaConvidado })
  } catch (error: any) {
    console.error('Erro ao criar convite:', error)
    return NextResponse.json({ error: 'Erro ao adicionar convidado' }, { status: 500 })
  }
}
