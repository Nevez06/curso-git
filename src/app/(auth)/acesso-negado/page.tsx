import Link from 'next/link'

export default function AcessoNegado() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-eventx-light">
      <div className="text-center">
        <i className="fas fa-lock text-6xl text-red-400 mb-4"></i>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Acesso Negado</h1>
        <p className="text-gray-500 mb-6">Voce nao tem permissao para acessar esta pagina.</p>
        <Link href="/" className="btn-eventx-primary">Voltar ao Inicio</Link>
      </div>
    </div>
  )
}
