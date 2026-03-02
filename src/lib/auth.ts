import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
        tipoUsuario: { label: 'Tipo', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email e senha são obrigatórios')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user) {
          throw new Error('Credenciais inválidas')
        }

        // Verificar tipo de usuário se especificado
        if (credentials.tipoUsuario && user.tipoUsuario !== credentials.tipoUsuario) {
          throw new Error(`Credenciais inválidas para ${credentials.tipoUsuario?.toLowerCase()}`)
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash)

        if (!isPasswordValid) {
          throw new Error('Credenciais inválidas')
        }

        // Registrar login na auditoria
        try {
          await prisma.auditoria.create({
            data: {
              tipoEntidade: 'User',
              entidadeId: user.id,
              tipoAcao: 'LOGIN',
              usuario: user.email,
              descricao: 'Login realizado com sucesso',
              sucesso: true,
            }
          })
        } catch (e) {
          console.error('Erro ao registrar auditoria de login:', e)
        }

        return {
          id: String(user.id),
          email: user.email,
          name: user.userName || user.email,
          tipoUsuario: user.tipoUsuario,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.tipoUsuario = (user as any).tipoUsuario
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id
        ;(session.user as any).tipoUsuario = token.tipoUsuario
      }
      return session
    }
  },
  pages: {
    signIn: '/login-organizador',
    error: '/login-organizador',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 60, // 30 minutos
  },
  secret: process.env.NEXTAUTH_SECRET,
}
