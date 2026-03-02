import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { isValidEmail, isValidCNPJ, isValidInput, sanitizeInput } from '@/utils/security'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nomeLoja, email, senha, confirmarSenha, endereco, telefone, cpf, cnpj, tipoServico, cidade, uf } = body

    if (!nomeLoja || !email || !senha || !confirmarSenha || !cnpj || !tipoServico || !cidade || !uf) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios' }, { status: 400 })
    }
    if (senha !== confirmarSenha) {
      return NextResponse.json({ error: 'As senhas não coincidem' }, { status: 400 })
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }
    if (!isValidCNPJ(cnpj)) {
      return NextResponse.json({ error: 'CNPJ inválido' }, { status: 400 })
    }
    if (!isValidInput(nomeLoja)) {
      return NextResponse.json({ error: 'Nome da loja contém caracteres inválidos' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'Este email já está cadastrado' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(senha, 12)

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: sanitizeInput(email),
          passwordHash,
          userName: sanitizeInput(email),
          tipoUsuario: 'Fornecedor',
          emailConfirmed: true,
        }
      })

      const pessoa = await tx.pessoa.create({
        data: {
          nome: sanitizeInput(nomeLoja),
          email: sanitizeInput(email),
          endereco: sanitizeInput(endereco || ''),
          cpf: sanitizeInput((cpf || '').replace(/\D/g, '')),
          telefone: sanitizeInput(telefone || ''),
        }
      })

      const fornecedor = await tx.fornecedor.create({
        data: {
          pessoaId: pessoa.id,
          cnpj: sanitizeInput(cnpj.replace(/\D/g, '')),
          tipoServico: sanitizeInput(tipoServico),
          cidade: sanitizeInput(cidade),
          uf: sanitizeInput(uf.toUpperCase()),
        }
      })

      return { user, pessoa, fornecedor }
    })

    return NextResponse.json({
      success: true,
      message: 'Fornecedor cadastrado com sucesso!',
      userId: result.user.id
    }, { status: 201 })
  } catch (error: any) {
    console.error('Erro no registro fornecedor:', error)
    return NextResponse.json({ error: 'Erro ao criar fornecedor' }, { status: 500 })
  }
}
