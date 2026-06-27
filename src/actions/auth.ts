'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface AuthResponse {
  success: boolean
  error?: string
}

/**
 * Cadastra um novo usuário no Supabase Auth.
 * Transmite metadados para que o trigger no banco crie o perfil correspondente automaticamente.
 */
export async function signUpAction(formData: FormData): Promise<AuthResponse> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const nomeCompleto = formData.get('nome_completo') as string
  const telefone = formData.get('telefone') as string
  const cpf = formData.get('cpf') as string

  if (!email || !password || !nomeCompleto || !telefone || !cpf) {
    return { success: false, error: 'Todos os campos são obrigatórios para o cadastro.' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nome_completo: nomeCompleto,
        telefone,
        cpf,
      },
    },
  })

  if (error) {
    console.error('Erro ao cadastrar usuário:', error.message)
    return { success: false, error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

/**
 * Autentica um usuário existente com e-mail e senha.
 */
export async function signInAction(formData: FormData): Promise<AuthResponse> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { success: false, error: 'E-mail e senha são obrigatórios.' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Erro ao fazer login:', error.message)
    return { success: false, error: 'E-mail ou senha inválidos.' }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

/**
 * Encerra a sessão do usuário ativo e limpa os cookies.
 */
export async function signOutAction(): Promise<AuthResponse> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Erro ao fazer logout:', error.message)
    return { success: false, error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

/**
 * Retorna os dados do usuário da sessão atual de forma segura no servidor.
 */
export async function getSessionUser() {
  const supabase = await createClient()
  
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  // Busca perfil associado da tabela profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return {
    id: user.id,
    email: user.email,
    profile: profile || null,
  }
}
