import Link from 'next/link'

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="text-center py-12">
        {/* Banner Principal */}
        <div className="relative mx-auto max-w-5xl mb-12">
          <div className="bg-gradient-to-r from-eventx-primary to-eventx-accent rounded-[40px] h-[400px] flex items-center justify-center overflow-hidden shadow-xl">
            <div className="text-center text-white px-8 z-10">
              <h4 className="font-normal text-lg mb-2">Compartilhe, planeje, convide e gerencie com facilidade</h4>
              <h1 className="text-4xl md:text-5xl font-bold uppercase mt-2">EVENTOS EM UM SO LUGAR</h1>
              <div className="flex flex-col md:flex-row gap-4 mt-8 justify-center">
                <Link href="/login-convidado" className="btn-eventx-primary">Sou Convidado</Link>
                <Link href="/login-organizador" className="btn-eventx-primary">Organizador</Link>
                <Link href="/login-fornecedor" className="btn-eventx-primary">Fornecedor</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Banner Secundario */}
        <div className="relative mx-auto max-w-5xl mb-12">
          <div className="bg-gradient-to-br from-red-900 to-red-700 rounded-[40px] h-[350px] flex items-center overflow-hidden shadow-xl">
            <div className="text-left text-white px-12 md:px-20 z-10">
              <h2 className="text-3xl md:text-4xl font-bold uppercase mb-2">EventX</h2>
              <p className="text-lg font-medium mb-6">
                Onde organizar e amar compartilhar o seu evento e so o comeco.
              </p>
              <Link href="/registro-organizador" className="btn-eventx-secondary inline-flex items-center gap-2 text-lg">
                <i className="fas fa-calendar-alt"></i> Criar minha conta agora
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AVALIACOES */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8" style={{ color: '#992008' }}>Avaliacoes e Comentarios</h2>

          {/* Tabs */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="border-2 border-eventx-primary rounded-full flex overflow-hidden h-14">
              <button className="flex-1 bg-eventx-primary text-white font-semibold flex items-center justify-center gap-2">
                <i className="fas fa-check"></i> Depoimentos
              </button>
              <button className="flex-1 text-eventx-primary font-semibold flex items-center justify-center">
                Depoimentos
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Amanda Silva', text: 'Eu amei cada detalhe de organizar meu evento com o EventX!' },
              { name: 'Lucas Pereira', text: 'Gerenciar nunca foi tao facil. Obrigada, EventX!' },
              { name: 'Camila Lopes', text: 'Ate os pagamentos com fornecedores fiz pelo EventX, de forma pratica e segura.' },
            ].map((dep, i) => (
              <div key={i} className="bg-white border rounded-xl shadow-sm p-6 text-left hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 bg-eventx-secondary rounded-full flex items-center justify-center mr-3">
                    <i className="fas fa-user text-eventx-primary"></i>
                  </div>
                  <div>
                    <h6 className="font-bold text-gray-800">{dep.name}</h6>
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map(s => <i key={s} className="fas fa-star text-sm"></i>)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">{dep.text}</p>
                <div className="mt-2 text-red-400"><i className="fas fa-heart"></i></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
