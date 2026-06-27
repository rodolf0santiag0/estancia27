import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getRaffleById } from '@/actions/raffles'
import { getTicketsByRaffleId } from '@/actions/tickets'
import NumberGrid from '@/components/rifa/number-grid'
import { formatCurrency } from '@/lib/utils'
import { Raffle } from '@/types'

// Dados Mockados para Fallback de Visualização
const MOCK_RAFFLES: Raffle[] = [
  {
    id: 'mock-raffle-1',
    titulo: 'Faca Artesanal Damasco Estância 27',
    descricao: 'Lâmina de 9 polegadas forjada em aço damasco (1095 e 15N20), padrão Random, empunhadura em jacarandá da Bahia com detalhes em latão e bainha de couro bovino legítimo costurada à mão. Uma obra de arte da cutelaria tradicional.',
    produto_premio_id: null,
    valor_cota: 9.90,
    total_cotas: 1000,
    cotas_vendidas: 740,
    status: 'Ativa',
    data_sorteio: null,
    criado_em: new Date().toISOString(),
    produto_premio: {
      id: 'mock-prod-pre-1',
      nome: 'Faca Damasco 9" Estância 27',
      descricao: 'Aço damasco premium',
      preco: 890,
      categoria: 'Corte',
      estoque: 1,
      sku: 'E27-FD-9',
      erp_id: null,
      imagem_url: '/churrasco-mate-2.jpg',
      criado_em: new Date().toISOString()
    }
  },
  {
    id: 'mock-raffle-2',
    titulo: 'Kit Mate do Patrão - Edição Limitada',
    descricao: 'Garrafa térmica preta fosca de 1.2L com gravação a laser Estância 27, cuia de porongo selecionado com bocal de prata 600 trabalhada, e bomba de prata com bojo redondo. O mate perfeito.',
    produto_premio_id: null,
    valor_cota: 4.90,
    total_cotas: 1000,
    cotas_vendidas: 410,
    status: 'Ativa',
    data_sorteio: null,
    criado_em: new Date().toISOString(),
    produto_premio: {
      id: 'mock-prod-pre-2',
      nome: 'Kit Mate Premium com Prata 600',
      descricao: 'Garrafa e cuia especial',
      preco: 490,
      categoria: 'Mate',
      estoque: 1,
      sku: 'E27-KMP',
      erp_id: null,
      imagem_url: '/churrasco-mate-1.jpg',
      criado_em: new Date().toISOString()
    }
  }
]

// Simulador de Tickets Ocupados para Teste Visual
const MOCK_TICKETS = [
  { numero: 12, status: 'Pago' as const },
  { numero: 25, status: 'Reservado' as const },
  { numero: 74, status: 'Pago' as const },
  { numero: 105, status: 'Pago' as const },
  { numero: 180, status: 'Reservado' as const },
  { numero: 242, status: 'Pago' as const },
  { numero: 350, status: 'Pago' as const },
  { numero: 499, status: 'Reservado' as const },
  { numero: 580, status: 'Pago' as const },
  { numero: 671, status: 'Pago' as const },
  { numero: 720, status: 'Pago' as const },
  { numero: 844, status: 'Reservado' as const },
  { numero: 915, status: 'Pago' as const },
  { numero: 999, status: 'Pago' as const }
]

interface RaffleDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function RaffleDetailPage({ params }: RaffleDetailPageProps) {
  const { id } = await params

  // Tenta buscar no banco de dados do Supabase
  let raffle = await getRaffleById(id)
  let dbTickets = await getTicketsByRaffleId(id)

  // Se não encontrar no banco, busca nos mockados
  if (!raffle) {
    raffle = MOCK_RAFFLES.find((r) => r.id === id) || null
    // Se for mockado, usamos os tickets mockados para teste da grade
    dbTickets = raffle ? MOCK_TICKETS.map(t => ({
      id: `mock-ticket-${t.numero}`,
      raffle_id: id,
      profile_id: 'mock-user',
      order_id: 'mock-order',
      numero: t.numero,
      status: t.status
    })) : []
  }

  // Se não existir de forma alguma, gera 404
  if (!raffle) {
    notFound()
  }

  const pct = Math.round((raffle.cotas_vendidas / raffle.total_cotas) * 100)

  // Converte a lista de tickets para o formato do componente
  const ticketsOcupados = dbTickets.map((t) => ({
    numero: t.numero,
    status: t.status,
  }))

  return (
    <div className="flex-1 bg-[#0f0f0e] text-[#f2ebd9] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* BOTÃO DE VOLTAR */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-xs text-[#c8a261] hover:underline uppercase tracking-wider font-semibold">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar para Vitrine
          </Link>
        </div>

        {/* DETALHES DA RIFA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-12">
          
          {/* COLUNA ESQUERDA: INFOS DA CAMPANHA */}
          <div className="lg:col-span-1 bg-[#1c1b18] border border-[#c8a261]/10 rounded-sm p-6 sm:p-8 shadow-2xl flex flex-col justify-between h-full">
            <div>
              <span className="bg-[#bd3a1d] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wider uppercase animate-pulse inline-block mb-4">
                Campanha Ativa
              </span>
              
              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#f2ebd9] leading-tight">
                {raffle.titulo}
              </h1>

              {raffle.produto_premio && (
                <div className="mt-4 p-3 bg-[#0f0f0e] border border-[#c8a261]/10 rounded-sm flex items-center gap-3">
                  <div className="w-12 h-12 bg-zinc-800 rounded-sm overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={raffle.produto_premio.imagem_url || '/churrasco-mate-2.jpg'} 
                      alt={raffle.produto_premio.nome} 
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] text-[#f2ebd9]/40 block uppercase">Prêmio Físico</span>
                    <span className="text-xs font-bold text-[#c8a261] line-clamp-1">{raffle.produto_premio.nome}</span>
                  </div>
                </div>
              )}

              <p className="text-xs text-[#f2ebd9]/75 mt-6 leading-relaxed font-light whitespace-pre-line">
                {raffle.descricao}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-[#c8a261]/15">
              {/* Progresso de Vendas */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-[#f2ebd9]/60">Progresso Geral</span>
                  <span className="font-bold text-[#c8a261]">{pct}% Vendido</span>
                </div>
                <div className="w-full h-2.5 bg-[#0f0f0e] rounded-full overflow-hidden border border-[#c8a261]/10">
                  <div className="h-full bg-gradient-to-r from-[#b08b4c] to-[#bd3a1d] rounded-full" style={{ width: `${pct}%` }}></div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#f2ebd9]/40 mt-1.5">
                  <span>Cotas Restantes: {raffle.total_cotas - raffle.cotas_vendidas}</span>
                  <span>Total: {raffle.total_cotas}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#c8a261]/10">
                <div>
                  <span className="text-[10px] text-[#f2ebd9]/40 block uppercase">Valor da Cota</span>
                  <span className="text-2xl font-bold text-[#c8a261]">{formatCurrency(raffle.valor_cota)}</span>
                </div>
                <div className="text-right text-[10px] text-[#f2ebd9]/40 max-w-[120px]">
                  Sorteio pela Loteria Federal após a venda de 100% das cotas.
                </div>
              </div>
            </div>

          </div>

          {/* COLUNA DIREITA: GRADE DE NÚMEROS */}
          <div className="lg:col-span-2">
            <NumberGrid
              raffleId={raffle.id}
              totalCotas={raffle.total_cotas}
              valorCota={raffle.valor_cota}
              ticketsOcupados={ticketsOcupados}
            />
          </div>

        </div>

      </div>
    </div>
  )
}
