import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProductById } from '@/actions/products'
import { formatCurrency } from '@/lib/utils'
import { Product } from '@/types'

// Dados Mockados para Fallback de Visualização
const MOCK_PRODUCTS: Product[] = [
  {
    id: 'mock-prod-1',
    nome: 'Faca Campeira Aço Carbono 1070',
    descricao: 'Faca tradicional campeira com lâmina de 8 polegadas em aço carbono 1070 com acabamento fosfatizado e cabo de osso bovino. Possui têmpera seletiva garantindo alta retenção de fio e durabilidade. Acompanha bainha de couro bovino legítimo com passador de cinto.',
    preco: 290.00,
    categoria: 'Corte',
    estoque: 12,
    sku: 'E27-FC-1070',
    erp_id: null,
    imagem_url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=600',
    criado_em: new Date().toISOString()
  },
  {
    id: 'mock-prod-2',
    nome: 'Cuia de Porongo Premium Jacarandá',
    descricao: 'Cuia de porongo grosso selecionado revestida em couro legítimo preto com bocal de jacarandá torneado. Peça altamente robusta e estilosa para manter a temperatura e o sabor ideal do seu mate.',
    preco: 145.00,
    categoria: 'Mate',
    estoque: 8,
    sku: 'E27-CP-PREM',
    erp_id: null,
    imagem_url: 'https://images.unsplash.com/photo-1589139880155-21d740c03cc5?q=80&w=600',
    criado_em: new Date().toISOString()
  },
  {
    id: 'mock-prod-3',
    nome: 'Garrafa Térmica Estância 1.2L Preto Fosco',
    descricao: 'Garrafa térmica premium em aço inox 18/8 livre de BPA com isolamento a vácuo de parede dupla. Pintura eletrostática preto fosco super resistente. Mantém a água para o chimarrão quente por até 24 horas.',
    preco: 360.00,
    categoria: 'Termicos',
    estoque: 15,
    sku: 'E27-GT-12PF',
    erp_id: null,
    imagem_url: 'https://images.unsplash.com/photo-1576016770956-debb63d900bb?q=80&w=600',
    criado_em: new Date().toISOString()
  },
  {
    id: 'mock-prod-4',
    nome: 'Garfo Tridente de Bronze para Churrasco',
    descricao: 'Garfo de apoio tridente maciço em bronze fundido com polimento de alto brilho. Acompanha base rústica esculpida em madeira de araucária natural. O acessório perfeito para firmar peças grandes de carne e garantir cortes precisos.',
    preco: 110.00,
    categoria: 'Outros',
    estoque: 20,
    sku: 'E27-GF-TRID',
    erp_id: null,
    imagem_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600',
    criado_em: new Date().toISOString()
  }
]

interface ProductDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params

  // Tenta buscar no banco de dados do Supabase
  let product = await getProductById(id)

  // Se não encontrar, busca nos mockados (facilitando teste local imediato)
  if (!product) {
    product = MOCK_PRODUCTS.find((p) => p.id === id) || null
  }

  // Se não existir de forma alguma, gera 404
  if (!product) {
    notFound()
  }

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

        {/* PRODUTO INFO E IMAGEM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-[#1c1b18] border border-[#c8a261]/10 rounded-sm p-6 sm:p-10 shadow-2xl">
          
          {/* IMAGEM */}
          <div className="relative h-[300px] sm:h-[450px] bg-[#0f0f0e] rounded-sm overflow-hidden flex items-center justify-center border border-[#c8a261]/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.imagem_url || 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=800'}
              alt={product.nome}
              className="object-cover w-full h-full opacity-80"
            />
            <div className="absolute top-4 left-4 bg-[#c8a261]/15 border border-[#c8a261]/40 text-[#c8a261] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {product.categoria}
            </div>
          </div>

          {/* DETALHES */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-[#c8a261] font-bold tracking-[0.2em] uppercase block mb-1">
                E-Commerce Premium
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#f2ebd9] leading-tight">
                {product.nome}
              </h1>
              
              <div className="flex items-center gap-6 mt-4 pb-6 border-b border-[#c8a261]/15">
                <div>
                  <span className="text-[10px] text-[#f2ebd9]/40 block uppercase">Disponibilidade</span>
                  {product.estoque > 0 ? (
                    <span className="text-xs font-semibold text-green-500 flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                      {product.estoque} unidades em estoque
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-[#bd3a1d] flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 bg-[#bd3a1d] rounded-full"></span>
                      Esgotado
                    </span>
                  )}
                </div>
                
                {product.sku && (
                  <div>
                    <span className="text-[10px] text-[#f2ebd9]/40 block uppercase">Ref SKU</span>
                    <span className="text-xs font-mono text-[#f2ebd9]/75 mt-0.5 block">{product.sku}</span>
                  </div>
                )}
              </div>

              <div className="py-6">
                <span className="text-[10px] text-[#f2ebd9]/40 block uppercase mb-2">Descrição da Peça</span>
                <p className="text-sm text-[#f2ebd9]/80 leading-relaxed font-light whitespace-pre-line">
                  {product.descricao}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#c8a261]/15">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <span className="text-[10px] text-[#f2ebd9]/40 block uppercase">Preço Exclusivo</span>
                  <span className="text-3xl font-extrabold text-[#c8a261] block mt-1">
                    {formatCurrency(product.preco)}
                  </span>
                </div>
                <div className="text-right text-[10px] text-[#f2ebd9]/40">
                  Em até 12x no cartão ou Pix à vista
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  disabled={product.estoque === 0}
                  onClick={() => alert('Item adicionado ao carrinho de compras!')}
                  className={`w-full sm:flex-1 py-4 text-xs font-bold tracking-wider uppercase transition rounded-sm flex items-center justify-center ${
                    product.estoque > 0
                      ? 'bg-[#c8a261] hover:bg-[#b08b4c] text-[#0f0f0e]'
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  Adicionar ao Carrinho
                </button>
                <button
                  disabled={product.estoque === 0}
                  onClick={() => alert('Direcionando para o checkout de compra!')}
                  className={`w-full sm:flex-1 py-4 text-xs font-bold tracking-wider uppercase transition rounded-sm border ${
                    product.estoque > 0
                      ? 'border-[#c8a261] hover:bg-[#c8a261]/10 text-[#c8a261]'
                      : 'border-zinc-800 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  Comprar Agora
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
