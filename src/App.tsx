import React, { useEffect, useState } from 'react'
import { Navbar } from './components/Navbar'
import { HeroCarousel } from './components/HeroCarousel'
import { ServicesShowcase } from './components/ServicesShowcase'
import { ClientsSection } from './components/ClientsSection'
import { PortfolioSection } from './components/PortfolioSection'
import { AboutAndPillars } from './components/AboutAndPillars'
import { ContactSection } from './components/ContactSection'
import { QuoteModal } from './components/QuoteModal'
import { CmsDrawer } from './components/CmsDrawer'
import { AdminLoginModal } from './components/AdminLoginModal'
import { FloatingBar } from './components/FloatingBar'
import { ScrollProgress } from './components/ScrollProgress'
import { AdminSession, getAdminSession, logoutAdmin } from './lib/auth'
import {
  CLIENT_CREATIVES,
  CLIENT_LOGOS,
  DEFAULT_HERO_SLIDES,
  DEFAULT_PROJECTS,
  DEFAULT_SITE_CONFIG,
  SERVICES_DATA,
} from './data/blvrsData'
import {
  ClientCreativeItem,
  ClientLogoItem,
  HeroSlide,
  PortfolioCategory,
  ProjectItem,
  QuoteSubmission,
  ServiceCategory,
  ServiceItem,
  SiteConfig,
} from './types'

const STORAGE_KEYS = {
  projects: 'blvrs_projects_v5',
  config: 'blvrs_config_v2',
  quotes: 'blvrs_quotes_v1',
  heroSlides: 'blvrs_hero_v1',
  services: 'blvrs_services_v1',
  clients: 'blvrs_clients_v1',
  creatives: 'blvrs_creatives_v1',
}

function readStored<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
}

export function App() {
  const [projects, setProjects] = useState<ProjectItem[]>(() =>
    readStored(STORAGE_KEYS.projects, DEFAULT_PROJECTS)
  )
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() =>
    readStored(STORAGE_KEYS.heroSlides, DEFAULT_HERO_SLIDES)
  )
  const [services, setServices] = useState<ServiceItem[]>(() =>
    readStored(STORAGE_KEYS.services, SERVICES_DATA)
  )
  const [clients, setClients] = useState<ClientLogoItem[]>(() =>
    readStored(STORAGE_KEYS.clients, CLIENT_LOGOS)
  )
  const [clientCreatives, setClientCreatives] = useState<ClientCreativeItem[]>(() =>
    readStored(STORAGE_KEYS.creatives, CLIENT_CREATIVES)
  )
  const [config, setConfig] = useState<SiteConfig>(() =>
    readStored(STORAGE_KEYS.config, DEFAULT_SITE_CONFIG)
  )
  const [quotes, setQuotes] = useState<QuoteSubmission[]>(() =>
    readStored(STORAGE_KEYS.quotes, [])
  )

  const [portfolioFilter, setPortfolioFilter] = useState<PortfolioCategory>('Todos')
  const [quoteModalOpen, setQuoteModalOpen] = useState(false)
  const [quoteService, setQuoteService] = useState<ServiceCategory | undefined>(undefined)
  const [quoteNote, setQuoteNote] = useState<string | undefined>(undefined)
  const [cmsOpen, setCmsOpen] = useState(false)
  const [adminSession, setAdminSession] = useState<AdminSession | null>(() => getAdminSession())
  const [loginModalOpen, setLoginModalOpen] = useState(false)

  const handleOpenAdmin = () => {
    if (adminSession) {
      setCmsOpen(true)
    } else {
      setLoginModalOpen(true)
    }
  }

  const handleLogoutAdmin = () => {
    logoutAdmin()
    setAdminSession(null)
    setCmsOpen(false)
  }

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(projects))
  }, [projects])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.heroSlides, JSON.stringify(heroSlides))
  }, [heroSlides])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.services, JSON.stringify(services))
  }, [services])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.clients, JSON.stringify(clients))
  }, [clients])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.creatives, JSON.stringify(clientCreatives))
  }, [clientCreatives])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.config, JSON.stringify(config))
  }, [config])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.quotes, JSON.stringify(quotes))
  }, [quotes])

  // Sync with MongoDB API endpoints when deployed with serverless backend
  useEffect(() => {
    let active = true
    async function hydrateFromApi() {
      try {
        const [projRes, cfgRes, quotesRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/config'),
          fetch('/api/quotes'),
        ])
        if (!active) return

        if (projRes.ok) {
          const data = await projRes.json()
          if (Array.isArray(data.projects) && data.projects.length > 0) {
            setProjects(data.projects)
          }
        }
        if (cfgRes.ok) {
          const data = await cfgRes.json()
          if (data.config) {
            setConfig(data.config)
          }
        }
        if (quotesRes.ok) {
          const data = await quotesRes.json()
          if (Array.isArray(data.quotes) && data.quotes.length > 0) {
            setQuotes(data.quotes)
          }
        }
      } catch {
        // Local/static preview mode gracefully uses localStorage
      }
    }
    hydrateFromApi()
    return () => {
      active = false
    }
  }, [])

  const openQuoteModal = (service?: ServiceCategory, note?: string) => {
    setQuoteService(service)
    setQuoteNote(note)
    setQuoteModalOpen(true)
  }

  const handleSecondaryHeroAction = (selector: string) => {
    const el = document.querySelector(selector)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleQuoteSubmitted = (quote: QuoteSubmission) => {
    setQuotes((prev) => [quote, ...prev])
    fetch('/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quote),
    }).catch(() => {})
  }

  const handleAddProject = (proj: ProjectItem) => {
    setProjects((prev) => [proj, ...prev])
    fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proj),
    }).catch(() => {})
  }

  const handleUpdateProject = (proj: ProjectItem) => {
    setProjects((prev) => prev.map((p) => (p.id === proj.id ? proj : p)))
    fetch('/api/projects', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proj),
    }).catch(() => {})
  }

  const handleDeleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id))
    fetch(`/api/projects?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }).catch(() => {})
  }

  const handleUpdateConfig = (next: SiteConfig) => {
    setConfig(next)
    fetch('/api/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(next),
    }).catch(() => {})
  }

  const handleResetDefaults = () => {
    setProjects(DEFAULT_PROJECTS)
    setHeroSlides(DEFAULT_HERO_SLIDES)
    setServices(SERVICES_DATA)
    setClients(CLIENT_LOGOS)
    setClientCreatives(CLIENT_CREATIVES)
    setConfig(DEFAULT_SITE_CONFIG)
    Object.values(STORAGE_KEYS).forEach((k) => {
      if (k !== STORAGE_KEYS.quotes) localStorage.removeItem(k)
    })
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      <ScrollProgress />
      <Navbar
        config={config}
        services={services}
        isAdminLoggedIn={Boolean(adminSession)}
        onOpenQuote={(srv) => openQuoteModal(srv)}
        onOpenCms={handleOpenAdmin}
        onSelectPortfolioFilter={(cat) => setPortfolioFilter(cat as PortfolioCategory)}
      />

      <main>
        {/* 01. Página Inicial — Hero Carousel inspirado na Tesla */}
        <HeroCarousel
          slides={heroSlides}
          onPrimaryAction={(srv) => openQuoteModal(srv)}
          onSecondaryAction={handleSecondaryHeroAction}
        />

        {/* 03. Serviços — Showcase Horizontal em Cartões */}
        <ServicesShowcase
          services={services}
          onRequestQuote={(srv) => openQuoteModal(srv)}
        />

        {/* Nossos Clientes & Criativos Reais */}
        <ClientsSection
          clients={clients}
          creatives={clientCreatives}
          onOpenQuote={(srv, note) => openQuoteModal(srv, note)}
        />

        {/* 04. Portefólio — Galeria por Categorias */}
        <PortfolioSection
          projects={projects}
          activeCategory={portfolioFilter}
          onCategoryChange={setPortfolioFilter}
          onRequestSimilar={(srv, projName) => openQuoteModal(srv, projName)}
          onOpenCms={handleOpenAdmin}
        />

        {/* 02. Sobre Nós, Identidade & Pilares */}
        <AboutAndPillars config={config} onOpenQuote={() => openQuoteModal()} />

        {/* 05. Contactos & Formulário de Orçamento */}
        <ContactSection
          config={config}
          preselectedService={quoteService}
          onQuoteSubmitted={handleQuoteSubmitted}
        />
      </main>

      {/* Clean Editorial Footer */}
      <footer className="bg-[#0B0B0B] border-t border-white/10 py-10 pb-24 text-center text-xs text-[#A6A6A6]">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-display font-bold tracking-[0.22em] text-white uppercase">
              BLVRS MEDIA <span className="text-[#F36B21]">•</span> {new Date().getFullYear()}
            </p>
            <p>{config.signature}</p>
            <div className="flex items-center gap-4">
              <a href="#servicos" className="hover:text-white transition-colors">
                Serviços
              </a>
              <a href="#clientes" className="hover:text-white transition-colors">
                Clientes
              </a>
              <a href="#portfolio" className="hover:text-white transition-colors">
                Portefólio
              </a>
              <a href="#contactos" className="hover:text-white transition-colors">
                Contactos
              </a>
              <button
                type="button"
                onClick={handleOpenAdmin}
                className="hover:text-[#F36B21] transition-colors cursor-pointer"
              >
                Painel Admin
              </button>
            </div>
          </div>

          <div className="border-t border-white/10 pt-5 flex items-center justify-center">
            <a
              href="https://www.wehosthere.com/"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-[#171717] px-4 py-1.5 text-[11px] font-medium text-[#A6A6A6] transition-all hover:border-[#F36B21]/60 hover:text-white"
            >
              <span>Powered by</span>
              <img
                src="/images/wehosthere-logo.png"
                alt="WeHosThere"
                className="h-6 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </a>
          </div>
        </div>
      </footer>

      <FloatingBar config={config} onOpenQuote={() => openQuoteModal()} />

      <QuoteModal
        isOpen={quoteModalOpen}
        config={config}
        initialService={quoteService}
        initialNote={quoteNote}
        onClose={() => setQuoteModalOpen(false)}
        onSubmitQuote={handleQuoteSubmitted}
      />

      <AdminLoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSuccess={(session) => {
          setAdminSession(session)
          setLoginModalOpen(false)
          setCmsOpen(true)
        }}
      />

      <CmsDrawer
        isOpen={cmsOpen && Boolean(adminSession)}
        adminEmail={adminSession?.email || ''}
        onLogout={handleLogoutAdmin}
        onClose={() => setCmsOpen(false)}
        projects={projects}
        heroSlides={heroSlides}
        services={services}
        clients={clients}
        clientCreatives={clientCreatives}
        config={config}
        quotes={quotes}
        onAddProject={handleAddProject}
        onUpdateProject={handleUpdateProject}
        onDeleteProject={handleDeleteProject}
        onUpdateHeroSlides={setHeroSlides}
        onUpdateServices={setServices}
        onUpdateClients={setClients}
        onUpdateClientCreatives={setClientCreatives}
        onUpdateConfig={handleUpdateConfig}
        onResetDefaults={handleResetDefaults}
      />
    </div>
  )
}

export default App
