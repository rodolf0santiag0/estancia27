'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { signOutAction } from '@/actions/auth'

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    if (confirm('Tem certeza de que deseja sair do painel administrativo?')) {
      const res = await signOutAction()
      if (res.success) {
        router.push('/login')
        router.refresh()
      } else {
        alert(res.error || 'Erro ao realizar logout.')
      }
    }
  }

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
      </svg>
    )},
    { name: 'Produtos', href: '/admin/products', disabled: true, icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )},
    { name: 'Rifas / Campanhas', href: '/admin/raffles', disabled: true, icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    )},
    { name: 'Clientes / Vendas', href: '/admin/sales', disabled: true, icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )},
  ]

  return (
    <aside className="w-64 bg-[#1c1b18] border-r border-[#c8a261]/15 flex flex-col justify-between shrink-0">
      <div>
        {/* LOGO ADMIN */}
        <div className="p-6 border-b border-[#c8a261]/10 flex items-center gap-3">
          <svg viewBox="0 0 100 100" className="w-9 h-9 text-[#c8a261]" fill="currentColor">
            <path d="M50 15 L80 40 L80 75 L50 90 L20 75 L20 40 Z" fill="none" stroke="currentColor" strokeWidth="3" />
            <path d="M50 25 L50 80" stroke="currentColor" strokeWidth="2" />
          </svg>
          <div>
            <span className="font-serif text-base font-bold tracking-wider text-[#c8a261] block leading-none">ESTÂNCIA 27</span>
            <span className="text-[8px] tracking-[0.25em] text-[#f2ebd9]/40 block mt-1 uppercase">Painel CRM</span>
          </div>
        </div>

        {/* MENU */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            if (item.disabled) {
              return (
                <div
                  key={item.name}
                  className="flex items-center gap-3 px-4 py-3 text-xs text-[#f2ebd9]/20 cursor-not-allowed select-none"
                  title="Em breve nesta plataforma"
                >
                  {item.icon}
                  <span>{item.name}</span>
                  <span className="text-[8px] border border-[#f2ebd9]/10 rounded-full px-1.5 py-0.5 ml-auto text-[#f2ebd9]/30">Breve</span>
                </div>
              )
            }
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-sm text-xs font-semibold tracking-wide transition ${
                  isActive
                    ? 'bg-[#c8a261] text-[#0f0f0e]'
                    : 'text-[#f2ebd9]/70 hover:bg-[#0f0f0e]/50 hover:text-[#c8a261]'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* FOOTER DA SIDEBAR */}
      <div className="p-4 border-t border-[#c8a261]/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-[#bd3a1d]/10 hover:bg-[#bd3a1d] text-[#bd3a1d] hover:text-white py-2.5 px-4 text-xs font-bold uppercase tracking-wider rounded-sm transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sair do Painel
        </button>
      </div>
    </aside>
  )
}
