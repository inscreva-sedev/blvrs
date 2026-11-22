import React, { useMemo, useState } from 'react'
import {
  LayoutDashboard,
  FolderKanban,
  Sparkles,
  Users,
  Inbox,
  Settings,
  LogOut,
  ExternalLink,
  Plus,
  Pencil,
  Trash2,
  UploadCloud,
  Check,
  Search,
  MessageCircle,
  Mail,
  Download,
  RotateCcw,
  Star,
  Menu,
  X,
  Database,
  Cloud,
} from 'lucide-react'
import {
  ClientCreativeItem,
  ClientLogoItem,
  HeroSlide,
  PortfolioCategory,
  ProjectItem,
  QuoteSubmission,
  ServiceItem,
  SiteConfig,
} from '../types'
import {
  CLOUDINARY_CLOUD_NAME,
  optimizeMediaUrl,
  uploadMediaAsset,
} from '../lib/cloudinary'

type AdminTab = 'overview' | 'projects' | 'sections' | 'clients' | 'quotes' | 'settings'

interface AdminDashboardProps {
  isOpen: boolean
  adminEmail: string
  onLogout: () => void
  onClose: () => void
  projects: ProjectItem[]
  heroSlides: HeroSlide[]
  services: ServiceItem[]
  clients: ClientLogoItem[]
  clientCreatives: ClientCreativeItem[]
  config: SiteConfig
  quotes: QuoteSubmission[]
  onAddProject: (proj: ProjectItem) => void
  onUpdateProject: (proj: ProjectItem) => void
  onDeleteProject: (id: string) => void
  onUpdateHeroSlides: (slides: HeroSlide[]) => void
  onUpdateServices: (services: ServiceItem[]) => void
  onUpdateClients: (clients: ClientLogoItem[]) => void
  onUpdateClientCreatives: (creatives: ClientCreativeItem[]) => void
  onUpdateQuotes: (quotes: QuoteSubmission[]) => void
  onUpdateConfig: (next: SiteConfig) => void
  onResetDefaults: () => void
}

const IMAGE_PRESETS = [
  { label: 'Estúdio Cinema (Hero)', url: '/images/hero-cinema.jpg' },
  { label: 'Produção Audiovisual', url: '/images/service-audiovisual.jpg' },
  { label: 'Estúdio Fotográfico', url: '/images/service-photography.jpg' },
  { label: 'Espaço & Equipamento (IM Fisio)', url: '/images/im-fisio-equipamento.jpg' },
  { label: 'Fotografia Corporativa (IM Fisio)', url: '/images/im-fisio-arrumacao.jpg' },
  { label: 'Consulta Clínica Vertical (IM Fisio)', url: '/images/im-fisio-consulta.jpg' },
  { label: 'Direcção & Branding', url: '/images/hero-branding.jpg' },
  { label: 'Pós-Produção & Bastidores', url: '/images/service-postprod.jpg' },
]

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  adminEmail,
  onLogout,
  onClose,
  projects,
  heroSlides,
  services,
  clients,
  clientCreatives,
  config,
  quotes,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onUpdateHeroSlides,
  onUpdateServices,
  onUpdateClients,
  onUpdateClientCreatives,
  onUpdateQuotes,
  onUpdateConfig,
  onResetDefaults,
}) => {
  const [tab, setTab] = useState<AdminTab>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [uploadingKey, setUploadingKey] = useState<string | null>(null)

  // Portfolio search/filter & editor
  const [projectSearch, setProjectSearch] = useState('')
  const [projectFilter, setProjectFilter] = useState<string>('Todos')
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [client, setClient] = useState('')
  const [year, setYear] = useState('2026')
  const [category, setCategory] = useState<Exclude<PortfolioCategory, 'Todos'>>('Audiovisual')
  const [mediaType, setMediaType] = useState<ProjectItem['mediaType']>('video')
  const [image, setImage] = useState('/images/service-audiovisual.jpg')
  const [gallery, setGallery] = useState<string[]>([])
  const [videoUrl, setVideoUrl] = useState('')
  const [summary, setSummary] = useState('')
  const [strategy, setStrategy] = useState('')
  const [deliverablesRaw, setDeliverablesRaw] = useState('Vídeo Principal, Fotos de Campanha')
  const [featured, setFeatured] = useState(true)

  // Clients & Creatives form state
  const [creativeFilter, setCreativeFilter] = useState('Todos')
  const [newClientName, setNewClientName] = useState('')
  const [newClientSector, setNewClientSector] = useState('')
  const [newClientLogo, setNewClientLogo] = useState('')
  const [newClientFit, setNewClientFit] = useState<ClientLogoItem['fit']>('contain-white')

  const [newCreativeClient, setNewCreativeClient] = useState('Chicken Village')
  const [newCreativeTitle, setNewCreativeTitle] = useState('')
  const [newCreativeImage, setNewCreativeImage] = useState('')

  const [confirmReset, setConfirmReset] = useState(false)

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesCat = projectFilter === 'Todos' || p.category === projectFilter
      const q = projectSearch.trim().toLowerCase()
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q)
      return matchesCat && matchesQuery
    })
  }, [projects, projectFilter, projectSearch])

  const filteredCreatives = useMemo(() => {
    if (creativeFilter === 'Todos') return clientCreatives
    return clientCreatives.filter((c) => c.clientKey === creativeFilter)
  }, [clientCreatives, creativeFilter])

  if (!isOpen) return null

  const notify = (msg: string) => {
    setErrorMsg(null)
    setToast(msg)
    setTimeout(() => setToast((curr) => (curr === msg ? null : curr)), 4000)
  }

  const resetProjectForm = () => {
    setEditingId(null)
    setTitle('')
    setClient('')
    setYear('2026')
    setCategory('Audiovisual')
    setMediaType('video')
    setImage('/images/service-audiovisual.jpg')
    setGallery([])
    setVideoUrl('')
    setSummary('')
    setStrategy('')
    setDeliverablesRaw('Vídeo Principal, Fotos de Campanha')
    setFeatured(true)
    setShowProjectForm(false)
  }

  const openNewProjectForm = () => {
    resetProjectForm()
    setShowProjectForm(true)
    setTab('projects')
  }

  const startEditingProject = (proj: ProjectItem) => {
    setEditingId(proj.id)
    setTitle(proj.title)
    setClient(proj.client)
    setYear(proj.year)
    setCategory(proj.category)
    setMediaType(proj.mediaType)
    setImage(proj.image)
    setGallery(proj.gallery || [])
    setVideoUrl(proj.videoUrl || '')
    setSummary(proj.summary)
    setStrategy(proj.strategy)
    setDeliverablesRaw(proj.deliverables.join(', '))
    setFeatured(proj.featured)
    setShowProjectForm(true)
    setTab('projects')
  }

  const handleUpload = async (
    file: File,
    key: string,
    folder: string,
    onSuccessUrl: (url: string, resourceType: 'image' | 'video' | 'raw') => void
  ) => {
    setUploadingKey(key)
    setErrorMsg(null)
    try {
      const result = await uploadMediaAsset(file, folder)
      const finalUrl =
        result.resourceType === 'image'
          ? optimizeMediaUrl(result.secureUrl, 1600)
          : result.secureUrl
      onSuccessUrl(finalUrl, result.resourceType)
      notify(
        result.storageMode === 'cloudinary'
          ? `Enviado para Cloudinary (${CLOUDINARY_CLOUD_NAME}).`
          : 'Imagem optimizada e pronta a guardar.'
      )
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Erro ao carregar ficheiro.')
    } finally {
      setUploadingKey(null)
    }
  }

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !client.trim() || !summary.trim()) return

    const payload: ProjectItem = {
      id: editingId || `proj-${Date.now()}`,
      title: title.trim(),
      client: client.trim(),
      year: year.trim() || '2026',
      category,
      mediaType,
      image: optimizeMediaUrl(image.trim(), 1600) || '/images/hero-cinema.jpg',
      gallery: gallery.length > 0 ? gallery : undefined,
      videoUrl: videoUrl.trim() || undefined,
      summary: summary.trim(),
      strategy: strategy.trim() || 'Execução criativa alinhada ao posicionamento da marca.',
      deliverables: deliverablesRaw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      featured,
    }

    if (editingId) {
      onUpdateProject(payload)
      notify('Projecto actualizado com sucesso.')
    } else {
      onAddProject(payload)
      notify('Novo projecto publicado no portefólio.')
    }
    resetProjectForm()
  }

  const handleToggleFeatured = (proj: ProjectItem) => {
    onUpdateProject({ ...proj, featured: !proj.featured })
    notify(proj.featured ? 'Removido dos destaques.' : 'Marcado como destaque.')
  }

  const handleHeroFieldUpdate = (slideId: string, patch: Partial<HeroSlide>) => {
    onUpdateHeroSlides(
      heroSlides.map((s) => (s.id === slideId ? { ...s, ...patch } : s))
    )
  }

  const handleServiceFieldUpdate = (srvId: string, patch: Partial<ServiceItem>) => {
    onUpdateServices(services.map((s) => (s.id === srvId ? { ...s, ...patch } : s)))
  }

  const handleAddClientLogo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newClientName.trim() || !newClientLogo.trim()) return
    const nextClient: ClientLogoItem = {
      id: `cli-${Date.now()}`,
      name: newClientName.trim(),
      sector: newClientSector.trim() || 'Parceiro Comercial',
      image: newClientLogo.trim(),
      fit: newClientFit,
      creativesFolderKey: newClientName.trim(),
    }
    onUpdateClients([...clients, nextClient])
    setNewClientName('')
    setNewClientSector('')
    setNewClientLogo('')
    notify('Novo cliente adicionado.')
  }

  const handleAddCreative = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCreativeTitle.trim() || !newCreativeImage.trim()) return
    const matchingClient = clients.find(
      (c) => c.creativesFolderKey === newCreativeClient || c.name === newCreativeClient
    )
    const nextItem: ClientCreativeItem = {
      id: `cre-${Date.now()}`,
      clientKey: newCreativeClient,
      clientName: matchingClient?.name || newCreativeClient,
      sector: matchingClient?.sector || 'Campanha Digital',
      title: newCreativeTitle.trim(),
      image: newCreativeImage.trim(),
    }
    onUpdateClientCreatives([nextItem, ...clientCreatives])
    setNewCreativeTitle('')
    setNewCreativeImage('')
    notify('Criativo publicado na galeria de clientes.')
  }

  const handleQuoteStatusChange = (quoteId: string, status: QuoteSubmission['status']) => {
    onUpdateQuotes(quotes.map((q) => (q.id === quoteId ? { ...q, status } : q)))
    notify('Estado do orçamento actualizado.')
  }

  const handleExportJson = () => {
    const payload = JSON.stringify(
      { config, projects, heroSlides, services, clients, clientCreatives, quotes },
      null,
      2
    )
    const blob = new Blob([payload], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `blvrs-media-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    notify('Backup JSON exportado.')
  }

  const handleExportQuotesCsv = () => {
    const header = ['Data', 'Nome', 'Empresa', 'Email', 'Telefone', 'Serviço', 'Estado', 'Mensagem']
    const rows = quotes.map((q) => [
      new Date(q.createdAt).toLocaleDateString('pt-PT'),
      q.name,
      q.company,
      q.email,
      q.phone,
      q.service,
      q.status || 'Novo',
      q.message.replace(/[\r\n]+/g, ' '),
    ])
    const csv = [header, ...rows]
      .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `blvrs-orcamentos-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    notify('Lista de orçamentos exportada em CSV.')
  }

  const navItems: Array<{ id: AdminTab; label: string; icon: React.ReactNode; badge?: number }> = [
    { id: 'overview', label: 'Visão Geral', icon: <LayoutDashboard className="h-4 w-4" /> },
    {
      id: 'projects',
      label: 'Portefólio',
      icon: <FolderKanban className="h-4 w-4" />,
      badge: projects.length,
    },
    { id: 'sections', label: 'Hero & Serviços', icon: <Sparkles className="h-4 w-4" /> },
    {
      id: 'clients',
      label: 'Clientes & Criativos',
      icon: <Users className="h-4 w-4" />,
      badge: clients.length,
    },
    {
      id: 'quotes',
      label: 'Orçamentos (CRM)',
      icon: <Inbox className="h-4 w-4" />,
      badge: quotes.length,
    },
    { id: 'settings', label: 'Configurações', icon: <Settings className="h-4 w-4" /> },
  ]

  const tabTitles: Record<AdminTab, { title: string; subtitle: string }> = {
    overview: {
      title: 'Visão Geral da Plataforma',
      subtitle: 'Resumo operacional de conteúdos, leads e integrações activas.',
    },
    projects: {
      title: 'Gestão de Portefólio',
      subtitle: 'Adicione, edite ou reorganize projectos, vídeos e galerias.',
    },
    sections: {
      title: 'Hero, Serviços & Sobre Nós',
      subtitle: 'Actualize fotografias, títulos e descrições das secções principais.',
    },
    clients: {
      title: 'Clientes & Criativos 4:5',
      subtitle: 'Faça a gestão dos logótipos de parceiros e peças criativas.',
    },
    quotes: {
      title: 'Pedidos de Orçamento (CRM)',
      subtitle: 'Acompanhe clientes potenciais e responda directamente via WhatsApp ou E-mail.',
    },
    settings: {
      title: 'Contactos, Redes Sociais & Backup',
      subtitle: 'Configure ligações oficiais da agência e exporte cópias de segurança.',
    },
  }

  return (
    <div className="fixed inset-0 z-50 flex bg-[#0B0B0B] text-white">
      {/* Left Executive Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-white/10 bg-[#111111] transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center rounded-lg bg-white px-2 py-0.5">
              <img src="/blvrs-logo.png" alt="BLVRS MEDIA" className="h-8 w-auto object-contain" />
            </span>
            <div>
              <p className="font-display text-[11px] font-extrabold tracking-[0.18em] uppercase text-[#F36B21]">
                STUDIO
              </p>
              <p className="text-[10px] text-[#A6A6A6]">Administração</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-[#A6A6A6] hover:text-white cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
          {navItems.map((item) => {
            const active = tab === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setTab(item.id)
                  setSidebarOpen(false)
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#F36B21] text-white shadow-md'
                    : 'text-[#A6A6A6] hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </span>
                {item.badge !== undefined && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      active ? 'bg-black/25 text-white' : 'bg-white/10 text-[#E5E5E5]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Signed-in Admin Profile Footer */}
        <div className="border-t border-white/10 p-4 space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-bold truncate">{adminEmail}</p>
              <p className="text-[10px] text-[#A6A6A6]">Administrador</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 bg-[#171717] py-2 text-xs font-semibold text-[#E5E5E5] hover:border-red-500/50 hover:text-red-300 transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Terminar Sessão</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between gap-4 border-b border-white/10 bg-[#0B0B0B] px-4 sm:px-8 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden rounded-md border border-white/15 p-2 text-white cursor-pointer"
              aria-label="Abrir menu lateral"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <h1 className="font-display text-base sm:text-lg font-extrabold truncate">
                {tabTitles[tab].title}
              </h1>
              <p className="hidden sm:block text-xs text-[#A6A6A6] truncate">
                {tabTitles[tab].subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={openNewProjectForm}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-md bg-[#F36B21] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#dc5b14] transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Novo Projecto</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-[#171717] px-3.5 py-2 text-xs font-semibold text-white hover:bg-white hover:text-[#0B0B0B] transition-colors cursor-pointer"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Ver Site</span>
            </button>
          </div>
        </header>

        {/* Main Scrollable Workspace */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
          {toast && (
            <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-300">
              <span className="flex items-center gap-2 font-medium">
                <Check className="h-4 w-4" />
                {toast}
              </span>
              <button
                type="button"
                onClick={() => setToast(null)}
                className="text-white/60 hover:text-white cursor-pointer"
              >
                ×
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-300">
              {errorMsg}
            </div>
          )}

          {/* TAB 1: VISÃO GERAL */}
          {tab === 'overview' && (
            <div className="space-y-8">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                  {
                    label: 'Projectos no Portefólio',
                    value: projects.length,
                    sub: `${projects.filter((p) => p.featured).length} em destaque`,
                    action: () => setTab('projects'),
                  },
                  {
                    label: 'Clientes & Parceiros',
                    value: clients.length,
                    sub: `${clientCreatives.length} criativos publicados`,
                    action: () => setTab('clients'),
                  },
                  {
                    label: 'Serviços & Slides Hero',
                    value: `${services.length} + ${heroSlides.length}`,
                    sub: 'Totalmente editáveis',
                    action: () => setTab('sections'),
                  },
                  {
                    label: 'Pedidos de Orçamento',
                    value: quotes.length,
                    sub: `${quotes.filter((q) => !q.status || q.status === 'Novo').length} novos leads`,
                    action: () => setTab('quotes'),
                  },
                ].map((kpi) => (
                  <button
                    key={kpi.label}
                    type="button"
                    onClick={kpi.action}
                    className="text-left rounded-xl border border-white/10 bg-[#171717] p-5 transition hover:border-[#F36B21]/60 cursor-pointer"
                  >
                    <p className="text-xs font-medium text-[#A6A6A6]">{kpi.label}</p>
                    <p className="mt-2 font-display text-3xl font-extrabold text-white">
                      {kpi.value}
                    </p>
                    <p className="mt-1 text-[11px] text-[#F36B21] font-semibold">{kpi.sub}</p>
                  </button>
                ))}
              </div>

              {/* Infrastructure & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 rounded-xl border border-white/10 bg-[#171717] p-6 space-y-4">
                  <h2 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                    Acções Rápidas
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={openNewProjectForm}
                      className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#0B0B0B] p-4 text-left hover:border-[#F36B21] transition-colors cursor-pointer"
                    >
                      <Plus className="h-5 w-5 text-[#F36B21]" />
                      <div>
                        <p className="text-xs font-bold">Publicar Novo Projecto</p>
                        <p className="text-[11px] text-[#A6A6A6]">
                          Audiovisual, foto ou campanha
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTab('sections')}
                      className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#0B0B0B] p-4 text-left hover:border-[#F36B21] transition-colors cursor-pointer"
                    >
                      <Sparkles className="h-5 w-5 text-[#F36B21]" />
                      <div>
                        <p className="text-xs font-bold">Editar Hero & Serviços</p>
                        <p className="text-[11px] text-[#A6A6A6]">
                          Trocar fotografias e textos
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTab('clients')}
                      className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#0B0B0B] p-4 text-left hover:border-[#F36B21] transition-colors cursor-pointer"
                    >
                      <Users className="h-5 w-5 text-[#F36B21]" />
                      <div>
                        <p className="text-xs font-bold">Adicionar Cliente / Criativo</p>
                        <p className="text-[11px] text-[#A6A6A6]">
                          Logótipos e artes 4:5
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={handleExportJson}
                      className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#0B0B0B] p-4 text-left hover:border-[#F36B21] transition-colors cursor-pointer"
                    >
                      <Download className="h-5 w-5 text-[#F36B21]" />
                      <div>
                        <p className="text-xs font-bold">Exportar Cópia de Segurança</p>
                        <p className="text-[11px] text-[#A6A6A6]">
                          Descarregar ficheiro JSON completo
                        </p>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 rounded-xl border border-white/10 bg-[#171717] p-6 space-y-4">
                  <h2 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                    Estado das Integrações
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg border border-white/10 bg-[#0B0B0B] p-3.5">
                      <div className="flex items-center gap-3">
                        <Cloud className="h-5 w-5 text-[#F36B21]" />
                        <div>
                          <p className="text-xs font-bold">Cloudinary Media CDN</p>
                          <p className="text-[11px] text-[#A6A6A6]">
                            Cloud: {CLOUDINARY_CLOUD_NAME}
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                        Configurado
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-white/10 bg-[#0B0B0B] p-3.5">
                      <div className="flex items-center gap-3">
                        <Database className="h-5 w-5 text-[#F36B21]" />
                        <div>
                          <p className="text-xs font-bold">MongoDB Atlas</p>
                          <p className="text-[11px] text-[#A6A6A6]">Base de dados: blvrsdb</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                        API Pronta
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PORTEFÓLIO */}
          {tab === 'projects' && (
            <div className="space-y-6">
              {/* Search & Filter Toolbar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex flex-1 items-center gap-2 rounded-lg border border-white/15 bg-[#171717] px-3 py-2">
                  <Search className="h-4 w-4 text-[#A6A6A6]" />
                  <input
                    type="text"
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    placeholder="Pesquisar por nome, cliente ou descrição..."
                    className="w-full bg-transparent text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={projectFilter}
                    onChange={(e) => setProjectFilter(e.target.value)}
                    className="rounded-lg border border-white/15 bg-[#171717] px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Todos">Todas categorias</option>
                    <option value="Audiovisual">Audiovisual</option>
                    <option value="Fotografia">Fotografia</option>
                    <option value="Branding">Branding</option>
                    <option value="Conteúdos Digitais">Conteúdos Digitais</option>
                    <option value="Bastidores">Bastidores</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => {
                      if (showProjectForm) {
                        resetProjectForm()
                      } else {
                        openNewProjectForm()
                      }
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#F36B21] px-4 py-2 text-xs font-bold text-white hover:bg-[#dc5b14] cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>{showProjectForm ? 'Fechar Formulário' : 'Adicionar'}</span>
                  </button>
                </div>
              </div>

              {/* Project Create / Edit Form */}
              {showProjectForm && (
                <form
                  onSubmit={handleProjectSubmit}
                  className="rounded-xl border border-[#F36B21]/40 bg-[#171717] p-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-base font-bold">
                      {editingId ? 'Editar Projecto' : 'Novo Projecto no Portefólio'}
                    </h2>
                    <button
                      type="button"
                      onClick={resetProjectForm}
                      className="text-xs text-[#A6A6A6] hover:text-white underline cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Título do projecto *"
                      className="sm:col-span-2 rounded-md border border-white/10 bg-[#0B0B0B] px-3 py-2 text-xs text-white focus:border-[#F36B21] focus:outline-none"
                    />
                    <input
                      type="text"
                      required
                      value={client}
                      onChange={(e) => setClient(e.target.value)}
                      placeholder="Cliente / Marca *"
                      className="rounded-md border border-white/10 bg-[#0B0B0B] px-3 py-2 text-xs text-white focus:border-[#F36B21] focus:outline-none"
                    />
                    <input
                      type="text"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="Ano"
                      className="rounded-md border border-white/10 bg-[#0B0B0B] px-3 py-2 text-xs text-white focus:border-[#F36B21] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <select
                      value={category}
                      onChange={(e) =>
                        setCategory(e.target.value as Exclude<PortfolioCategory, 'Todos'>)
                      }
                      className="rounded-md border border-white/10 bg-[#0B0B0B] px-3 py-2 text-xs text-white focus:border-[#F36B21] focus:outline-none"
                    >
                      <option value="Audiovisual">Audiovisual</option>
                      <option value="Fotografia">Fotografia</option>
                      <option value="Branding">Branding</option>
                      <option value="Conteúdos Digitais">Conteúdos Digitais</option>
                      <option value="Bastidores">Bastidores</option>
                    </select>
                    <select
                      value={mediaType}
                      onChange={(e) => setMediaType(e.target.value as ProjectItem['mediaType'])}
                      className="rounded-md border border-white/10 bg-[#0B0B0B] px-3 py-2 text-xs text-white focus:border-[#F36B21] focus:outline-none"
                    >
                      <option value="video">Vídeo</option>
                      <option value="photo">Fotografia</option>
                      <option value="campaign">Campanha</option>
                    </select>
                    <label className="flex items-center gap-2 rounded-md border border-white/10 bg-[#0B0B0B] px-3 py-2 text-xs text-white cursor-pointer">
                      <input
                        type="checkbox"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                        className="accent-[#F36B21]"
                      />
                      <span>Mostrar em destaque</span>
                    </label>
                  </div>

                  {/* Cover & Gallery */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2 rounded-lg border border-white/10 bg-[#0B0B0B] p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">Imagem de Capa</span>
                        <label className="inline-flex items-center gap-1.5 rounded bg-[#F36B21] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#dc5b14] cursor-pointer">
                          <UploadCloud className="h-3.5 w-3.5" />
                          <span>
                            {uploadingKey === 'proj-cover' ? 'A carregar...' : 'Upload'}
                          </span>
                          <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={(e) => {
                              const f = e.target.files?.[0]
                              if (!f) return
                              handleUpload(f, 'proj-cover', 'blvrs-media/portfolio', (url, t) => {
                                if (t === 'video') {
                                  setMediaType('video')
                                  setVideoUrl(url)
                                } else {
                                  setImage(url)
                                }
                              })
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <div className="flex items-center gap-3">
                        <img
                          src={image || '/images/hero-cinema.jpg'}
                          alt="Capa"
                          className="h-16 w-24 rounded object-cover border border-white/10 shrink-0"
                        />
                        <div className="flex-1 space-y-1.5">
                          <select
                            value={IMAGE_PRESETS.some((p) => p.url === image) ? image : ''}
                            onChange={(e) => {
                              if (e.target.value) setImage(e.target.value)
                            }}
                            className="w-full rounded border border-white/10 bg-[#171717] px-2.5 py-1.5 text-[11px] text-white"
                          >
                            <option value="">Escolher modelo...</option>
                            {IMAGE_PRESETS.map((p) => (
                              <option key={p.url} value={p.url}>
                                {p.label}
                              </option>
                            ))}
                          </select>
                          <input
                            type="text"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            placeholder="URL da imagem..."
                            className="w-full rounded border border-white/10 bg-[#171717] px-2.5 py-1.5 text-[11px] text-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 rounded-lg border border-white/10 bg-[#0B0B0B] p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">
                          Galeria do Projecto ({gallery.length})
                        </span>
                        <label className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#F36B21] hover:underline cursor-pointer">
                          <Plus className="h-3.5 w-3.5" />
                          <span>
                            {uploadingKey === 'proj-gallery'
                              ? 'A enviar...'
                              : 'Adicionar foto'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const f = e.target.files?.[0]
                              if (!f) return
                              handleUpload(f, 'proj-gallery', 'blvrs-media/gallery', (url) =>
                                setGallery((prev) => [...prev, url])
                              )
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <div className="flex flex-wrap gap-2 min-h-[48px] items-center">
                        {gallery.length === 0 ? (
                          <p className="text-[11px] text-[#666]">
                            Nenhuma foto extra na galeria.
                          </p>
                        ) : (
                          gallery.map((g, i) => (
                            <div key={`${g}-${i}`} className="relative">
                              <img
                                src={g}
                                alt=""
                                className="h-12 w-12 rounded object-cover border border-white/15"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setGallery((prev) => prev.filter((_, idx) => idx !== i))
                                }
                                className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-red-600 text-[10px] text-white flex items-center justify-center cursor-pointer"
                              >
                                ×
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <textarea
                      required
                      rows={2}
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      placeholder="Descrição do projecto *"
                      className="rounded-md border border-white/10 bg-[#0B0B0B] px-3 py-2 text-xs text-white focus:border-[#F36B21] focus:outline-none"
                    />
                    <textarea
                      rows={2}
                      value={strategy}
                      onChange={(e) => setStrategy(e.target.value)}
                      placeholder="Estratégia & Execução"
                      className="rounded-md border border-white/10 bg-[#0B0B0B] px-3 py-2 text-xs text-white focus:border-[#F36B21] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={deliverablesRaw}
                      onChange={(e) => setDeliverablesRaw(e.target.value)}
                      placeholder="Entregáveis separados por vírgula"
                      className="rounded-md border border-white/10 bg-[#0B0B0B] px-3 py-2 text-xs text-white focus:border-[#F36B21] focus:outline-none"
                    />
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="URL embed de vídeo (opcional)"
                      className="rounded-md border border-white/10 bg-[#0B0B0B] px-3 py-2 text-xs text-white focus:border-[#F36B21] focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={resetProjectForm}
                      className="rounded-md border border-white/15 px-4 py-2 text-xs font-semibold text-white cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="rounded-md bg-[#F36B21] px-6 py-2 font-display text-xs font-bold text-white hover:bg-[#dc5b14] cursor-pointer"
                    >
                      {editingId ? 'Guardar Alterações' : 'Publicar Projecto'}
                    </button>
                  </div>
                </form>
              )}

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredProjects.map((proj) => (
                  <div
                    key={proj.id}
                    className="flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#171717]"
                  >
                    <div className="relative h-44 w-full bg-black">
                      <img
                        src={proj.image}
                        alt={proj.title}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute top-3 left-3 rounded-full bg-black/75 px-2.5 py-0.5 text-[10px] font-semibold text-white">
                        {proj.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(proj)}
                        title="Alternar destaque"
                        className={`absolute top-3 right-3 rounded-full p-1.5 backdrop-blur-sm cursor-pointer ${
                          proj.featured
                            ? 'bg-[#F36B21] text-white'
                            : 'bg-black/60 text-[#A6A6A6]'
                        }`}
                      >
                        <Star className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#F36B21]">
                          {proj.client} • {proj.year}
                        </p>
                        <h3 className="mt-1 font-display text-sm font-bold text-white line-clamp-1">
                          {proj.title}
                        </h3>
                        <p className="mt-1 text-xs text-[#A6A6A6] line-clamp-2">{proj.summary}</p>
                      </div>
                      <div className="flex items-center justify-between border-t border-white/10 pt-3">
                        <span className="text-[11px] text-[#777]">
                          {proj.gallery ? `${proj.gallery.length} fotos na galeria` : 'Capa única'}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => startEditingProject(proj)}
                            className="inline-flex items-center gap-1 rounded bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#F36B21] transition-colors cursor-pointer"
                          >
                            <Pencil className="h-3 w-3" />
                            <span>Editar</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onDeleteProject(proj.id)
                              notify('Projecto removido.')
                            }}
                            className="rounded bg-white/5 p-1.5 text-[#A6A6A6] hover:bg-red-500/20 hover:text-red-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: HERO, SERVIÇOS & SOBRE NÓS */}
          {tab === 'sections' && (
            <div className="space-y-8">
              <section className="space-y-4">
                <h2 className="font-display text-xs font-bold uppercase tracking-widest text-[#F36B21]">
                  Carrossel Principal (Hero)
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {heroSlides.map((slide, idx) => (
                    <div
                      key={slide.id}
                      className="rounded-xl border border-white/10 bg-[#171717] p-4 space-y-3"
                    >
                      <div className="relative h-36 overflow-hidden rounded-lg bg-black">
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="h-full w-full object-cover"
                        />
                        <span className="absolute top-2 left-2 rounded bg-black/75 px-2 py-0.5 text-[10px] font-bold">
                          Slide 0{idx + 1}
                        </span>
                        <label className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded bg-[#F36B21] px-2.5 py-1 text-[11px] font-semibold text-white cursor-pointer">
                          <UploadCloud className="h-3 w-3" />
                          <span>{uploadingKey === slide.id ? 'A enviar...' : 'Trocar'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const f = e.target.files?.[0]
                              if (!f) return
                              handleUpload(f, slide.id, 'blvrs-media/hero', (url) =>
                                handleHeroFieldUpdate(slide.id, { image: url })
                              )
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <input
                        type="text"
                        value={slide.title}
                        onChange={(e) =>
                          handleHeroFieldUpdate(slide.id, { title: e.target.value })
                        }
                        placeholder="Título"
                        className="w-full rounded border border-white/10 bg-[#0B0B0B] px-2.5 py-1.5 text-xs font-semibold text-white"
                      />
                      <input
                        type="text"
                        value={slide.subtitle}
                        onChange={(e) =>
                          handleHeroFieldUpdate(slide.id, { subtitle: e.target.value })
                        }
                        placeholder="Subtítulo"
                        className="w-full rounded border border-white/10 bg-[#0B0B0B] px-2.5 py-1.5 text-[11px] text-[#E5E5E5]"
                      />
                      <input
                        type="text"
                        value={slide.image}
                        onChange={(e) =>
                          handleHeroFieldUpdate(slide.id, { image: e.target.value })
                        }
                        placeholder="URL da imagem"
                        className="w-full rounded border border-white/10 bg-[#0B0B0B] px-2.5 py-1.5 text-[11px] text-[#A6A6A6]"
                      />
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-xs font-bold uppercase tracking-widest text-[#F36B21]">
                  Cartões de Serviços (5 Áreas)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {services.map((srv) => (
                    <div
                      key={srv.id}
                      className="rounded-xl border border-white/10 bg-[#171717] p-4 space-y-3"
                    >
                      <div className="relative h-36 overflow-hidden rounded-lg bg-black">
                        <img
                          src={srv.image}
                          alt={srv.title}
                          className="h-full w-full object-cover"
                        />
                        <span className="absolute top-2 left-2 rounded bg-black/75 px-2 py-0.5 text-[10px] font-bold text-[#F36B21]">
                          {srv.number}
                        </span>
                        <label className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded bg-white px-2.5 py-1 text-[11px] font-bold text-[#0B0B0B] hover:bg-[#F36B21] hover:text-white cursor-pointer">
                          <UploadCloud className="h-3 w-3" />
                          <span>{uploadingKey === srv.id ? 'A enviar...' : 'Trocar'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const f = e.target.files?.[0]
                              if (!f) return
                              handleUpload(f, srv.id, 'blvrs-media/services', (url) =>
                                handleServiceFieldUpdate(srv.id, { image: url })
                              )
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <p className="font-display text-sm font-bold">{srv.title}</p>
                      <input
                        type="text"
                        value={srv.tagline}
                        onChange={(e) =>
                          handleServiceFieldUpdate(srv.id, { tagline: e.target.value })
                        }
                        className="w-full rounded border border-white/10 bg-[#0B0B0B] px-2.5 py-1.5 text-[11px] text-white"
                      />
                      <input
                        type="text"
                        value={srv.image}
                        onChange={(e) =>
                          handleServiceFieldUpdate(srv.id, { image: e.target.value })
                        }
                        className="w-full rounded border border-white/10 bg-[#0B0B0B] px-2.5 py-1.5 text-[11px] text-[#A6A6A6]"
                      />
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-xl border border-white/10 bg-[#171717] p-5 flex flex-col lg:flex-row items-start lg:items-center gap-5">
                <img
                  src={config.aboutImage || '/images/hero-branding.jpg'}
                  alt="Sobre Nós"
                  className="h-32 w-52 rounded-lg object-cover border border-white/10 shrink-0"
                />
                <div className="flex-1 w-full space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="font-display text-sm font-bold">
                        Media Institucional - "Sobre Nós"
                      </h3>
                      <p className="text-[11px] text-[#A6A6A6]">
                        Defina a fotografia de capa e, opcionalmente, um link de vídeo (YouTube,
                        Vimeo ou MP4).
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 rounded bg-[#F36B21] px-3 py-1.5 text-[11px] font-semibold text-white cursor-pointer">
                        <UploadCloud className="h-3.5 w-3.5" />
                        <span>{uploadingKey === 'about' ? 'A enviar...' : 'Trocar imagem'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const f = e.target.files?.[0]
                            if (!f) return
                            handleUpload(f, 'about', 'blvrs-media/about', (url) =>
                              onUpdateConfig({ ...config, aboutImage: url })
                            )
                          }}
                          className="hidden"
                        />
                      </label>
                      <label className="inline-flex items-center gap-1.5 rounded border border-white/15 bg-[#0B0B0B] px-3 py-1.5 text-[11px] font-semibold text-white hover:border-[#F36B21] cursor-pointer">
                        <UploadCloud className="h-3.5 w-3.5 text-[#F36B21]" />
                        <span>
                          {uploadingKey === 'about-video' ? 'A enviar...' : 'Carregar vídeo'}
                        </span>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => {
                            const f = e.target.files?.[0]
                            if (!f) return
                            handleUpload(f, 'about-video', 'blvrs-media/about-video', (url) =>
                              onUpdateConfig({ ...config, aboutVideoUrl: url })
                            )
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-[#A6A6A6] mb-1">
                        URL da Imagem / Poster
                      </label>
                      <input
                        type="text"
                        value={config.aboutImage || '/images/hero-branding.jpg'}
                        onChange={(e) =>
                          onUpdateConfig({ ...config, aboutImage: e.target.value })
                        }
                        className="w-full rounded border border-white/10 bg-[#0B0B0B] px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] text-[#A6A6A6]">
                          Link do Vídeo (YouTube, Vimeo ou MP4 - opcional)
                        </label>
                        {config.aboutVideoUrl && (
                          <button
                            type="button"
                            onClick={() => onUpdateConfig({ ...config, aboutVideoUrl: '' })}
                            className="text-[10px] text-red-400 hover:underline cursor-pointer"
                          >
                            Remover vídeo
                          </button>
                        )}
                      </div>
                      <input
                        type="url"
                        value={config.aboutVideoUrl || ''}
                        onChange={(e) =>
                          onUpdateConfig({ ...config, aboutVideoUrl: e.target.value })
                        }
                        placeholder="https://www.youtube.com/watch?v=... ou .mp4"
                        className="w-full rounded border border-white/10 bg-[#0B0B0B] px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* TAB 4: CLIENTES & CRIATIVOS */}
          {tab === 'clients' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Add Client Logo */}
                <form
                  onSubmit={handleAddClientLogo}
                  className="rounded-xl border border-white/10 bg-[#171717] p-5 space-y-3"
                >
                  <h2 className="font-display text-sm font-bold flex items-center gap-2">
                    <Plus className="h-4 w-4 text-[#F36B21]" />
                    <span>Novo Logótipo de Cliente</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      placeholder="Nome da marca *"
                      className="rounded border border-white/10 bg-[#0B0B0B] px-3 py-2 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={newClientSector}
                      onChange={(e) => setNewClientSector(e.target.value)}
                      placeholder="Sector"
                      className="rounded border border-white/10 bg-[#0B0B0B] px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <select
                      value={newClientFit}
                      onChange={(e) => setNewClientFit(e.target.value as ClientLogoItem['fit'])}
                      className="rounded border border-white/10 bg-[#0B0B0B] px-3 py-2 text-xs text-white"
                    >
                      <option value="contain-white">Fundo Branco</option>
                      <option value="contain-black">Fundo Preto</option>
                      <option value="cover">Cartão Cheio</option>
                    </select>
                    <label className="inline-flex items-center gap-1.5 rounded bg-[#F36B21] px-3 py-2 text-xs font-semibold text-white cursor-pointer">
                      <UploadCloud className="h-3.5 w-3.5" />
                      <span>
                        {uploadingKey === 'new-logo' ? 'A enviar...' : 'Carregar ficheiro'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0]
                          if (!f) return
                          handleUpload(f, 'new-logo', 'blvrs-media/logos', (url) =>
                            setNewClientLogo(url)
                          )
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    required
                    value={newClientLogo}
                    onChange={(e) => setNewClientLogo(e.target.value)}
                    placeholder="URL do logótipo *"
                    className="w-full rounded border border-white/10 bg-[#0B0B0B] px-3 py-2 text-xs text-white"
                  />
                  <button
                    type="submit"
                    className="w-full rounded bg-white py-2 font-display text-xs font-bold text-[#0B0B0B] hover:bg-[#F36B21] hover:text-white cursor-pointer transition-colors"
                  >
                    Adicionar Cliente
                  </button>
                </form>

                {/* Add Creative 4:5 */}
                <form
                  onSubmit={handleAddCreative}
                  className="rounded-xl border border-white/10 bg-[#171717] p-5 space-y-3"
                >
                  <h2 className="font-display text-sm font-bold flex items-center gap-2">
                    <Plus className="h-4 w-4 text-[#F36B21]" />
                    <span>Novo Criativo para Cliente (4:5)</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      value={newCreativeClient}
                      onChange={(e) => setNewCreativeClient(e.target.value)}
                      placeholder="Cliente *"
                      className="rounded border border-white/10 bg-[#0B0B0B] px-3 py-2 text-xs text-white"
                    />
                    <input
                      type="text"
                      required
                      value={newCreativeTitle}
                      onChange={(e) => setNewCreativeTitle(e.target.value)}
                      placeholder="Título da peça *"
                      className="rounded border border-white/10 bg-[#0B0B0B] px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      required
                      value={newCreativeImage}
                      onChange={(e) => setNewCreativeImage(e.target.value)}
                      placeholder="URL da imagem *"
                      className="flex-1 rounded border border-white/10 bg-[#0B0B0B] px-3 py-2 text-xs text-white"
                    />
                    <label className="inline-flex items-center gap-1.5 rounded bg-[#F36B21] px-3 py-2 text-xs font-semibold text-white cursor-pointer">
                      <UploadCloud className="h-3.5 w-3.5" />
                      <span>
                        {uploadingKey === 'new-cre' ? 'A enviar...' : 'Upload'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0]
                          if (!f) return
                          handleUpload(f, 'new-cre', 'blvrs-media/creatives', (url) =>
                            setNewCreativeImage(url)
                          )
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded bg-[#F36B21] py-2 font-display text-xs font-bold text-white hover:bg-[#dc5b14] cursor-pointer"
                  >
                    Publicar Criativo
                  </button>
                </form>
              </div>

              {/* Client Logos Grid */}
              <div className="space-y-3">
                <h3 className="font-display text-xs font-bold uppercase tracking-widest text-[#A6A6A6]">
                  Logótipos Activos ({clients.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {clients.map((cli) => (
                    <div
                      key={cli.id}
                      className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-[#171717] p-2.5"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={cli.image}
                          alt={cli.name}
                          className="h-9 w-9 rounded bg-white object-contain p-1 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold truncate">{cli.name}</p>
                          <p className="text-[10px] text-[#A6A6A6] truncate">{cli.sector}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateClients(clients.filter((c) => c.id !== cli.id))
                          notify('Cliente removido.')
                        }}
                        className="p-1 text-[#A6A6A6] hover:text-red-400 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Client Creatives Grid */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-display text-xs font-bold uppercase tracking-widest text-[#A6A6A6]">
                    Criativos Publicados ({filteredCreatives.length})
                  </h3>
                  <select
                    value={creativeFilter}
                    onChange={(e) => setCreativeFilter(e.target.value)}
                    className="rounded border border-white/15 bg-[#171717] px-3 py-1.5 text-xs text-white"
                  >
                    <option value="Todos">Todos os clientes</option>
                    {Array.from(new Set(clientCreatives.map((c) => c.clientKey))).map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {filteredCreatives.map((cre) => (
                    <div
                      key={cre.id}
                      className="group relative overflow-hidden rounded-lg border border-white/10 bg-[#171717]"
                    >
                      <div className="aspect-[4/5] bg-black">
                        <img
                          src={cre.image}
                          alt={cre.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-2">
                        <p className="text-[10px] font-bold text-[#F36B21] truncate">
                          {cre.clientName}
                        </p>
                        <p className="text-[10px] text-[#E5E5E5] truncate">{cre.title}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateClientCreatives(
                            clientCreatives.filter((item) => item.id !== cre.id)
                          )
                          notify('Criativo removido.')
                        }}
                        className="absolute top-1.5 right-1.5 rounded-full bg-black/80 p-1.5 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ORÇAMENTOS (CRM) */}
          {tab === 'quotes' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-[#A6A6A6]">
                  Todos os pedidos submetidos pelos formulários do website.
                </p>
                {quotes.length > 0 && (
                  <button
                    type="button"
                    onClick={handleExportQuotesCsv}
                    className="inline-flex items-center gap-1.5 rounded bg-white px-3.5 py-2 text-xs font-bold text-[#0B0B0B] hover:bg-[#F36B21] hover:text-white cursor-pointer transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Exportar CSV</span>
                  </button>
                )}
              </div>

              {quotes.length === 0 ? (
                <div className="rounded-xl border border-white/10 bg-[#171717] p-12 text-center space-y-2">
                  <Inbox className="h-8 w-8 mx-auto text-[#F36B21]" />
                  <p className="text-sm font-bold">Ainda sem pedidos de orçamento</p>
                  <p className="text-xs text-[#A6A6A6]">
                    Os pedidos enviados pelos clientes aparecerão aqui para seguimento comercial.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {quotes.map((q) => {
                    const waLink = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(
                      `Olá ${q.name}, recebemos o seu pedido de orçamento na BLVRS MEDIA sobre ${q.service}!`
                    )}`
                    return (
                      <div
                        key={q.id}
                        className="rounded-xl border border-white/10 bg-[#171717] p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                      >
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-[#F36B21]/20 px-2.5 py-0.5 text-[10px] font-bold text-[#F36B21]">
                              {q.service}
                            </span>
                            <span className="text-[11px] text-[#A6A6A6]">
                              {new Date(q.createdAt).toLocaleString('pt-PT')}
                            </span>
                          </div>
                          <p className="font-display text-base font-bold">
                            {q.name}{' '}
                            <span className="font-normal text-sm text-[#A6A6A6]">
                              • {q.company}
                            </span>
                          </p>
                          <p className="text-xs text-[#A6A6A6]">
                            {q.email} • {q.phone} • Prazo: {q.timeline} • Orçamento: {q.budgetRange}
                          </p>
                          <p className="text-xs text-[#E5E5E5] pt-1">{q.message}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          <select
                            value={q.status || 'Novo'}
                            onChange={(e) =>
                              handleQuoteStatusChange(
                                q.id,
                                e.target.value as QuoteSubmission['status']
                              )
                            }
                            className="rounded border border-white/15 bg-[#0B0B0B] px-2.5 py-1.5 text-xs text-white"
                          >
                            <option value="Novo">Novo</option>
                            <option value="Em análise">Em análise</option>
                            <option value="Respondido">Respondido</option>
                          </select>
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded bg-[#F36B21] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#dc5b14]"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                            <span>WhatsApp</span>
                          </a>
                          <a
                            href={`mailto:${q.email}?subject=${encodeURIComponent(
                              `BLVRS MEDIA - Proposta: ${q.service}`
                            )}`}
                            className="inline-flex items-center gap-1.5 rounded border border-white/15 bg-[#0B0B0B] px-3 py-1.5 text-xs font-semibold text-white hover:border-white"
                          >
                            <Mail className="h-3.5 w-3.5" />
                            <span>E-mail</span>
                          </a>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: CONFIGURAÇÕES & REDES */}
          {tab === 'settings' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 rounded-xl border border-white/10 bg-[#171717] p-6 space-y-4">
                <h2 className="font-display text-sm font-bold uppercase tracking-wider text-[#F36B21]">
                  Contactos & Identidade
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-[#A6A6A6] mb-1">Telefone</label>
                    <input
                      type="text"
                      value={config.phone}
                      onChange={(e) => onUpdateConfig({ ...config, phone: e.target.value })}
                      className="w-full rounded border border-white/10 bg-[#0B0B0B] px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#A6A6A6] mb-1">
                      WhatsApp (Display)
                    </label>
                    <input
                      type="text"
                      value={config.whatsappDisplay}
                      onChange={(e) =>
                        onUpdateConfig({ ...config, whatsappDisplay: e.target.value })
                      }
                      className="w-full rounded border border-white/10 bg-[#0B0B0B] px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-[#A6A6A6] mb-1">E-mail</label>
                    <input
                      type="email"
                      value={config.email}
                      onChange={(e) => onUpdateConfig({ ...config, email: e.target.value })}
                      className="w-full rounded border border-white/10 bg-[#0B0B0B] px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#A6A6A6] mb-1">Localização</label>
                    <input
                      type="text"
                      value={config.location}
                      onChange={(e) => onUpdateConfig({ ...config, location: e.target.value })}
                      className="w-full rounded border border-white/10 bg-[#0B0B0B] px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] text-[#A6A6A6] mb-1">
                    Assinatura Institucional
                  </label>
                  <input
                    type="text"
                    value={config.signature}
                    onChange={(e) => onUpdateConfig({ ...config, signature: e.target.value })}
                    className="w-full rounded border border-white/10 bg-[#0B0B0B] px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="lg:col-span-6 rounded-xl border border-white/10 bg-[#171717] p-6 space-y-4">
                <h2 className="font-display text-sm font-bold uppercase tracking-wider text-[#F36B21]">
                  Redes Sociais Oficiais
                </h2>
                <div className="space-y-3">
                  {config.socials.map((soc, idx) => (
                    <div
                      key={soc.platform}
                      className="rounded-lg border border-white/10 bg-[#0B0B0B] p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">{soc.platform}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const next = config.socials.map((s, i) =>
                              i === idx ? { ...s, active: !s.active } : s
                            )
                            onUpdateConfig({ ...config, socials: next })
                          }}
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold cursor-pointer ${
                            soc.active
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-white/10 text-[#A6A6A6]'
                          }`}
                        >
                          {soc.active ? 'Visível no Site' : 'Oculto'}
                        </button>
                      </div>
                      <input
                        type="url"
                        value={soc.url}
                        onChange={(e) => {
                          const next = config.socials.map((s, i) =>
                            i === idx ? { ...s, url: e.target.value } : s
                          )
                          onUpdateConfig({ ...config, socials: next })
                        }}
                        className="w-full rounded border border-white/10 bg-[#171717] px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleExportJson}
                    className="inline-flex items-center gap-2 rounded bg-white px-4 py-2 text-xs font-bold text-[#0B0B0B] cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Exportar Tudo (JSON)</span>
                  </button>

                  {!confirmReset ? (
                    <button
                      type="button"
                      onClick={() => setConfirmReset(true)}
                      className="inline-flex items-center gap-2 rounded border border-white/15 px-4 py-2 text-xs font-semibold text-white hover:border-red-400 hover:text-red-300 cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Repor Originais</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onResetDefaults()
                          setConfirmReset(false)
                          notify('Conteúdos originais repostos.')
                        }}
                        className="rounded bg-red-600 px-3 py-1.5 text-xs font-bold text-white cursor-pointer"
                      >
                        Confirmar Reposição
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmReset(false)}
                        className="rounded border border-white/15 px-3 py-1.5 text-xs text-white cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
