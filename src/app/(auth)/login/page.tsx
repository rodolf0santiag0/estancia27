'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signInAction, signUpAction } from '@/actions/auth'

export default function LoginPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Estados de formulário
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [cpf, setCpf] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Formata o CPF em tempo real (999.999.999-99)
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '') // Mantém apenas números
    if (value.length > 11) value = value.slice(0, 11)

    // Aplica a máscara
    if (value.length > 9) {
      value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
    } else if (value.length > 6) {
      value = value.replace(/^(\d{3})(\d{3})(\d{0,3})$/, '$1.$2.$3')
    } else if (value.length > 3) {
      value = value.replace(/^(\d{3})(\d{0,3})$/, '$1.$2')
    }

    setCpf(value)
  }

  // Formata o Telefone em tempo real ((99) 99999-9999)
  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 11) value = value.slice(0, 11)

    if (value.length > 6) {
      value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,5})$/, '($1) $2')
    } else if (value.length > 0) {
      value = `(${value}`
    }

    setTelefone(value)
  }

  // Envio do Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setSuccessMsg(null)
    setLoading(true)

    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)

    try {
      const res = await signInAction(formData)
      if (res.success) {
        setSuccessMsg('Login realizado com sucesso! Redirecionando...')
        setTimeout(() => {
          router.push('/')
          router.refresh()
        }, 1500)
      } else {
        setErrorMsg(res.error || 'Erro ao realizar login.')
        setLoading(false)
      }
    } catch (err) {
      console.error(err)
      setErrorMsg('Ocorreu um erro no servidor. Tente novamente.')
      setLoading(false)
    }
  }

  // Envio do Cadastro
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setSuccessMsg(null)

    // Validações básicas no cliente
    const cpfLimpo = cpf.replace(/\D/g, '')
    const telLimpo = telefone.replace(/\D/g, '')

    if (nome.trim().length < 3) {
      setErrorMsg('Por favor, informe seu nome completo.')
      return
    }
    if (telLimpo.length < 10) {
      setErrorMsg('Telefone inválido. Informe o DDD e o número.')
      return
    }
    if (cpfLimpo.length !== 11) {
      setErrorMsg('CPF inválido. Deve conter 11 dígitos.')
      return
    }
    if (password.length < 6) {
      setErrorMsg('A senha deve ter no mínimo 6 caracteres.')
      return
    }
    if (password !== confirmPassword) {
      setErrorMsg('As senhas não coincidem.')
      return
    }

    setLoading(true)

    const formData = new FormData()
    formData.append('nome_completo', nome)
    formData.append('email', email)
    formData.append('telefone', telefone)
    formData.append('cpf', cpf)
    formData.append('password', password)

    try {
      const res = await signUpAction(formData)
      if (res.success) {
        setSuccessMsg('Conta criada com sucesso! Verifique seu e-mail de confirmação ou faça o login.')
        // Limpa campos do cadastro
        setNome('')
        setTelefone('')
        setCpf('')
        setConfirmPassword('')
        // Muda para a aba de login após cadastro
        setTimeout(() => {
          setActiveTab('login')
          setLoading(false)
          setSuccessMsg(null)
        }, 3000)
      } else {
        setErrorMsg(res.error || 'Erro ao realizar o cadastro.')
        setLoading(false)
      }
    } catch (err) {
      console.error(err)
      setErrorMsg('Ocorreu um erro ao processar o cadastro.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex-1 flex flex-col items-center justify-center bg-[#0f0f0e] relative py-12 px-4">
      {/* Imagem de background premium sutil de churrasco */}
      <div 
        className="absolute inset-0 opacity-5 bg-cover bg-center pointer-events-none" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200')" }}
      ></div>

      {/* HEADER / LOGO */}
      <div className="mb-8 text-center relative z-10 flex flex-col items-center">
        <Link href="/" className="flex items-center gap-3">
          <svg viewBox="0 0 100 100" className="w-12 h-12 text-[#c8a261]" fill="currentColor">
            <path d="M50 15 L80 40 L80 75 L50 90 L20 75 L20 40 Z" fill="none" stroke="currentColor" strokeWidth="3" />
            <path d="M50 25 L50 80" stroke="currentColor" strokeWidth="2" />
          </svg>
          <div className="text-left">
            <span className="font-serif text-2xl font-bold tracking-wider text-[#c8a261] block leading-none">ESTÂNCIA 27</span>
            <span className="text-[10px] tracking-[0.2em] text-[#f2ebd9]/60 block mt-1 uppercase">Facas &amp; Cultura</span>
          </div>
        </Link>
      </div>

      {/* CARD DE LOGIN/CADASTRO */}
      <div className="w-full max-w-md bg-[#1c1b18]/90 backdrop-blur-md border border-[#c8a261]/20 p-8 rounded-sm shadow-2xl relative z-10">
        
        {/* ABAS */}
        <div className="flex border-b border-[#c8a261]/15 mb-6">
          <button
            onClick={() => {
              setActiveTab('login')
              setErrorMsg(null)
              setSuccessMsg(null)
            }}
            className={`flex-1 pb-3 text-sm font-bold tracking-wide transition ${
              activeTab === 'login'
                ? 'text-[#c8a261] border-b-2 border-[#c8a261]'
                : 'text-[#f2ebd9]/40 border-b-2 border-transparent hover:text-[#f2ebd9]/70'
            }`}
          >
            Entrar
          </button>
          <button
            onClick={() => {
              setActiveTab('register')
              setErrorMsg(null)
              setSuccessMsg(null)
            }}
            className={`flex-1 pb-3 text-sm font-bold tracking-wide transition ${
              activeTab === 'register'
                ? 'text-[#c8a261] border-b-2 border-[#c8a261]'
                : 'text-[#f2ebd9]/40 border-b-2 border-transparent hover:text-[#f2ebd9]/70'
            }`}
          >
            Criar Conta
          </button>
        </div>

        {/* FEEDBACKS */}
        {errorMsg && (
          <div className="mb-5 p-3.5 bg-red-950/40 border border-red-500/30 text-red-400 text-xs rounded-sm animate-fadeIn">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-5 p-3.5 bg-green-950/40 border border-green-500/30 text-green-400 text-xs rounded-sm animate-fadeIn">
            {successMsg}
          </div>
        )}

        {/* FORMULÁRIO DE LOGIN */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] text-[#f2ebd9]/50 block uppercase mb-1.5 tracking-wider font-semibold">E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                className="w-full bg-[#0f0f0e] border border-[#c8a261]/20 focus:border-[#c8a261] text-[#f2ebd9] text-xs py-3 px-4 rounded-sm outline-none transition placeholder-zinc-700"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[10px] text-[#f2ebd9]/50 block uppercase tracking-wider font-semibold">Senha</label>
                <a href="#" className="text-[10px] text-[#c8a261]/70 hover:underline">Esqueci a senha</a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full bg-[#0f0f0e] border border-[#c8a261]/20 focus:border-[#c8a261] text-[#f2ebd9] text-xs py-3 px-4 rounded-sm outline-none transition placeholder-zinc-700"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c8a261] hover:bg-[#b08b4c] text-[#0f0f0e] font-bold py-3.5 px-4 text-xs tracking-wider uppercase transition rounded-sm flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-[#0f0f0e] border-t-transparent rounded-full animate-spin"></span>
              ) : 'Entrar na Conta'}
            </button>
          </form>
        )}

        {/* FORMULÁRIO DE CADASTRO */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
            <div>
              <label className="text-[10px] text-[#f2ebd9]/50 block uppercase mb-1.5 tracking-wider font-semibold">Nome Completo</label>
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="João da Silva"
                className="w-full bg-[#0f0f0e] border border-[#c8a261]/20 focus:border-[#c8a261] text-[#f2ebd9] text-xs py-3 px-4 rounded-sm outline-none transition placeholder-zinc-700"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#f2ebd9]/50 block uppercase mb-1.5 tracking-wider font-semibold">E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="joao@exemplo.com"
                className="w-full bg-[#0f0f0e] border border-[#c8a261]/20 focus:border-[#c8a261] text-[#f2ebd9] text-xs py-3 px-4 rounded-sm outline-none transition placeholder-zinc-700"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-[#f2ebd9]/50 block uppercase mb-1.5 tracking-wider font-semibold">Telefone (DDD)</label>
                <input
                  type="text"
                  required
                  value={telefone}
                  onChange={handleTelefoneChange}
                  placeholder="(48) 99999-9999"
                  className="w-full bg-[#0f0f0e] border border-[#c8a261]/20 focus:border-[#c8a261] text-[#f2ebd9] text-xs py-3 px-4 rounded-sm outline-none transition placeholder-zinc-700"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#f2ebd9]/50 block uppercase mb-1.5 tracking-wider font-semibold">CPF</label>
                <input
                  type="text"
                  required
                  value={cpf}
                  onChange={handleCpfChange}
                  placeholder="000.000.000-00"
                  className="w-full bg-[#0f0f0e] border border-[#c8a261]/20 focus:border-[#c8a261] text-[#f2ebd9] text-xs py-3 px-4 rounded-sm outline-none transition placeholder-zinc-700"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-[#f2ebd9]/50 block uppercase mb-1.5 tracking-wider font-semibold">Senha</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full bg-[#0f0f0e] border border-[#c8a261]/20 focus:border-[#c8a261] text-[#f2ebd9] text-xs py-3 px-4 rounded-sm outline-none transition placeholder-zinc-700"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#f2ebd9]/50 block uppercase mb-1.5 tracking-wider font-semibold">Confirmar Senha</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita sua senha"
                className="w-full bg-[#0f0f0e] border border-[#c8a261]/20 focus:border-[#c8a261] text-[#f2ebd9] text-xs py-3 px-4 rounded-sm outline-none transition placeholder-zinc-700"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#bd3a1d] hover:bg-[#a12f17] text-white font-bold py-3.5 px-4 text-xs tracking-wider uppercase transition rounded-sm flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : 'Criar minha Conta'}
            </button>
          </form>
        )}

      </div>
    </div>
  )
}
