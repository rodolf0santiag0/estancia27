'use server'

import { createClient } from '@/lib/supabase/server'
import { Raffle, RaffleStatus } from '@/types'

/**
 * Busca campanhas de rifa no banco de dados.
 * Por padrão, ignora campanhas em rascunho para exibição pública.
 */
export async function getRaffles(status?: RaffleStatus): Promise<Raffle[]> {
  const supabase = await createClient()
  
  let query = supabase
    .from('raffles')
    .select('*, produto_premio:products(*)')
    .order('criado_em', { ascending: false })
  
  if (status) {
    query = query.eq('status', status)
  } else {
    // Exibe apenas rifas ativas ou concluídas publicamente
    query = query.in('status', ['Ativa', 'Concluida'])
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Erro ao buscar rifas:', error)
    return []
  }
  
  return (data || []) as Raffle[]
}

/**
 * Busca os detalhes de uma rifa específica pelo ID, incluindo seu prêmio.
 */
export async function getRaffleById(id: string): Promise<Raffle | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('raffles')
    .select('*, produto_premio:products(*)')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error(`Erro ao buscar rifa com ID ${id}:`, error)
    return null
  }
  
  return data as Raffle
}
