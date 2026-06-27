export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          nome_completo: string | null
          telefone: string | null
          cpf: string | null
          role: 'user' | 'admin'
          criado_em: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'criado_em'>
        Update: Partial<Database['public']['Tables']['profiles']['Row']>
      }
      products: {
        Row: {
          id: string
          nome: string
          descricao: string | null
          preco: number
          categoria: 'Corte' | 'Mate' | 'Termicos' | 'Outros'
          estoque: number
          sku: string | null
          erp_id: string | null
          imagem_url: string | null
          criado_em: string
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'criado_em'>
        Update: Partial<Database['public']['Tables']['products']['Row']>
      }
      raffles: {
        Row: {
          id: string
          titulo: string
          descricao: string | null
          produto_premio_id: string | null
          valor_cota: number
          total_cotas: number
          cotas_vendidas: number
          status: 'Rascunho' | 'Ativa' | 'Concluida'
          data_sorteio: string | null
          criado_em: string
        }
        Insert: Omit<Database['public']['Tables']['raffles']['Row'], 'id' | 'criado_em'>
        Update: Partial<Database['public']['Tables']['raffles']['Row']>
      }
      orders: {
        Row: {
          id: string
          profile_id: string
          valor_total: number
          status_pagamento: 'Pendente' | 'Pago' | 'Cancelado'
          gateway_id: string | null
          criado_em: string
        }
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'criado_em'>
        Update: Partial<Database['public']['Tables']['orders']['Row']>
      }
      tickets: {
        Row: {
          id: string
          raffle_id: string
          profile_id: string | null
          order_id: string | null
          numero: number
          status: 'Reservado' | 'Pago'
        }
        Insert: Omit<Database['public']['Tables']['tickets']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['tickets']['Row']>
      }
    }
  }
}
