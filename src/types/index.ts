export type ProductCategory = 'Corte' | 'Mate' | 'Termicos' | 'Outros'
export type RaffleStatus = 'Rascunho' | 'Ativa' | 'Concluida'
export type PaymentStatus = 'Pendente' | 'Pago' | 'Cancelado'
export type TicketStatus = 'Reservado' | 'Pago'

export interface Product {
  id: string
  nome: string
  descricao: string | null
  preco: number
  categoria: ProductCategory
  estoque: number
  sku: string | null
  erp_id: string | null
  imagem_url: string | null
  criado_em: string
}

export interface Raffle {
  id: string
  titulo: string
  descricao: string | null
  produto_premio_id: string | null
  valor_cota: number
  total_cotas: number
  cotas_vendidas: number
  status: RaffleStatus
  data_sorteio: string | null
  criado_em: string
  produto_premio?: Product | null
}

export interface Profile {
  id: string
  nome_completo: string | null
  telefone: string | null
  cpf: string | null
  role: 'user' | 'admin'
  criado_em: string
}

export interface Order {
  id: string
  profile_id: string
  valor_total: number
  status_pagamento: PaymentStatus
  gateway_id: string | null
  criado_em: string
}

export interface Ticket {
  id: string
  raffle_id: string
  profile_id: string | null
  order_id: string | null
  numero: number
  status: TicketStatus
}
