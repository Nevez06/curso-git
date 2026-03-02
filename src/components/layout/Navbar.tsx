'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

export function Navbar() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState('')

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <div className="w-10 h-10 bg-eventx-primary rounded-lg flex items-center justify-center transform rotate-45">
            <i className="fas fa-calendar-alt text-white text-lg transform -rotate-45"></i>
          </div>
          <span className="text-2xl font-bold text-eventx-primary">EventX</span>
        </Link>

        {/* Menu Toggle Mobile */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden text-gray-600 text-2xl">
          <i className={menuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
        </button>

        {/* Navigation */}
        <div className={`${menuOpen ? 'flex' : 'hidden'} lg:flex flex-col lg:flex-row items-center gap-4 absolute lg:relative top-full left-0 w-full lg:w-auto bg-white lg:bg-transparent p-4 lg:p-0 shadow-lg lg:shadow-none`}>
          <Link href="/" className="nav-link text-gray-600 hover:text-eventx-primary transition-colors font-medium">
            <i className="fas fa-home mr-1"></i> Home
          </Link>

          {session ? (
            <>
              <Link href="/eventos" className="nav-link text-gray-600 hover:text-eventx-primary transition-colors font-medium">
                <i className="fas fa-calendar-alt mr-1"></i> Eventos
              </Link>
              <Link href="/dashboard" className="nav-link text-gray-600 hover:text-eventx-primary transition-colors font-medium">
                <i className="fas fa-gauge mr-1"></i> Dashboard
              </Link>
              <Link href="/template-convite" className="nav-link text-gray-600 hover:text-eventx-primary transition-colors font-medium">
                <i className="fas fa-envelope-open-text mr-1"></i> Templates
              </Link>
              <Link href="/ia" className="nav-link text-gray-600 hover:text-eventx-primary transition-colors font-medium">
                <i className="fas fa-robot mr-1"></i> Assistente IA
              </Link>

              {/* User Dropdown */}
              <div className="relative">
                <button onClick={() => setDropdownOpen(dropdownOpen === 'user' ? '' : 'user')}
                  className="flex items-center gap-2 text-gray-600 hover:text-eventx-primary font-medium">
                  <i className="fas fa-user-circle"></i>
                  {session.user?.name || session.user?.email}
                  <i className="fas fa-chevron-down text-xs"></i>
                </button>
                {dropdownOpen === 'user' && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                    <Link href="/eventos" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <i className="fas fa-calendar mr-2"></i> Meus Eventos
                    </Link>
                    <hr className="my-1" />
                    <button onClick={() => signOut({ callbackUrl: '/' })}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <i className="fas fa-sign-out-alt mr-2"></i> Sair
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Login Dropdown */}
              <div className="relative">
                <button onClick={() => setDropdownOpen(dropdownOpen === 'login' ? '' : 'login')}
                  className="flex items-center gap-1 text-gray-600 hover:text-eventx-primary font-medium">
                  <i className="fas fa-sign-in-alt mr-1"></i> Entrar
                  <i className="fas fa-chevron-down text-xs"></i>
                </button>
                {dropdownOpen === 'login' && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                    <Link href="/login-organizador" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <i className="fas fa-user-tie mr-2"></i> Organizador
                    </Link>
                    <Link href="/login-fornecedor" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <i className="fas fa-store mr-2"></i> Fornecedor
                    </Link>
                    <Link href="/login-convidado" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <i className="fas fa-users mr-2"></i> Convidado
                    </Link>
                  </div>
                )}
              </div>

              {/* Cadastrar Dropdown */}
              <div className="relative">
                <button onClick={() => setDropdownOpen(dropdownOpen === 'register' ? '' : 'register')}
                  className="flex items-center gap-1 text-gray-600 hover:text-eventx-primary font-medium">
                  <i className="fas fa-user-plus mr-1"></i> Cadastrar
                  <i className="fas fa-chevron-down text-xs"></i>
                </button>
                {dropdownOpen === 'register' && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                    <Link href="/registro-organizador" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <i className="fas fa-user-tie mr-2"></i> Organizador
                    </Link>
                    <Link href="/registro-fornecedor" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <i className="fas fa-store mr-2"></i> Fornecedor
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
