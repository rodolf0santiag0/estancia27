import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Se as variáveis de ambiente não estiverem configuradas na Vercel,
  // evita quebrar o middleware e permite que a aplicação renderize, dando aviso no console.
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      'Aviso: NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY não estão configuradas no ambiente.'
    )
    return supabaseResponse
  }

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // IMPORTANTE: Não remova a chamada ao auth.getUser() para manter a sessão atualizada.
    await supabase.auth.getUser()
  } catch (error) {
    console.error('Erro de inicialização ou autenticação no middleware do Supabase:', error)
  }

  return supabaseResponse
}
