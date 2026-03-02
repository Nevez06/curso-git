'use client'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginOrganizador() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      email, password: senha, tipoUsuario: 'Organizador', redirect: false,
    })

    setLoading(false)
    if (result?.error) {
      setError('Credenciais invalidas para organizador.')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-eventx-light py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-eventx-primary rounded-2xl flex items-center justify-center mx-auto mb-4 transform rotate-45">
            <i className="fas fa-user-tie text-white text-2xl transform -rotate-45"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Login Organizador</h1>
          <p className="text-gray-500 mt-2">Acesse sua conta de organizador</p>
        </div>

        <form onSubmit={handleSubmit} className="eventx-card space-y-5">
          {error && <div className="alert-error"><i className="fas fa-exclamation-triangle"></i> {error}</div>}

          <div>
            <label className="eventx-label">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="eventx-input" placeholder="seu@email.com" required />
          </div>

          <div>
            <label className="eventx-label">Senha</label>
            <input type="password" value={senha} onChange={e => setSenha(e.target.value)}
              className="eventx-input" placeholder="Sua senha" required />
          </div>

          <button type="submit" disabled={loading}
            className="w-full btn-eventx-primary disabled:opacity-50">
            {loading ? <><i className="fas fa-spinner fa-spin mr-2"></i> Entrando...</> : <><i className="fas fa-sign-in-alt mr-2"></i> Entrar</>}
          </button>

          <p className="text-center text-sm text-gray-500">
            Nao tem conta?{' '}
            <Link href="/registro-organizador" className="text-eventx-primary font-medium hover:underline">Cadastre-se</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
