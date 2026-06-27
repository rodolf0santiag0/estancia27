import React from 'react'
import { redirect } from 'next/navigation'
import { getSessionUser } from '@/actions/auth'
import Sidebar from '@/components/admin/sidebar'
import Navbar from '@/components/admin/navbar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSessionUser()

  // Se não estiver logado, redireciona para a página de login
  if (!session) {
    redirect('/login')
  }

  // Se estiver logado, mas não for admin, exibe tela informativa premium de acesso negado
  if (session.profile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#0f0f0e] text-[#f2ebd9] flex flex-col items-center justify-center p-6 relative">
        <div 
          className="absolute inset-0 opacity-5 bg-cover bg-center pointer-events-none" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200')" }}
        ></div>

        <div className="w-full max-w-lg bg-[#1c1b18] border border-[#bd3a1d]/30 p-8 rounded-sm text-center relative z-10 shadow-2xl">
          <div className="w-16 h-16 bg-[#bd3a1d]/10 text-[#bd3a1d] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#bd3a1d]/20">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <h1 className="font-serif text-2xl font-extrabold text-[#f2ebd9] mb-3">Acesso Restrito</h1>
          <p className="text-xs text-[#f2ebd9]/70 leading-relaxed mb-6">
            Identificamos sua conta ({session.email}), porém você não possui privilégios de **Administrador** no banco de dados para acessar o CRM.
          </p>

          <div className="bg-[#0f0f0e] border border-[#c8a261]/10 rounded-sm p-4 text-left mb-8">
            <span className="text-[9px] text-[#c8a261] font-bold uppercase tracking-wider block mb-2">Instrução para Desenvolvimento</span>
            <p className="text-[11px] text-[#f2ebd9]/60 leading-relaxed mb-3">
              Para liberar o acesso a este e-mail no painel, execute a seguinte query no **SQL Editor** do seu console do Supabase:
            </p>
            <code className="block bg-zinc-950 p-3 rounded-sm text-[10px] font-mono text-[#c8a261] break-all select-all">
              UPDATE public.profiles SET role = &apos;admin&apos; WHERE id = &apos;{session.id}&apos;;
            </code>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="/" 
              className="flex-1 bg-[#c8a261] hover:bg-[#b08b4c] text-[#0f0f0e] py-3 text-xs font-bold uppercase tracking-wider transition rounded-sm"
            >
              Voltar para Loja
            </a>
            <a 
              href="/login" 
              className="flex-1 border border-[#f2ebd9]/20 hover:bg-zinc-800 text-[#f2ebd9]/80 py-3 text-xs font-bold uppercase tracking-wider transition rounded-sm"
            >
              Entrar com outra conta
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Usuário é admin, renderiza o layout administrativo completo
  return (
    <div className="min-h-screen flex bg-[#0f0f0e] text-[#f2ebd9]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar userEmail={session.email} />
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#0f0f0e]">
          {children}
        </main>
      </div>
    </div>
  )
}
