import React, { useEffect, useState } from 'react'
import { Navbar } from './components/Navbar'
import { HeroCarousel } from './components/HeroCarousel'
import { ServicesShowcase } from './components/ServicesShowcase'
import { ClientsSection } from './components/ClientsSection'
import { PortfolioSection } from './components/PortfolioSection'
import { AboutAndPillars } from './components/AboutAndPillars'
import { FounderSection } from './components/FounderSection'
import { TeamSection } from './components/TeamSection'
import { ContactSection } from './components/ContactSection'
import { QuoteModal } from './components/QuoteModal'
import { AdminDashboard } from './components/AdminDashboard'
import { AdminLoginModal } from './components/AdminLoginModal'
import { FloatingBar } from './components/FloatingBar'
import { ScrollProgress } from './components/ScrollProgress'
import { ScrollControl } from './components/ScrollControl'
import { AdminSession, getAdminSession, getAuthHeaders, logoutAdmin } from './lib/auth'
import { shrinkDataUrlIfOversized } from './lib/cloudinary'
import {
  CLIENT_CREATIVES,
  CLIENT_LOGOS,
  DEFAULT_HERO_SLIDES,
  DEFAULT_PROJECTS,
  DEFAULT_SITE_CONFIG,
  DEFAULT_TEAM_MEMBERS,
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
  TeamMember,
} from './types'

const STORAGE_KEYS = {
  projects: 'blvrs_projects_v11',
  config: 'blvrs_config_v4',
  quotes: 'blvrs_quotes_v1',
  heroSlides: 'blvrs_hero_v1',
  services: 'blvrs_services_v1',
  clients: 'blvrs_clients_v1',
  creatives: 'blvrs_creatives_v1',
  teamMembers: 'blvrs_team_v4',
  teamRemovedIds: 'blvrs_team_removed_v1',
}

function readStored<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
}

function writeStored<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

function mergeTeamDefaults(list: TeamMember[]): TeamMember[] {
  const removedIds = new Set(readStored<string[]>(STORAGE_KEYS.teamRemovedIds, []))
  const updated = list.map((member) => {
    if (
      member.id === 'team-jermain-advertencio' &&
      (!member.instagram || member.instagram === 'https://www.instagram.com/blvrs_media/')
    ) {
      return { ...member, instagram: 'https://www.instagram.com/len_wolts/' }
    }
    if (member.id === 'team-afonso-domingos' && !member.instagram) {
      return { ...member, instagram: 'https://www.instagram.com/isvib.e/' }
    }
    if (member.id === 'team-kelvin-aristides' && !member.instagram) {
      return { ...member, instagram: 'https://www.instagram.com/inf8m8us/' }
    }
    return member
  })

  const existingIds = new Set(updated.map((m) => m.id))
  const kelvin = DEFAULT_TEAM_MEMBERS.find((m) => m.id === 'team-kelvin-aristides')
  if (kelvin && !existingIds.has(kelvin.id) && !removedIds.has(kelvin.id)) {
    updated.push(kelvin)
  }

  return updated
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
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() =>
    mergeTeamDefaults(readStored(STORAGE_KEYS.teamMembers, DEFAULT_TEAM_MEMBERS))
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
    writeStored(STORAGE_KEYS.projects, projects)
  }, [projects])

  useEffect(() => {
    writeStored(STORAGE_KEYS.heroSlides, heroSlides)
  }, [heroSlides])

  useEffect(() => {
    writeStored(STORAGE_KEYS.services, services)
  }, [services])

  useEffect(() => {
    writeStored(STORAGE_KEYS.clients, clients)
  }, [clients])

  useEffect(() => {
    writeStored(STORAGE_KEYS.creatives, clientCreatives)
  }, [clientCreatives])

  useEffect(() => {
    writeStored(STORAGE_KEYS.teamMembers, teamMembers)
  }, [teamMembers])

  useEffect(() => {
    writeStored(STORAGE_KEYS.config, config)
  }, [config])

  useEffect(() => {
    writeStored(STORAGE_KEYS.quotes, quotes)
  }, [quotes])

  // Compact any previously stored oversized local data-URL team photos so quota stays healthy
  useEffect(() => {
    let active = true
    async function compactOversizedTeamImages() {
      const hasOversized = teamMembers.some(
        (m) => m.image.startsWith('data:image/') && m.image.length > 300_000
      )
      if (!hasOversized) return
      const next = await Promise.all(
        teamMembers.map(async (m) => ({
          ...m,
          image: await shrinkDataUrlIfOversized(m.image),
        }))
      )
      if (active) {
        setTeamMembers(next)
      }
    }
    compactOversizedTeamImages()
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync public content & projects with MongoDB API endpoints when deployed
  useEffect(() => {
    let active = true
    async function hydratePublicFromApi() {
      try {
        const [projRes, cfgRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/config'),
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
          const bundle = data.bundle || data.config
          if (bundle) {
            if (bundle.config) setConfig(bundle.config)
            else if (bundle.brandName) setConfig(bundle)
            if (Array.isArray(bundle.heroSlides) && bundle.heroSlides.length > 0) {
              setHeroSlides(bundle.heroSlides)
            }
            if (Array.isArray(bundle.services) && bundle.services.length > 0) {
              setServices(bundle.services)
            }
            if (Array.isArray(bundle.clients) && bundle.clients.length > 0) {
              setClients(bundle.clients)
            }
            if (Array.isArray(bundle.clientCreatives) && bundle.clientCreatives.length > 0) {
              setClientCreatives(bundle.clientCreatives)
            }
            if (Array.isArray(bundle.teamMembers) && bundle.teamMembers.length > 0) {
              setTeamMembers(mergeTeamDefaults(bundle.teamMembers))
            }
          }
        }
      } catch {
        // Local/static preview mode gracefully uses localStorage
      }
    }
    hydratePublicFromApi()
    return () => {
      active = false
    }
  }, [])

  // Fetch protected CRM quotes only when admin session is active
  useEffect(() => {
    if (!adminSession?.token) return
    let active = true
    async function hydrateQuotes() {
      try {
        const res = await fetch('/api/quotes', { headers: getAuthHeaders() })
        if (!active || !res.ok) return
        const data = await res.json()
        if (Array.isArray(data.quotes) && data.quotes.length > 0) {
          setQuotes(data.quotes)
        }
      } catch {
        // ignore in offline/static mode
      }
    }
    hydrateQuotes()
    return () => {
      active = false
    }
  }, [adminSession?.token])

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

  const persistBundle = (overrides: {
    config?: SiteConfig
    heroSlides?: HeroSlide[]
    services?: ServiceItem[]
    clients?: ClientLogoItem[]
    clientCreatives?: ClientCreativeItem[]
    teamMembers?: TeamMember[]
  }) => {
    const bundle = {
      config: overrides.config ?? config,
      heroSlides: overrides.heroSlides ?? heroSlides,
      services: overrides.services ?? services,
      clients: overrides.clients ?? clients,
      clientCreatives: overrides.clientCreatives ?? clientCreatives,
      teamMembers: overrides.teamMembers ?? teamMembers,
    }
    fetch('/api/config', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(bundle),
    }).catch(() => {})
  }

  const handleQuoteSubmitted = (quote: QuoteSubmission) => {
    setQuotes((prev) => [quote, ...prev])
    fetch('/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quote),
    }).catch(() => {})
  }

  const handleUpdateQuotes = (nextQuotes: QuoteSubmission[]) => {
    // Persist changed quote status when updated from Admin CRM
    nextQuotes.forEach((nextQ) => {
      const prevQ = quotes.find((q) => q.id === nextQ.id)
      if (prevQ && prevQ.status !== nextQ.status) {
        fetch('/api/quotes', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
          body: JSON.stringify({ id: nextQ.id, status: nextQ.status }),
        }).catch(() => {})
      }
    })
    setQuotes(nextQuotes)
  }

  const syncProjectsToApi = (nextProjects: ProjectItem[]) => {
    fetch('/api/projects', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ projects: nextProjects }),
    }).catch(() => {})
  }

  const handleAddProject = (proj: ProjectItem) => {
    setProjects((prev) => {
      const next = [proj, ...prev]
      syncProjectsToApi(next)
      return next
    })
  }

  const handleUpdateProject = (proj: ProjectItem) => {
    setProjects((prev) => {
      const next = prev.map((p) => (p.id === proj.id ? proj : p))
      syncProjectsToApi(next)
      return next
    })
  }

  const handleDeleteProject = (id: string) => {
    setProjects((prev) => {
      const next = prev.filter((p) => p.id !== id)
      syncProjectsToApi(next)
      return next
    })
  }

  const handleUpdateConfig = (next: SiteConfig) => {
    setConfig(next)
    persistBundle({ config: next })
  }

  const handleUpdateHeroSlides = (next: HeroSlide[]) => {
    setHeroSlides(next)
    persistBundle({ heroSlides: next })
  }

  const handleUpdateServices = (next: ServiceItem[]) => {
    setServices(next)
    persistBundle({ services: next })
  }

  const handleUpdateClients = (next: ClientLogoItem[]) => {
    setClients(next)
    persistBundle({ clients: next })
  }

  const handleUpdateClientCreatives = (next: ClientCreativeItem[]) => {
    setClientCreatives(next)
    persistBundle({ clientCreatives: next })
  }

  const handleUpdateTeamMembers = (next: React.SetStateAction<TeamMember[]>) => {
    setTeamMembers((prev) => {
      const resolved = typeof next === 'function' ? next(prev) : next
      const resolvedIds = new Set(resolved.map((m) => m.id))
      const newlyRemoved = prev
        .filter((m) => !resolvedIds.has(m.id))
        .map((m) => m.id)
      if (newlyRemoved.length > 0) {
        const existingRemoved = readStored<string[]>(STORAGE_KEYS.teamRemovedIds, [])
        writeStored(
          STORAGE_KEYS.teamRemovedIds,
          Array.from(new Set([...existingRemoved, ...newlyRemoved]))
        )
      }
      persistBundle({ teamMembers: resolved })
      return resolved
    })
  }

  const handleResetDefaults = () => {
    setProjects(DEFAULT_PROJECTS)
    setHeroSlides(DEFAULT_HERO_SLIDES)
    setServices(SERVICES_DATA)
    setClients(CLIENT_LOGOS)
    setClientCreatives(CLIENT_CREATIVES)
    setTeamMembers(DEFAULT_TEAM_MEMBERS)
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
        {/* 01. Página Inicial - Hero Carousel inspirado na Tesla */}
        <HeroCarousel
          slides={heroSlides}
          onPrimaryAction={(srv) => openQuoteModal(srv)}
          onSecondaryAction={handleSecondaryHeroAction}
        />

        {/* 03. Serviços - Showcase Horizontal em Cartões */}
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

        {/* 04. Portefólio - Galeria por Categorias */}
        <PortfolioSection
          projects={projects}
          activeCategory={portfolioFilter}
          onCategoryChange={setPortfolioFilter}
          onRequestSimilar={(srv, projName) => openQuoteModal(srv, projName)}
          onOpenCms={handleOpenAdmin}
        />

        {/* 02. Sobre Nós, Identidade & Pilares */}
        <AboutAndPillars config={config} onOpenQuote={() => openQuoteModal()} />

        {/* Fundador & Direcção Criativa - Len Wolts */}
        <FounderSection onOpenQuote={() => openQuoteModal()} />

        {/* Equipe BLVRS MEDIA */}
        <TeamSection
          config={config}
          teamMembers={teamMembers}
          onOpenQuote={() => openQuoteModal()}
        />

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
              <a href="#fundador" className="hover:text-white transition-colors">
                Fundador
              </a>
              <a href="#equipe" className="hover:text-white transition-colors">
                Equipe
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
      <ScrollControl />

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

      <AdminDashboard
        isOpen={cmsOpen && Boolean(adminSession)}
        adminEmail={adminSession?.email || ''}
        onLogout={handleLogoutAdmin}
        onClose={() => setCmsOpen(false)}
        projects={projects}
        heroSlides={heroSlides}
        services={services}
        clients={clients}
        clientCreatives={clientCreatives}
        teamMembers={teamMembers}
        config={config}
        quotes={quotes}
        onAddProject={handleAddProject}
        onUpdateProject={handleUpdateProject}
        onDeleteProject={handleDeleteProject}
        onUpdateHeroSlides={handleUpdateHeroSlides}
        onUpdateServices={handleUpdateServices}
        onUpdateClients={handleUpdateClients}
        onUpdateClientCreatives={handleUpdateClientCreatives}
        onUpdateTeamMembers={handleUpdateTeamMembers}
        onUpdateQuotes={handleUpdateQuotes}
        onUpdateConfig={handleUpdateConfig}
        onResetDefaults={handleResetDefaults}
      />
    </div>
  )
}

export default App
