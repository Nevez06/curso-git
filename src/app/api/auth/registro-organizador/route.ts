import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { isValidEmail, isValidCPF, isValidInput, sanitizeInput } from '@/utils/security'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nomeCompleto, email, senha, confirmarSenha, endereco, telefone, cpf } = body

    // Validacoes
    if (!nomeCompleto || !email || !senha || !confirmarSenha || !endereco || !cpf) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios' }, { status: 400 })
    }
    if (senha !== confirmarSenha) {
      return NextResponse.json({ error: 'As senhas não coincidem' }, { status: 400 })
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }
    if (!isValidCPF(cpf)) {
      return NextResponse.json({ error: 'CPF inválido' }, { status: 400 })
    }
    if (!isValidInput(nomeCompleto)) {
      return NextResponse.json({ error: 'Nome contém caracteres inválidos' }, { status: 400 })
    }

    // Verificar email existente
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'Este email já está cadastrado' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(senha, 12)

    // Criar usuário, pessoa e organizador em transação
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: sanitizeInput(email),
          passwordHash,
          userName: sanitizeInput(email),
          tipoUsuario: 'Organizador',
          emailConfirmed: true,
        }
      })

      const pessoa = await tx.pessoa.create({
        data: {
          nome: sanitizeInput(nomeCompleto),
          email: sanitizeInput(email),
          endereco: sanitizeInput(endereco),
          cpf: sanitizeInput(cpf.replace(/\D/g, '')),
          telefone: sanitizeInput(telefone || ''),
        }
      })

      const organizador = await tx.organizador.create({
        data: {
          pessoaId: pessoa.id,
        }
      })

      return { user, pessoa, organizador }
    })

    return NextResponse.json({
      success: true,
      message: 'Organizador cadastrado com sucesso!',
      userId: result.user.id
    }, { status: 201 })
  } catch (error: any) {
    console.error('Erro no registro:', error)
    return NextResponse.json({ error: 'Erro ao criar organizador' }, { status: 500 })
  }
}
