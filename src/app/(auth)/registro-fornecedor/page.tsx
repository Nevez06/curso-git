'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'

export default function RegistroFornecedor() {
  const [form, setForm] = useState({ nomeLoja: '', email: '', senha: '', confirmarSenha: '', endereco: '', telefone: '', cpf: '', cnpj: '', tipoServico: '', cidade: '', uf: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/registro-fornecedor', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Erro no cadastro'); setLoading(false); return }
      await signIn('credentials', { email: form.email, password: form.senha, tipoUsuario: 'Fornecedor', redirect: false })
      router.push('/dashboard')
    } catch { setError('Erro de conexao'); setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-eventx-light py-12 px-4">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Cadastro Fornecedor</h1>
        </div>
        <form onSubmit={handleSubmit} className="eventx-card space-y-4">
          {error && <div className="alert-error"><i className="fas fa-exclamation-triangle"></i> {error}</div>}
          <div><label className="eventx-label">Nome da Loja *</label><input name="nomeLoja" value={form.nomeLoja} onChange={handleChange} className="eventx-input" required /></div>
          <div><label className="eventx-label">CPF *</label><input name="cpf" value={form.cpf} onChange={handleChange} className="eventx-input" required /></div>
          <div><label className="eventx-label">CNPJ *</label><input name="cnpj" value={form.cnpj} onChange={handleChange} className="eventx-input" required /></div>
          <div><label className="eventx-label">Tipo de Servico *</label><input name="tipoServico" value={form.tipoServico} onChange={handleChange} className="eventx-input" required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="eventx-label">Cidade *</label><input name="cidade" value={form.cidade} onChange={handleChange} className="eventx-input" required /></div>
            <div><label className="eventx-label">UF *</label><input name="uf" value={form.uf} onChange={handleChange} className="eventx-input" maxLength={2} required /></div>
          </div>
          <div><label className="eventx-label">Endereco</label><input name="endereco" value={form.endereco} onChange={handleChange} className="eventx-input" /></div>
          <div><label className="eventx-label">Telefone</label><input name="telefone" value={form.telefone} onChange={handleChange} className="eventx-input" /></div>
          <div><label className="eventx-label">Email *</label><input type="email" name="email" value={form.email} onChange={handleChange} className="eventx-input" required /></div>
          <div><label className="eventx-label">Senha *</label><input type="password" name="senha" value={form.senha} onChange={handleChange} className="eventx-input" required minLength={8} /></div>
          <div><label className="eventx-label">Confirmar Senha *</label><input type="password" name="confirmarSenha" value={form.confirmarSenha} onChange={handleChange} className="eventx-input" required /></div>
          <button type="submit" disabled={loading} className="w-full btn-eventx-primary disabled:opacity-50">{loading ? 'Cadastrando...' : 'Cadastrar'}</button>
          <p className="text-center text-sm text-gray-500">Ja tem conta? <Link href="/login-fornecedor" className="text-eventx-primary font-medium hover:underline">Entrar</Link></p>
        </form>
      </div>
    </div>
  )
}
