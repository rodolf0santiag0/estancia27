'use server'

import { createClient } from '@/lib/supabase/server'

export interface DashboardStats {
  totalProducts: number
  totalRaffles: number
  totalClients: number
  totalSalesValue: number
  totalOrdersCount: number
}

/**
 * Busca contagens e totais financeiros do banco de dados do Supabase
 * para alimentar o dashboard administrativo/CRM.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient()

  // 1. Contagem de Produtos
  const { count: productCount, error: productErr } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })

  // 2. Contagem de Rifas
  const { count: raffleCount, error: raffleErr } = await supabase
    .from('raffles')
    .select('*', { count: 'exact', head: true })

  // 3. Contagem de Clientes (role = 'user')
  const { count: clientCount, error: clientErr } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'user')

  // 4. Somatório e Contagem de Vendas (Pedidos Pagos)
  const { data: salesData, error: salesErr } = await supabase
    .from('orders')
    .select('valor_total')
    .eq('status_pagamento', 'Pago')

  const totalSalesValue = (salesData || []).reduce((acc, order) => acc + Number(order.valor_total), 0)
  const totalOrdersCount = (salesData || []).length

  if (productErr || raffleErr || clientErr || salesErr) {
    console.warn('Aviso: O banco de dados pode estar sem registros ou a conexão falhou.', {
      productErr: productErr?.message,
      raffleErr: raffleErr?.message,
      clientErr: clientErr?.message,
      salesErr: salesErr?.message,
    })
  }

  return {
    totalProducts: productCount || 0,
    totalRaffles: raffleCount || 0,
    totalClients: clientCount || 0,
    totalSalesValue,
    totalOrdersCount,
  }
}
