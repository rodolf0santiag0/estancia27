import React from 'react'
import { getDashboardStats } from '@/actions/admin'
import { formatCurrency } from '@/lib/utils'

// Dados Fictícios de Monitoramento Rápido (Fallbacks Estéticos caso o Banco esteja Novo)
const MOCK_RECENT_ORDERS = [
  { id: 'ORD-9812', cliente: 'Carlos Henrique Ramos', valor: 290.00, status: 'Pago', data: '27/06/2026' },
  { id: 'ORD-9781', cliente: 'Mariana Medeiros Souza', valor: 9.90, status: 'Pago', data: '27/06/2026' },
  { id: 'ORD-9755', cliente: 'Roberto Mendes Pires', valor: 19.80, status: 'Pendente', data: '26/06/2026' },
  { id: 'ORD-9710', cliente: 'Patrícia Nogueira', valor: 360.00, status: 'Pago', data: '25/06/2026' }
]

const MOCK_LEADS = [
  { nome: 'Alexandre Silveira', email: 'alexandre@gmail.com', telefone: '(48) 98822-1200', data: '27/06/2026' },
  { nome: 'Letícia Dutra de Souza', email: 'leticia@dutra.com.br', telefone: '(47) 99182-4433', data: '26/06/2026' },
  { nome: 'Gustavo Santos Paim', email: 'gustavo.paim@outlook.com', telefone: '(51) 98111-5444', data: '26/06/2026' }
]

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats()

  // Se o banco estiver zerado, usamos alguns dados estéticos para demonstração de CRM Premium
  const showMockWarning = stats.totalProducts === 0 && stats.totalRaffles === 0 && stats.totalSalesValue === 0

  return (
    <div className="space-y-8">
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#c8a261]">Painel de Controle</h1>
          <p className="text-xs text-[#f2ebd9]/55 mt-1">Monitore o desempenho do e-commerce, campanhas de rifas e CRM.</p>
        </div>
        
        {showMockWarning && (
          <div className="bg-[#c8a261]/5 border border-[#c8a261]/20 rounded-sm py-2 px-3 text-[11px] text-[#c8a261] flex items-center gap-2 max-w-xs">
            <span className="w-2 h-2 bg-[#c8a261] rounded-full animate-ping"></span>
            Modo Demonstrativo (Banco de dados inicializado)
          </div>
        )}
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* CARD 1: VALOR TOTAL DE VENDAS */}
        <div className="bg-[#1c1b18] border border-[#c8a261]/10 rounded-sm p-6 shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#f2ebd9]/40 block uppercase tracking-wider font-semibold">Volume de Vendas (Pago)</span>
            <span className="text-2xl font-extrabold text-[#c8a261] block mt-2">
              {showMockWarning ? formatCurrency(659.90) : formatCurrency(stats.totalSalesValue)}
            </span>
          </div>
          <div className="p-3 bg-[#c8a261]/5 text-[#c8a261] border border-[#c8a261]/10 rounded-sm shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* CARD 2: TOTAL DE PEDIDOS */}
        <div className="bg-[#1c1b18] border border-[#c8a261]/10 rounded-sm p-6 shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#f2ebd9]/40 block uppercase tracking-wider font-semibold">Pedidos Concluídos</span>
            <span className="text-2xl font-extrabold text-[#f2ebd9]/85 block mt-2">
              {showMockWarning ? 3 : stats.totalOrdersCount}
            </span>
          </div>
          <div className="p-3 bg-[#c8a261]/5 text-[#c8a261] border border-[#c8a261]/10 rounded-sm shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>

        {/* CARD 3: CLIENTES CADASTRADOS */}
        <div className="bg-[#1c1b18] border border-[#c8a261]/10 rounded-sm p-6 shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#f2ebd9]/40 block uppercase tracking-wider font-semibold">Clientes Ativos</span>
            <span className="text-2xl font-extrabold text-[#f2ebd9]/85 block mt-2">
              {showMockWarning ? 3 : stats.totalClients}
            </span>
          </div>
          <div className="p-3 bg-[#c8a261]/5 text-[#c8a261] border border-[#c8a261]/10 rounded-sm shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>

        {/* CARD 4: PRODUTOS E RIFAS */}
        <div className="bg-[#1c1b18] border border-[#c8a261]/10 rounded-sm p-6 shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#f2ebd9]/40 block uppercase tracking-wider font-semibold">Catálogo (Prods / Rifas)</span>
            <span className="text-2xl font-extrabold text-[#f2ebd9]/85 block mt-2">
              {showMockWarning ? '4 / 2' : `${stats.totalProducts} / ${stats.totalRaffles}`}
            </span>
          </div>
          <div className="p-3 bg-[#c8a261]/5 text-[#c8a261] border border-[#c8a261]/10 rounded-sm shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>

      </div>

      {/* DASHBOARD GRIDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ÚLTIMOS PEDIDOS */}
        <div className="lg:col-span-2 bg-[#1c1b18] border border-[#c8a261]/10 rounded-sm p-6 shadow-md">
          <h3 className="font-serif text-sm font-bold text-[#c8a261] uppercase tracking-wider mb-5">Últimos Pedidos Recebidos</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#f2ebd9]/80">
              <thead className="text-[9px] text-[#f2ebd9]/40 uppercase tracking-wider border-b border-[#c8a261]/10">
                <tr>
                  <th className="pb-3 font-semibold">ID</th>
                  <th className="pb-3 font-semibold">Cliente</th>
                  <th className="pb-3 font-semibold">Valor</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c8a261]/5">
                {MOCK_RECENT_ORDERS.map((order) => (
                  <tr key={order.id} className="hover:bg-[#0f0f0e]/30 transition">
                    <td className="py-3.5 font-mono text-[#c8a261]">{order.id}</td>
                    <td className="py-3.5 font-medium">{order.cliente}</td>
                    <td className="py-3.5">{formatCurrency(order.valor)}</td>
                    <td className="py-3.5">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide ${
                        order.status === 'Pago' 
                          ? 'bg-green-950/40 text-green-400 border border-green-500/20' 
                          : 'bg-[#bd3a1d]/15 text-[#bd3a1d]/90 border border-[#bd3a1d]/20'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right text-[#f2ebd9]/55">{order.data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ÚLTIMOS LEADS DO CRM */}
        <div className="bg-[#1c1b18] border border-[#c8a261]/10 rounded-sm p-6 shadow-md">
          <h3 className="font-serif text-sm font-bold text-[#c8a261] uppercase tracking-wider mb-5">Leads Recentes (CRM)</h3>
          <div className="space-y-4">
            {MOCK_LEADS.map((lead, idx) => (
              <div key={idx} className="p-3 bg-[#0f0f0e]/60 border border-[#c8a261]/10 rounded-sm flex flex-col gap-1.5 hover:border-[#c8a261]/30 transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#f2ebd9]/85">{lead.nome}</span>
                  <span className="text-[9px] text-[#f2ebd9]/40">{lead.data}</span>
                </div>
                <div className="text-[10px] text-[#f2ebd9]/60 flex items-center justify-between gap-2 break-all">
                  <span>{lead.email}</span>
                  <span className="text-[#c8a261] shrink-0 font-medium">{lead.telefone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* GUIA DE CONFIGURAÇÃO ONBOARDING (EXIBE SE BANCO ZERADO) */}
      {showMockWarning && (
        <div className="bg-[#1c1b18] border border-[#c8a261]/15 rounded-sm p-6 shadow-md">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#c8a261]/10 border border-[#c8a261]/30 text-[#c8a261] rounded-sm shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-serif text-sm font-bold text-[#c8a261] uppercase tracking-wider mb-2">Primeiros Passos do Administrador</h3>
              <p className="text-xs text-[#f2ebd9]/70 leading-relaxed mb-4">
                Seu banco de dados do Supabase está conectado, porém as tabelas públicas ainda não possuem registros. Para começar a operar de verdade, siga estes passos:
              </p>
              <ul className="text-xs text-[#f2ebd9]/60 space-y-2.5 list-disc pl-5">
                <li>Adicione produtos na tabela <code className="text-[#c8a261] bg-[#0f0f0e] px-1 rounded-sm">products</code> para expor no e-commerce da vitrine.</li>
                <li>Crie campanhas na tabela <code className="text-[#c8a261] bg-[#0f0f0e] px-1 rounded-sm">raffles</code> associadas ou não a um produto como prêmio.</li>
                <li>À medida que novos clientes se cadastrarem no site, o trigger automático no Supabase preencherá a tabela de <code className="text-[#c8a261] bg-[#0f0f0e] px-1 rounded-sm">profiles</code>, listando-os em tempo real como Leads no seu CRM.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
