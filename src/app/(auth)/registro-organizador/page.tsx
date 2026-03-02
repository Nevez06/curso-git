'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'

export default function RegistroOrganizador() {
  const [form, setForm] = useState({ nomeCompleto: '', email: '', senha: '', confirmarSenha: '', endereco: '', telefone: '', cpf: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/registro-organizador', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Erro no cadastro'); setLoading(false); return }

      // Login automatico
      await signIn('credentials', { email: form.email, password: form.senha, tipoUsuario: 'Organizador', redirect: false })
      router.push('/dashboard')
    } catch { setError('Erro de conexao'); setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-eventx-light py-12 px-4">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Cadastro Organizador</h1>
          <p className="text-gray-500">Crie sua conta para comecar a organizar eventos</p>
        </div>
        <form onSubmit={handleSubmit} className="eventx-card space-y-4">
          {error && <div className="alert-error"><i className="fas fa-exclamation-triangle"></i> {error}</div>}
          <div><label className="eventx-label">Nome Completo *</label><input name="nomeCompleto" value={form.nomeCompleto} onChange={handleChange} className="eventx-input" required /></div>
          <div><label className="eventx-label">CPF *</label><input name="cpf" value={form.cpf} onChange={handleChange} className="eventx-input" placeholder="999.999.999-99" required /></div>
          <div><label className="eventx-label">Endereco *</label><input name="endereco" value={form.endereco} onChange={handleChange} className="eventx-input" required /></div>
          <div><label className="eventx-label">Telefone</label><input name="telefone" value={form.telefone} onChange={handleChange} className="eventx-input" placeholder="(99) 99999-9999" /></div>
          <div><label className="eventx-label">Email *</label><input type="email" name="email" value={form.email} onChange={handleChange} className="eventx-input" required /></div>
          <div><label className="eventx-label">Senha *</label><input type="password" name="senha" value={form.senha} onChange={handleChange} className="eventx-input" required minLength={8} /></div>
          <div><label className="eventx-label">Confirmar Senha *</label><input type="password" name="confirmarSenha" value={form.confirmarSenha} onChange={handleChange} className="eventx-input" required /></div>
          <button type="submit" disabled={loading} className="w-full btn-eventx-primary disabled:opacity-50">{loading ? 'Cadastrando...' : 'Cadastrar'}</button>
          <p className="text-center text-sm text-gray-500">Ja tem conta? <Link href="/login-organizador" className="text-eventx-primary font-medium hover:underline">Entrar</Link></p>
        </form>
      </div>
    </div>
  )
}
