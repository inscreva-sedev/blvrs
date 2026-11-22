import React, { useEffect, useState } from 'react'
import {
  MessageCircle,
  Lock,
  ShieldCheck,
  Menu,
  X,
  ArrowUpRight,
  PhoneCall,
} from 'lucide-react'
import { ServiceCategory, ServiceItem, SiteConfig } from '../types'

interface NavbarProps {
  config: SiteConfig
  services: ServiceItem[]
  isAdminLoggedIn: boolean
  onOpenQuote: (service?: ServiceCategory) => void
  onOpenCms: () => void
  onSelectPortfolioFilter: (category: string) => void
}

type MegaMenuKey = 'servicos' | 'portfolio' | 'bastidores' | null

export const Navbar: React.FC<NavbarProps> = ({
  config,
  services,
  isAdminLoggedIn,
  onOpenQuote,
  onOpenCms,
  onSelectPortfolioFilter,
}) => {
  const [scrolled, setScrolled] = useState(false)
  const [activeMenu, setActiveMenu] = useState<MegaMenuKey>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isLightBar = scrolled || activeMenu !== null

  const scrollTo = (id: string) => {
    setActiveMenu(null)
    setMobileOpen(false)
    const el = document.querySelector(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300"
      onMouseLeave={() => setActiveMenu(null)}
    >
      {/* Top Navigation Bar */}
      <div
        className={`w-full transition-all duration-300 ${
          isLightBar
            ? 'bg-white/95 backdrop-blur-md text-[#0B0B0B] shadow-[0_1px_0_rgba(11,11,11,0.08)]'
            : 'bg-gradient-to-b from-black/70 via-black/30 to-transparent text-white'
        }`}
      >
        <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-4 sm:px-8">
          {/* Official BLVRS MEDIA Logo */}
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault()
              scrollTo('#inicio')
            }}
            className="flex items-center gap-2.5 group focus:outline-none"
            aria-label="BLVRS MEDIA - Página inicial"
          >
            <span
              className={`inline-flex items-center rounded-lg px-2 py-0.5 transition-all duration-300 ${
                isLightBar ? 'bg-transparent' : 'bg-white/95 shadow-sm'
              }`}
            >
              <img
                src="/blvrs-logo.png"
                alt="BLVRS MEDIA"
                className="h-9 w-auto object-contain"
              />
            </span>
          </a>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Navegação principal">
            <button
              type="button"
              onMouseEnter={() => setActiveMenu('servicos')}
              onClick={() => scrollTo('#servicos')}
              className={`px-4 py-1.5 rounded-md text-[13px] font-semibold tracking-wide transition-colors cursor-pointer ${
                activeMenu === 'servicos'
                  ? 'bg-[#F2F2F2] text-[#0B0B0B]'
                  : isLightBar
                  ? 'hover:bg-[#F2F2F2]/80 text-[#0B0B0B]'
                  : 'hover:bg-white/15 text-white'
              }`}
            >
              Serviços
            </button>

            <button
              type="button"
              onMouseEnter={() => setActiveMenu('portfolio')}
              onClick={() => scrollTo('#portfolio')}
              className={`px-4 py-1.5 rounded-md text-[13px] font-semibold tracking-wide transition-colors cursor-pointer ${
                activeMenu === 'portfolio'
                  ? 'bg-[#F2F2F2] text-[#0B0B0B]'
                  : isLightBar
                  ? 'hover:bg-[#F2F2F2]/80 text-[#0B0B0B]'
                  : 'hover:bg-white/15 text-white'
              }`}
            >
              Portefólio
            </button>

            <button
              type="button"
              onMouseEnter={() => setActiveMenu('bastidores')}
              onClick={() => scrollTo('#sobre')}
              className={`px-4 py-1.5 rounded-md text-[13px] font-semibold tracking-wide transition-colors cursor-pointer ${
                activeMenu === 'bastidores'
                  ? 'bg-[#F2F2F2] text-[#0B0B0B]'
                  : isLightBar
                  ? 'hover:bg-[#F2F2F2]/80 text-[#0B0B0B]'
                  : 'hover:bg-white/15 text-white'
              }`}
            >
              Bastidores
            </button>

            <a
              href="#sobre"
              onMouseEnter={() => setActiveMenu(null)}
              onClick={(e) => {
                e.preventDefault()
                scrollTo('#sobre')
              }}
              className={`px-4 py-1.5 rounded-md text-[13px] font-semibold tracking-wide transition-colors ${
                isLightBar
                  ? 'hover:bg-[#F2F2F2]/80 text-[#0B0B0B]'
                  : 'hover:bg-white/15 text-white'
              }`}
            >
              Sobre Nós
            </a>

            <a
              href="#contactos"
              onMouseEnter={() => setActiveMenu(null)}
              onClick={(e) => {
                e.preventDefault()
                scrollTo('#contactos')
              }}
              className={`px-4 py-1.5 rounded-md text-[13px] font-semibold tracking-wide transition-colors ${
                isLightBar
                  ? 'hover:bg-[#F2F2F2]/80 text-[#0B0B0B]'
                  : 'hover:bg-white/15 text-white'
              }`}
            >
              Contactos
            </a>
          </nav>

          {/* Right Utility Icons (mirroring Tesla's minimal right action icons) */}
          <div className="flex items-center gap-1.5">
            <a
              href={`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(
                'Olá BLVRS MEDIA! Gostaria de saber mais sobre os vossos serviços.'
              )}`}
              target="_blank"
              rel="noreferrer"
              title="Falar via WhatsApp"
              className={`hidden sm:inline-flex items-center justify-center h-9 w-9 rounded-full transition-colors ${
                isLightBar ? 'hover:bg-[#F2F2F2] text-[#0B0B0B]' : 'hover:bg-white/15 text-white'
              }`}
            >
              <MessageCircle className="h-[18px] w-[18px]" />
            </a>

            <button
              type="button"
              onClick={() => onOpenQuote()}
              title="Solicitar Orçamento"
              className={`hidden sm:inline-flex items-center justify-center h-9 w-9 rounded-full transition-colors cursor-pointer ${
                isLightBar ? 'hover:bg-[#F2F2F2] text-[#0B0B0B]' : 'hover:bg-white/15 text-white'
              }`}
            >
              <PhoneCall className="h-[18px] w-[18px]" />
            </button>

            <button
              type="button"
              onClick={onOpenCms}
              title={isAdminLoggedIn ? 'Abrir Painel Administrativo' : 'Acesso Administrativo'}
              className={`inline-flex items-center gap-1.5 px-2.5 h-9 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                isLightBar
                  ? 'hover:bg-[#F2F2F2] text-[#0B0B0B]'
                  : 'hover:bg-white/15 text-white'
              }`}
            >
              {isAdminLoggedIn ? (
                <ShieldCheck className="h-[17px] w-[17px] text-[#F36B21]" />
              ) : (
                <Lock className="h-[16px] w-[16px]" />
              )}
              <span className="hidden xl:inline">Admin</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className={`lg:hidden inline-flex items-center justify-center h-9 w-9 rounded-md transition-colors cursor-pointer ${
                isLightBar ? 'hover:bg-[#F2F2F2] text-[#0B0B0B]' : 'hover:bg-white/15 text-white'
              }`}
              aria-label="Abrir menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Tesla-style Full-Width Mega Menu Dropdown */}
      {activeMenu && (
        <div className="hidden lg:block w-full bg-white text-[#0B0B0B] shadow-2xl border-t border-black/5 animate-mega-menu">
          <div className="mx-auto max-w-[1280px] px-8 py-10">
            {activeMenu === 'servicos' && (
              <div className="grid grid-cols-12 gap-8 items-start">
                <div className="col-span-9 grid grid-cols-4 gap-6">
                  {services
                    .filter((s) => s.featuredInMenu)
                    .map((srv) => (
                      <div key={srv.id} className="group flex flex-col items-center text-center">
                        <div className="w-full h-28 overflow-hidden rounded-lg bg-[#F2F2F2] mb-3">
                          <img
                            src={srv.image}
                            alt={srv.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <p className="font-display text-sm font-bold text-[#0B0B0B]">
                          {srv.shortTitle}
                        </p>
                        <div className="mt-1.5 flex items-center gap-3 text-xs text-[#555]">
                          <button
                            type="button"
                            onClick={() => scrollTo('#servicos')}
                            className="underline underline-offset-4 hover:text-[#0B0B0B] cursor-pointer"
                          >
                            Explorar
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenu(null)
                              onOpenQuote(srv.title)
                            }}
                            className="underline underline-offset-4 hover:text-[#F36B21] cursor-pointer"
                          >
                            Orçamento
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="col-span-3 border-l border-black/10 pl-8 space-y-3 text-sm font-medium text-[#0B0B0B]">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMenu(null)
                      onOpenQuote('Estratégia e Consultoria')
                    }}
                    className="block hover:text-[#F36B21] transition-colors cursor-pointer"
                  >
                    Estratégia & Consultoria
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollTo('#servicos')}
                    className="block hover:text-[#F36B21] transition-colors cursor-pointer"
                  >
                    Todos os Serviços
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMenu(null)
                      onOpenQuote()
                    }}
                    className="block hover:text-[#F36B21] transition-colors cursor-pointer"
                  >
                    Solicitar Cotação Personalizada
                  </button>
                </div>
              </div>
            )}

            {activeMenu === 'portfolio' && (
              <div className="grid grid-cols-12 gap-8 items-start">
                <div className="col-span-9 grid grid-cols-4 gap-6">
                  {[
                    {
                      label: 'Audiovisual',
                      img: '/images/service-audiovisual.jpg',
                      cat: 'Audiovisual',
                    },
                    {
                      label: 'Fotografia',
                      img: '/images/service-photography.jpg',
                      cat: 'Fotografia',
                    },
                    {
                      label: 'Branding',
                      img: '/images/hero-branding.jpg',
                      cat: 'Branding',
                    },
                    {
                      label: 'Conteúdos Digitais',
                      img: '/images/service-postprod.jpg',
                      cat: 'Conteúdos Digitais',
                    },
                  ].map((item) => (
                    <div key={item.label} className="group flex flex-col items-center text-center">
                      <div className="w-full h-28 overflow-hidden rounded-lg bg-[#F2F2F2] mb-3">
                        <img
                          src={item.img}
                          alt={item.label}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <p className="font-display text-sm font-bold text-[#0B0B0B]">{item.label}</p>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectPortfolioFilter(item.cat)
                          scrollTo('#portfolio')
                        }}
                        className="mt-1.5 text-xs text-[#555] underline underline-offset-4 hover:text-[#F36B21] cursor-pointer"
                      >
                        Ver projectos
                      </button>
                    </div>
                  ))}
                </div>
                <div className="col-span-3 border-l border-black/10 pl-8 space-y-3 text-sm font-medium">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectPortfolioFilter('Todos')
                      scrollTo('#portfolio')
                    }}
                    className="block hover:text-[#F36B21] transition-colors cursor-pointer"
                  >
                    Todos os Projectos
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectPortfolioFilter('Bastidores')
                      scrollTo('#portfolio')
                    }}
                    className="block hover:text-[#F36B21] transition-colors cursor-pointer"
                  >
                    Bastidores de Produção
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMenu(null)
                      onOpenCms()
                    }}
                    className="flex items-center gap-1.5 text-[#F36B21] hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    <span>Adicionar novo projecto</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {activeMenu === 'bastidores' && (
              <div className="grid grid-cols-12 gap-8 items-start">
                <div className="col-span-9 grid grid-cols-3 gap-6">
                  <div className="group flex flex-col items-center text-center">
                    <div className="w-full h-28 overflow-hidden rounded-lg bg-[#F2F2F2] mb-3">
                      <img
                        src="/images/hero-cinema.jpg"
                        alt="Equipamentos & Set"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <p className="font-display text-sm font-bold">Processo & Equipamentos</p>
                    <button
                      type="button"
                      onClick={() => scrollTo('#pilares')}
                      className="mt-1 text-xs text-[#555] underline underline-offset-4 hover:text-[#F36B21] cursor-pointer"
                    >
                      Descobrir
                    </button>
                  </div>
                  <div className="group flex flex-col items-center text-center">
                    <div className="w-full h-28 overflow-hidden rounded-lg bg-[#F2F2F2] mb-3">
                      <img
                        src="/images/service-postprod.jpg"
                        alt="Edição e Color Grading"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <p className="font-display text-sm font-bold">Edição & Pós-Produção</p>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectPortfolioFilter('Bastidores')
                        scrollTo('#portfolio')
                      }}
                      className="mt-1 text-xs text-[#555] underline underline-offset-4 hover:text-[#F36B21] cursor-pointer"
                    >
                      Explorar
                    </button>
                  </div>
                  <div className="group flex flex-col items-center text-center">
                    <div className="w-full h-28 overflow-hidden rounded-lg bg-[#F2F2F2] mb-3">
                      <img
                        src="/images/hero-branding.jpg"
                        alt="Identidade & Estética"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <p className="font-display text-sm font-bold">Identidade Visual BLVRS</p>
                    <button
                      type="button"
                      onClick={() => scrollTo('#identidade')}
                      className="mt-1 text-xs text-[#555] underline underline-offset-4 hover:text-[#F36B21] cursor-pointer"
                    >
                      Ver sistema
                    </button>
                  </div>
                </div>
                <div className="col-span-3 border-l border-black/10 pl-8 space-y-3 text-sm font-medium">
                  <button
                    type="button"
                    onClick={() => scrollTo('#sobre')}
                    className="block hover:text-[#F36B21] transition-colors cursor-pointer"
                  >
                    Quem Somos
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollTo('#fundador')}
                    className="block hover:text-[#F36B21] transition-colors cursor-pointer"
                  >
                    Fundador (Len Wolts)
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollTo('#clientes')}
                    className="block hover:text-[#F36B21] transition-colors cursor-pointer"
                  >
                    Nossos Clientes
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollTo('#pilares')}
                    className="block hover:text-[#F36B21] transition-colors cursor-pointer"
                  >
                    Pilares de Conteúdo
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollTo('#contactos')}
                    className="block hover:text-[#F36B21] transition-colors cursor-pointer"
                  >
                    Redes Sociais & Contactos
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-white text-[#0B0B0B] border-t border-black/10 shadow-2xl px-6 py-6 space-y-4">
          {[
            { label: 'Página Inicial', href: '#inicio' },
            { label: 'Serviços', href: '#servicos' },
            { label: 'Nossos Clientes', href: '#clientes' },
            { label: 'Portefólio', href: '#portfolio' },
            { label: 'Sobre Nós', href: '#sobre' },
            { label: 'Fundador', href: '#fundador' },
            { label: 'Pilares & Identidade', href: '#pilares' },
            { label: 'Contactos', href: '#contactos' },
          ].map((link) => (
            <button
              key={link.href}
              type="button"
              onClick={() => scrollTo(link.href)}
              className="block w-full text-left font-display text-base font-bold py-2 border-b border-black/5 hover:text-[#F36B21]"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false)
                onOpenQuote()
              }}
              className="w-full rounded-md bg-[#F36B21] py-3 text-sm font-semibold text-white"
            >
              Fale connosco / Pedir Orçamento
            </button>
            <a
              href={`https://wa.me/${config.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="w-full rounded-md bg-[#0B0B0B] py-3 text-center text-sm font-semibold text-white"
            >
              WhatsApp: {config.whatsappDisplay}
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
