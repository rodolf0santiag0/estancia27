import React from 'react'
import Link from 'next/link'

interface NavbarProps {
  userEmail?: string
}

export default function Navbar({ userEmail }: NavbarProps) {
  return (
    <header className="h-16 bg-[#1c1b18] border-b border-[#c8a261]/15 px-6 flex items-center justify-between shrink-0">
      <div className="text-xs text-[#f2ebd9]/60 font-medium hidden sm:block">
        Painel de Gestão e Relacionamento com o Cliente
      </div>
      
      <div className="flex items-center gap-6 ml-auto">
        <Link 
          href="/" 
          className="text-xs text-[#c8a261] border border-[#c8a261]/30 hover:bg-[#c8a261]/10 px-3 py-1.5 rounded-sm tracking-wider uppercase font-bold transition"
        >
          Visualizar Vitrine
        </Link>
        
        {userEmail && (
          <div className="flex items-center gap-2 border-l border-[#c8a261]/25 pl-6 h-8">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-semibold text-[#f2ebd9]/80">{userEmail}</span>
          </div>
        )}
      </div>
    </header>
  )
}
