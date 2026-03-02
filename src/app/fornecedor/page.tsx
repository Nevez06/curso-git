'use client'
import { useEffect, useState } from 'react'

export default function FornecedorPage() {
  const [fornecedores, setFornecedores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/fornecedores').then(r => r.json()).then(d => { setFornecedores(d.fornecedores || []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6"><i className="fas fa-store mr-2 text-eventx-primary"></i>Fornecedores</h1>

      {loading ? (
        <div className="text-center py-10"><i className="fas fa-spinner fa-spin text-3xl text-eventx-primary"></i></div>
      ) : fornecedores.length === 0 ? (
        <div className="eventx-card text-center py-12">
          <i className="fas fa-store-slash text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-600">Nenhum fornecedor encontrado</h3>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fornecedores.map((f: any) => (
            <div key={f.id} className="eventx-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-eventx-secondary rounded-full flex items-center justify-center">
                  <i className="fas fa-store text-eventx-primary text-lg"></i>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{f.pessoa?.nome}</h3>
                  <p className="text-sm text-gray-500">{f.tipoServico}</p>
                </div>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p><i className="fas fa-map-marker-alt mr-2"></i>{f.cidade} - {f.uf}</p>
                <p><i className="fas fa-star mr-2 text-yellow-400"></i>{Number(f.avaliacaoMedia).toFixed(1)}</p>
                <p><i className="fas fa-box mr-2"></i>{f.produtos?.length || 0} produtos</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
