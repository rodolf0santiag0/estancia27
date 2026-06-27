'use client'

import React, { useState, useMemo } from 'react'
import { formatCurrency } from '@/lib/utils'

interface TicketOcupado {
  numero: number
  status: 'Reservado' | 'Pago'
}

interface NumberGridProps {
  raffleId: string
  totalCotas: number
  valorCota: number
  ticketsOcupados: TicketOcupado[]
}

export default function NumberGrid({
  raffleId,
  totalCotas,
  valorCota,
  ticketsOcupados,
}: NumberGridProps) {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState(0)

  // Mapeia os tickets ocupados para busca O(1)
  const occupiedMap = useMemo(() => {
    const map = new Map<number, 'Reservado' | 'Pago'>()
    ticketsOcupados.forEach((t) => map.set(t.numero, t.status))
    return map
  }, [ticketsOcupados])

  // Tamanho do bloco de paginação da grade (250 números por aba para otimização visual/performance)
  const tabSize = 250
  const totalTabs = Math.ceil(totalCotas / tabSize)

  const tabs = useMemo(() => {
    const list = []
    for (let i = 0; i < totalTabs; i++) {
      const start = i * tabSize
      const end = Math.min((i + 1) * tabSize - 1, totalCotas - 1)
      const label = `${String(start).padStart(3, '0')} - ${String(end).padStart(3, '0')}`
      list.push({ start, end, label })
    }
    return list
  }, [totalCotas, totalTabs])

  // Lista de números da aba ativa
  const numbersInActiveTab = useMemo(() => {
    const currentTab = tabs[activeTab]
    if (!currentTab) return []
    const list = []
    for (let n = currentTab.start; n <= currentTab.end; n++) {
      list.push(n)
    }
    return list
  }, [activeTab, tabs])

  // Alterna seleção de um número
  const toggleNumber = (num: number) => {
    const status = occupiedMap.get(num)
    if (status) return // Bloqueado se já estiver ocupado

    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== num))
    } else {
      setSelectedNumbers([...selectedNumbers, num].sort((a, b) => a - b))
    }
  }

  // Compra rápida (seleciona cotas aleatórias disponíveis)
  const selectRandomNumbers = (qty: number) => {
    const available: number[] = []
    for (let i = 0; i < totalCotas; i++) {
      if (!occupiedMap.has(i) && !selectedNumbers.includes(i)) {
        available.push(i)
      }
    }

    if (available.length === 0) return

    // Embaralha e pega a quantidade desejada
    const shuffled = [...available].sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, Math.min(qty, shuffled.length))

    setSelectedNumbers([...selectedNumbers, ...selected].sort((a, b) => a - b))
  }

  // Limpa seleção
  const clearSelection = () => {
    setSelectedNumbers([])
  }

  const totalValue = selectedNumbers.length * valorCota

  return (
    <div className="bg-[#1c1b18] border border-[#c8a261]/15 rounded-sm p-6 shadow-xl">
      {/* COMPRA RÁPIDA (QUICK BUY) */}
      <div className="mb-8">
        <h3 className="font-serif text-base font-bold text-[#c8a261] mb-3 uppercase tracking-wider">Compra Rápida</h3>
        <p className="text-xs text-[#f2ebd9]/60 mb-4">Escolha a quantidade de cotas aleatórias para aumentar suas chances:</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[5, 10, 25, 50].map((qty) => (
            <button
              key={qty}
              onClick={() => selectRandomNumbers(qty)}
              className="bg-[#0f0f0e] border border-[#c8a261]/30 hover:border-[#c8a261] text-[#c8a261] hover:bg-[#c8a261] hover:text-[#0f0f0e] py-2 px-3 text-xs font-bold transition rounded-sm flex items-center justify-center gap-1.5"
            >
              +{qty} <span className="text-[10px] opacity-75">Cotas</span>
            </button>
          ))}
        </div>
      </div>

      {/* ABAS DE PAGINAÇÃO DE COTA */}
      <div className="mb-6 border-b border-[#c8a261]/15 pb-3">
        <h3 className="font-serif text-base font-bold text-[#c8a261] mb-4 uppercase tracking-wider">Selecione seus Números</h3>
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`py-1.5 px-3 text-xs font-medium tracking-wide border rounded-sm transition ${
                activeTab === idx
                  ? 'bg-[#c8a261] border-[#c8a261] text-[#0f0f0e] font-bold'
                  : 'bg-[#0f0f0e] border-[#c8a261]/20 text-[#f2ebd9]/70 hover:border-[#c8a261]/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* LEGENDA DA GRADE */}
      <div className="flex gap-4 text-[10px] text-[#f2ebd9]/60 mb-6 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 bg-[#0f0f0e] border border-[#c8a261]/10 rounded-sm"></span>
          <span>Livre</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 bg-[#c8a261] border border-[#c8a261] rounded-sm"></span>
          <span>Selecionado</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 bg-[#bd3a1d]/20 border border-[#bd3a1d]/40 rounded-sm"></span>
          <span>Reservado</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 bg-[#bd3a1d]/40 border border-[#bd3a1d]/80 rounded-sm"></span>
          <span>Pago/Indisponível</span>
        </div>
      </div>

      {/* GRADE DE NÚMEROS */}
      <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-15 xl:grid-cols-20 gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {numbersInActiveTab.map((num) => {
          const status = occupiedMap.get(num)
          const isSelected = selectedNumbers.includes(num)
          const formatted = String(num).padStart(3, '0')

          let buttonClass = 'bg-[#0f0f0e] border border-[#c8a261]/10 text-[#f2ebd9]/80 hover:border-[#c8a261] hover:text-[#c8a261]'
          let disabled = false

          if (isSelected) {
            buttonClass = 'bg-[#c8a261] border-[#c8a261] text-[#0f0f0e] font-bold scale-95 shadow-[#c8a261]/20 shadow-md'
          } else if (status === 'Pago') {
            buttonClass = 'bg-[#bd3a1d]/40 border border-[#bd3a1d]/60 text-[#bd3a1d] line-through cursor-not-allowed opacity-80'
            disabled = true
          } else if (status === 'Reservado') {
            buttonClass = 'bg-[#bd3a1d]/20 border border-[#bd3a1d]/30 text-[#bd3a1d]/75 cursor-not-allowed opacity-80'
            disabled = true
          }

          return (
            <button
              key={num}
              onClick={() => toggleNumber(num)}
              disabled={disabled}
              className={`h-9 text-xs flex items-center justify-center rounded-sm transition-all select-none ${buttonClass}`}
              title={status ? `Número ${status}` : `Número ${formatted} Livre`}
            >
              {formatted}
            </button>
          )
        })}
      </div>

      {/* BARRA DE FINALIZAÇÃO DA COMPRA (STICKY / FOOTER COMPONENT) */}
      {selectedNumbers.length > 0 && (
        <div className="mt-8 pt-6 border-t border-[#c8a261]/15 flex flex-col md:flex-row items-center justify-between gap-4 animate-fadeIn">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#f2ebd9]/60">Cotas selecionadas:</span>
              <span className="bg-[#c8a261]/10 text-[#c8a261] font-bold text-xs px-2 py-0.5 border border-[#c8a261]/20 rounded-sm">
                {selectedNumbers.length}
              </span>
              <button 
                onClick={clearSelection}
                className="text-[10px] text-[#bd3a1d] hover:underline ml-2"
              >
                Limpar seleção
              </button>
            </div>
            <div className="mt-2 text-xs text-[#f2ebd9]/70 line-clamp-1 max-w-[300px] md:max-w-md">
              Números: {selectedNumbers.map(n => String(n).padStart(3, '0')).join(', ')}
            </div>
          </div>

          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
            <div className="text-right">
              <span className="text-[10px] text-[#f2ebd9]/40 block uppercase">Total</span>
              <span className="text-xl font-bold text-[#c8a261]">{formatCurrency(totalValue)}</span>
            </div>
            <button
              onClick={() => {
                alert(`Direcionando para o login/registro para concluir a reserva das cotas: ${selectedNumbers.map(n => String(n).padStart(3, '0')).join(', ')}`)
              }}
              className="bg-[#bd3a1d] hover:bg-[#a12f17] text-white px-6 py-3 text-xs font-bold tracking-wider uppercase transition rounded-sm shadow-md shadow-[#bd3a1d]/10 w-full md:w-auto"
            >
              Participar do Sorteio
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
