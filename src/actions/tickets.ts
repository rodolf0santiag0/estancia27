'use server'

import { createClient } from '@/lib/supabase/server'
import { Ticket } from '@/types'

/**
 * Busca todos os tickets (cotas) vendidos ou reservados para uma determinada rifa.
 */
export async function getTicketsByRaffleId(raffleId: string): Promise<Ticket[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('raffle_id', raffleId)
  
  if (error) {
    console.error(`Erro ao buscar tickets para a rifa ${raffleId}:`, error)
    return []
  }
  
  return (data || []) as Ticket[]
}
