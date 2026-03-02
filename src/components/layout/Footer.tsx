export function Footer() {
  return (
    <footer className="border-t bg-white mt-12 py-6">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-8 h-8 bg-eventx-primary rounded-lg flex items-center justify-center transform rotate-45">
            <i className="fas fa-calendar-alt text-white text-sm transform -rotate-45"></i>
          </div>
          <span className="text-xl font-bold text-eventx-primary">EventX</span>
        </div>
        <p className="text-gray-500">&copy; 2025 - EventX - Onde organizar e amar compartilhar o seu evento e so o comeco.</p>
        <p className="text-sm text-gray-400 mt-1">
          <span>Versao 2.0 com IA (Next.js)</span> |{' '}
          <a href="#" className="text-gray-400 hover:text-eventx-primary">Suporte</a> |{' '}
          <a href="#" className="text-gray-400 hover:text-eventx-primary">Privacidade</a>
        </p>
      </div>
    </footer>
  )
}
