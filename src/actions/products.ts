'use server'

import { createClient } from '@/lib/supabase/server'
import { Product, ProductCategory } from '@/types'

/**
 * Busca produtos no banco de dados.
 * Opcionalmente filtra por categoria.
 */
export async function getProducts(category?: ProductCategory): Promise<Product[]> {
  const supabase = await createClient()
  
  let query = supabase
    .from('products')
    .select('*')
    .order('criado_em', { ascending: false })
  
  if (category) {
    query = query.eq('categoria', category)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Erro ao buscar produtos:', error)
    return []
  }
  
  return (data || []) as Product[]
}

/**
 * Busca um produto específico pelo ID.
 */
export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error(`Erro ao buscar produto com ID ${id}:`, error)
    return null
  }
  
  return data as Product
}
