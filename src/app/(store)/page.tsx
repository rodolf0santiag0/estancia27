import Link from 'next/link'
import { getProducts } from '@/actions/products'
import { getRaffles } from '@/actions/raffles'
import { formatCurrency } from '@/lib/utils'
import { Product, Raffle } from '@/types'

// Dados Mockados de Alta Qualidade para Fallback (Garante visual premium inicial)
const MOCK_RAFFLES: Raffle[] = [
  {
    id: 'mock-raffle-1',
    titulo: 'Faca Artesanal Damasco Estância 27',
    descricao: 'Lâmina de 9 polegadas forjada em aço damasco (1095 e 15N20), padrão Random, empunhadura em jacarandá da Bahia com detalhes em latão e bainha de couro bovino legítimo costurada à mão.',
    produto_premio_id: null,
    valor_cota: 9.90,
    total_cotas: 1000,
    cotas_vendidas: 740,
    status: 'Ativa',
    data_sorteio: null,
    criado_em: new Date().toISOString()
  },
  {
    id: 'mock-raffle-2',
    titulo: 'Kit Mate do Patrão - Edição Limitada',
    descricao: 'Garrafa térmica preta fosca de 1.2L com gravação a laser Estância 27, cuia de porongo selecionado com bocal de prata 600 trabalhada, e bomba de prata com bojo redondo.',
    produto_premio_id: null,
    valor_cota: 4.90,
    total_cotas: 1000,
    cotas_vendidas: 410,
    status: 'Ativa',
    data_sorteio: null,
    criado_em: new Date().toISOString()
  }
]

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'mock-prod-1',
    nome: 'Faca Campeira Aço Carbono 1070',
    descricao: 'Faca tradicional campeira com lâmina de 8 polegadas em aço carbono 1070 com acabamento fosfatizado e cabo de osso bovino.',
    preco: 290.00,
    categoria: 'Corte',
    estoque: 12,
    sku: 'E27-FC-1070',
    erp_id: null,
    imagem_url: '/churrasco-mate-2.jpg',
    criado_em: new Date().toISOString()
  },
  {
    id: 'mock-prod-2',
    nome: 'Cuia de Porongo Premium Jacarandá',
    descricao: 'Cuia de porongo grosso revestida em couro e bocal de jacarandá torneado. Design robusto para mateadores exigentes.',
    preco: 145.00,
    categoria: 'Mate',
    estoque: 8,
    sku: 'E27-CP-PREM',
    erp_id: null,
    imagem_url: '/churrasco-mate-1.jpg',
    criado_em: new Date().toISOString()
  },
  {
    id: 'mock-prod-3',
    nome: 'Garrafa Térmica Estância 1.2L Preto Fosco',
    descricao: 'Garrafa térmica robusta com dupla parede de aço inox e isolamento a vácuo. Mantém a água do mate quente por até 24h.',
    preco: 360.00,
    categoria: 'Termicos',
    estoque: 15,
    sku: 'E27-GT-12PF',
    erp_id: null,
    imagem_url: '/churrasco-mate-1.jpg',
    criado_em: new Date().toISOString()
  },
  {
    id: 'mock-prod-4',
    nome: 'Garfo Tridente de Bronze para Churrasco',
    descricao: 'Garfo de apoio tridente maciço em bronze fundido com base de madeira de araucária. Item indispensável para cortes de precisão.',
    preco: 110.00,
    categoria: 'Outros',
    estoque: 20,
    sku: 'E27-GF-TRID',
    erp_id: null,
    imagem_url: '/churrasco-mate-2.jpg',
    criado_em: new Date().toISOString()
  }
]

export default async function StorePage() {
  // Busca dados reais do banco de dados do Supabase
  const dbProducts = await getProducts()
  const dbRaffles = await getRaffles()

  // Se o banco estiver vazio, usa os dados mockados
  const products = dbProducts.length > 0 ? dbProducts : MOCK_PRODUCTS
  const raffles = dbRaffles.length > 0 ? dbRaffles : MOCK_RAFFLES

  return (
    <div className="flex-1 flex flex-col">
      {/* HEADER / NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#0f0f0e]/95 backdrop-blur-md border-b border-[#c8a261]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo Marca Estância 27 em SVG */}
            <svg viewBox="0 0 100 100" className="w-12 h-12 text-[#c8a261]" fill="currentColor">
              <path d="M50 15 L80 40 L80 75 L50 90 L20 75 L20 40 Z" fill="none" stroke="currentColor" strokeWidth="3" />
              <path d="M50 25 L50 80" stroke="currentColor" strokeWidth="2" />
              <path d="M35 55 L65 55" stroke="currentColor" strokeWidth="2" />
              <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
            <div>
              <span className="font-serif text-2xl font-bold tracking-wider text-[#c8a261] block leading-none">ESTÂNCIA 27</span>
              <span className="text-[10px] tracking-[0.2em] text-[#f2ebd9]/60 block mt-1 uppercase">Facas &amp; Cultura</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
            <Link href="/" className="text-[#c8a261] hover:text-[#c8a261]/80 transition">Vitrine</Link>
            <a href="#rifas" className="text-[#f2ebd9]/80 hover:text-[#c8a261] transition">Ações/Rifas</a>
            <a href="#ecommerce" className="text-[#f2ebd9]/80 hover:text-[#c8a261] transition">E-commerce</a>
            <Link href="/admin" className="text-[#f2ebd9]/50 hover:text-[#c8a261] transition text-xs border border-[#c8a261]/30 rounded-full px-3 py-1">Painel CRM</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-[#f2ebd9]/80 hover:text-[#c8a261] transition font-medium">Entrar</Link>
            <Link href="/login" className="bg-[#c8a261] hover:bg-[#b08b4c] text-[#0f0f0e] px-4 py-2 rounded-sm text-sm font-semibold tracking-wide transition">Minhas Cotas</Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative py-28 md:py-36 bg-gradient-to-b from-[#1c1b18] via-[#0f0f0e] to-[#0f0f0e] overflow-hidden border-b border-[#c8a261]/10">
        <div className="absolute inset-0 opacity-20 bg-cover bg-center pointer-events-none" style={{ backgroundImage: "url('/churrasco-mate-1.jpg')" }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#c8a261]/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Brasão Oficial da Marca */}
          <div className="flex justify-center mb-6 animate-fadeIn">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/logo-brasao.jpg" 
              alt="Estância 27 Brasão" 
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border border-[#c8a261]/30 object-cover shadow-2xl shadow-[#c8a261]/15"
            />
          </div>
          <div className="inline-flex items-center gap-2 border border-[#c8a261]/30 px-3 py-1 rounded-full text-xs text-[#c8a261] bg-[#c8a261]/5 tracking-wider uppercase mb-6">
            <span className="w-1.5 h-1.5 bg-[#bd3a1d] rounded-full animate-pulse"></span>
            Qualidade Superior desde Santa Catarina
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-extrabold tracking-tight text-[#f2ebd9] mb-4">
            ESTÂNCIA <span className="text-[#c8a261]">27</span>
          </h1>
          <p className="font-serif text-lg md:text-2xl text-[#c8a261]/80 tracking-widest uppercase mb-8">
            Facas &amp; Cultura
          </p>
          <p className="max-w-2xl mx-auto text-[#f2ebd9]/75 text-sm md:text-base leading-relaxed mb-10">
            Unindo a tradição gaúcha de cutelaria fina em aço forjado à emoção de participar de nossas ações e sorteios exclusivos. Peças de colecionador e artigos premium de churrasco e chimarrão.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#rifas" className="w-full sm:w-auto bg-[#bd3a1d] hover:bg-[#a12f17] text-white px-8 py-4 rounded-sm text-sm font-bold tracking-wider uppercase transition shadow-lg shadow-[#bd3a1d]/20">
              Ver Rifas Ativas
            </a>
            <a href="#ecommerce" className="w-full sm:w-auto border border-[#c8a261] hover:bg-[#c8a261]/10 text-[#c8a261] px-8 py-4 rounded-sm text-sm font-bold tracking-wider uppercase transition">
              Comprar Cutelaria
            </a>
          </div>
        </div>
      </section>

      {/* RIFAS / SORTIEOS SECTION */}
      <section id="rifas" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#c8a261]">Ações &amp; Sorteios</h2>
          <div className="w-24 h-0.5 bg-[#c8a261]/40 mx-auto mt-3"></div>
          <p className="text-sm text-[#f2ebd9]/60 mt-4 max-w-lg mx-auto">Participe das nossas campanhas exclusivas e concorra a cutelaria fina forjada à mão e kits de churrasco premium.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {raffles.map((raffle) => {
            const pct = Math.round((raffle.cotas_vendidas / raffle.total_cotas) * 100)
            return (
              <div key={raffle.id} className="bg-[#1c1b18] border border-[#c8a261]/10 rounded-sm overflow-hidden flex flex-col sm:flex-row shadow-xl">
                {/* Imagem Placeholder Decorativa */}
                <div className="relative w-full sm:w-48 h-48 sm:h-auto bg-[#0f0f0e] flex items-center justify-center overflow-hidden shrink-0 border-b sm:border-b-0 sm:border-r border-[#c8a261]/10">
                  <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: `url(${raffle.id === 'mock-raffle-1' ? '/churrasco-mate-2.jpg' : '/churrasco-mate-1.jpg'})` }}></div>
                  <div className="absolute top-3 left-3 bg-[#bd3a1d] text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase animate-pulse">
                    Ativa
                  </div>
                  {/* SVG de faca/prêmio se não houver imagem */}
                  <svg viewBox="0 0 100 100" className="w-16 h-16 text-[#c8a261]/40 relative z-10" fill="currentColor">
                    <path d="M20 80 L75 25 L85 25 L85 35 L30 90 Z" />
                    <circle cx="80" cy="20" r="5" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-lg md:text-xl font-bold text-[#f2ebd9] leading-snug">{raffle.titulo}</h3>
                    <p className="text-xs text-[#f2ebd9]/70 mt-2 leading-relaxed line-clamp-3">{raffle.descricao}</p>
                  </div>

                  <div className="mt-6">
                    {/* Barra de Progresso */}
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[#f2ebd9]/60">Cotas Vendidas</span>
                      <span className="font-bold text-[#c8a261]">{pct}% ({raffle.cotas_vendidas} / {raffle.total_cotas})</span>
                    </div>
                    <div className="w-full h-2 bg-[#0f0f0e] rounded-full overflow-hidden border border-[#c8a261]/10">
                      <div className="h-full bg-gradient-to-r from-[#b08b4c] to-[#bd3a1d] rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
                    </div>

                    <div className="mt-4 flex items-center justify-between pt-4 border-t border-[#c8a261]/10">
                      <div>
                        <span className="text-[10px] text-[#f2ebd9]/40 block uppercase">Valor da Cota</span>
                        <span className="text-lg font-bold text-[#c8a261]">{formatCurrency(raffle.valor_cota)}</span>
                      </div>
                      <Link href={`/rifas/${raffle.id}`} className="bg-[#c8a261] hover:bg-[#b08b4c] text-[#0f0f0e] px-4 py-2 text-xs font-bold tracking-wider uppercase transition rounded-sm">
                        Comprar Cotas
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* E-COMMERCE SECTION */}
      <section id="ecommerce" className="py-20 bg-[#1c1b18]/40 border-y border-[#c8a261]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#c8a261]">Nossa Cutelaria &amp; Artigos</h2>
            <div className="w-24 h-0.5 bg-[#c8a261]/40 mx-auto mt-3"></div>
            <p className="text-sm text-[#f2ebd9]/60 mt-4 max-w-lg mx-auto">Seleção exclusiva de produtos premium fabricados com a melhor tradição artesanal.</p>
          </div>

          {/* Grid de Produtos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-[#1c1b18] border border-[#c8a261]/10 rounded-sm overflow-hidden flex flex-col justify-between group hover:border-[#c8a261]/30 transition shadow-md">
                {/* Imagem do Produto */}
                <Link href={`/products/${product.id}`} className="h-56 bg-[#0f0f0e] relative overflow-hidden flex items-center justify-center block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={product.imagem_url || (product.categoria === 'Corte' || product.categoria === 'Outros' ? '/churrasco-mate-2.jpg' : '/churrasco-mate-1.jpg')} 
                    alt={product.nome}
                    className="object-cover w-full h-full group-hover:scale-105 transition duration-500 opacity-80"
                  />
                  <div className="absolute top-3 left-3 bg-[#c8a261]/10 border border-[#c8a261]/40 text-[#c8a261] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {product.categoria}
                  </div>
                </Link>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <Link href={`/products/${product.id}`} className="hover:underline">
                      <h3 className="font-serif text-sm font-bold text-[#f2ebd9] group-hover:text-[#c8a261] transition line-clamp-1">{product.nome}</h3>
                    </Link>
                    <p className="text-[11px] text-[#f2ebd9]/60 mt-1.5 leading-relaxed line-clamp-2">{product.descricao}</p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#c8a261]/10 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-[#f2ebd9]/40 block uppercase">Preço</span>
                      <span className="text-base font-bold text-[#c8a261]">{formatCurrency(product.preco)}</span>
                    </div>
                    <Link href={`/products/${product.id}`} className="bg-transparent border border-[#c8a261] hover:bg-[#c8a261] text-[#c8a261] hover:text-[#0f0f0e] px-3 py-1.5 text-xs font-bold transition rounded-sm">
                      Detalhes
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS SECTION */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-[#c8a261]/10">
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-[#c8a261]/10 text-[#c8a261] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#c8a261]/25">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h4 className="font-serif text-[#f2ebd9] font-bold text-sm tracking-wide">Compra 100% Segura</h4>
          <p className="text-[11px] text-[#f2ebd9]/50 mt-2 leading-relaxed">Seus dados e transações protegidos por criptografia de ponta a ponta e gateway seguro.</p>
        </div>

        <div className="text-center p-4">
          <div className="w-12 h-12 bg-[#c8a261]/10 text-[#c8a261] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#c8a261]/25">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
          </div>
          <h4 className="font-serif text-[#f2ebd9] font-bold text-sm tracking-wide">Qualidade Superior</h4>
          <p className="text-[11px] text-[#f2ebd9]/50 mt-2 leading-relaxed">Cutelaria forjada artesanalmente com os melhores materiais do mercado.</p>
        </div>

        <div className="text-center p-4">
          <div className="w-12 h-12 bg-[#c8a261]/10 text-[#c8a261] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#c8a261]/25">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h4 className="font-serif text-[#f2ebd9] font-bold text-sm tracking-wide">Entrega Garantida</h4>
          <p className="text-[11px] text-[#f2ebd9]/50 mt-2 leading-relaxed">Enviamos para todo o Brasil com embalagem especial reforçada e seguro total.</p>
        </div>

        <div className="text-center p-4">
          <div className="w-12 h-12 bg-[#c8a261]/10 text-[#c8a261] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#c8a261]/25">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h4 className="font-serif text-[#f2ebd9] font-bold text-sm tracking-wide">Suporte VIP</h4>
          <p className="text-[11px] text-[#f2ebd9]/50 mt-2 leading-relaxed">Atendimento dedicado via WhatsApp para tirar dúvidas sobre produtos e cotas.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0f0f0e] py-12 border-t border-[#c8a261]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 100 100" className="w-8 h-8 text-[#c8a261]/70" fill="currentColor">
              <path d="M50 15 L80 40 L80 75 L50 90 L20 75 L20 40 Z" fill="none" stroke="currentColor" strokeWidth="3" />
              <path d="M50 25 L50 80" stroke="currentColor" strokeWidth="2" />
            </svg>
            <div className="text-left">
              <span className="font-serif text-base tracking-wider text-[#c8a261] block leading-none">ESTÂNCIA 27</span>
              <span className="text-[8px] tracking-[0.2em] text-[#f2ebd9]/40 block uppercase">Facas &amp; Cultura</span>
            </div>
          </div>

          <div className="text-xs text-[#f2ebd9]/40 text-center">
            &copy; {new Date().getFullYear()} Estância 27. Todos os direitos reservados. Qualidade Superior desde Santa Catarina.
          </div>

          <div className="flex items-center gap-6 text-xs text-[#f2ebd9]/50">
            <a href="#" className="hover:text-[#c8a261] transition">Políticas de Privacidade</a>
            <a href="#" className="hover:text-[#c8a261] transition">Termos de Uso</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
