import React, { useState } from 'react'
import {
  X,
  Plus,
  Trash2,
  RotateCcw,
  Download,
  Inbox,
  UploadCloud,
  Pencil,
  Check,
  Image as ImageIcon,
  LogOut,
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

interface CmsDrawerProps {
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

export const CmsDrawer: React.FC<CmsDrawerProps> = ({
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
  onUpdateConfig,
  onResetDefaults,
}) => {
  const [tab, setTab] = useState<'projects' | 'sections' | 'clients' | 'socials' | 'quotes'>(
    'projects'
  )

  // Project Add / Edit state
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
  const [uploadingKey, setUploadingKey] = useState<string | null>(null)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // New Client Logo & Creative state
  const [newClientName, setNewClientName] = useState('')
  const [newClientSector, setNewClientSector] = useState('')
  const [newClientLogo, setNewClientLogo] = useState('')
  const [newClientFit, setNewClientFit] = useState<ClientLogoItem['fit']>('contain-white')

  const [newCreativeClient, setNewCreativeClient] = useState('Chicken Village')
  const [newCreativeTitle, setNewCreativeTitle] = useState('')
  const [newCreativeImage, setNewCreativeImage] = useState('')

  if (!isOpen) return null

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
  }

  const handleUpload = async (
    file: File,
    key: string,
    folder: string,
    onSuccessUrl: (url: string, resourceType: 'image' | 'video' | 'raw') => void
  ) => {
    setUploadingKey(key)
    setUploadError(null)
    setUploadStatus(null)
    try {
      const result = await uploadMediaAsset(file, folder)
      const finalUrl =
        result.resourceType === 'image'
          ? optimizeMediaUrl(result.secureUrl, 1600)
          : result.secureUrl
      onSuccessUrl(finalUrl, result.resourceType)
      setUploadStatus(
        result.storageMode === 'cloudinary'
          ? `Carregado para Cloudinary (${CLOUDINARY_CLOUD_NAME}).`
          : 'Imagem optimizada localmente e pronta a guardar.'
      )
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Erro ao carregar ficheiro.')
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
      featured: true,
    }

    if (editingId) {
      onUpdateProject(payload)
      setUploadStatus('Projecto actualizado com sucesso.')
    } else {
      onAddProject(payload)
      setUploadStatus('Novo projecto adicionado ao portefólio.')
    }
    resetProjectForm()
  }

  const handleSlideImageUpdate = (slideId: string, newImg: string) => {
    onUpdateHeroSlides(
      heroSlides.map((s) => (s.id === slideId ? { ...s, image: newImg } : s))
    )
  }

  const handleServiceImageUpdate = (srvId: string, newImg: string) => {
    onUpdateServices(services.map((s) => (s.id === srvId ? { ...s, image: newImg } : s)))
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
  }

  const handleSocialChange = (index: number, newUrl: string) => {
    const nextSocials = config.socials.map((soc, idx) =>
      idx === index ? { ...soc, url: newUrl } : soc
    )
    onUpdateConfig({ ...config, socials: nextSocials })
  }

  const handleToggleSocial = (index: number) => {
    const nextSocials = config.socials.map((soc, idx) =>
      idx === index ? { ...soc, active: !soc.active } : soc
    )
    onUpdateConfig({ ...config, socials: nextSocials })
  }

  const handleExportJson = () => {
    const payload = JSON.stringify(
      { config, projects, heroSlides, services, clients, clientCreatives },
      null,
      2
    )
    const blob = new Blob([payload], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'blvrs-media-conteudo.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <aside
        className="h-full w-full max-w-2xl overflow-y-auto bg-[#0B0B0B] text-white border-l border-white/15 p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#F36B21]">
              Painel Administrativo • {adminEmail}
            </span>
            <h2 className="font-display text-xl font-extrabold truncate">
              Adicionar & Actualizar Imagens e Conteúdos
            </h2>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onLogout}
              title="Terminar sessão"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-[#171717] px-3 py-1.5 text-[11px] font-semibold text-[#E5E5E5] hover:border-[#F36B21] hover:text-[#F36B21] transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sair</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar painel"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#171717] text-white hover:bg-[#F36B21] transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Status notifications */}
        {uploadStatus && (
          <div className="mt-4 flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs text-emerald-300">
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              {uploadStatus}
            </span>
            <button
              type="button"
              onClick={() => setUploadStatus(null)}
              className="text-white/60 hover:text-white cursor-pointer"
            >
              ×
            </button>
          </div>
        )}
        {uploadError && (
          <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3.5 py-2 text-xs text-amber-300">
            {uploadError}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mt-5 flex flex-wrap gap-2 border-b border-white/10 pb-4">
          {[
            { id: 'projects', label: `Portefólio (${projects.length})` },
            { id: 'sections', label: 'Hero & Serviços' },
            { id: 'clients', label: `Clientes & Criativos (${clientCreatives.length})` },
            { id: 'socials', label: 'Redes & Exportar' },
            { id: 'quotes', label: `Orçamentos (${quotes.length})` },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id as typeof tab)}
              className={`rounded-md px-3 py-2 text-xs font-semibold cursor-pointer ${
                tab === item.id
                  ? 'bg-[#F36B21] text-white'
                  : 'bg-[#171717] text-[#A6A6A6] hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* TAB 1: Portefólio (Adicionar & Editar) */}
        {tab === 'projects' && (
          <div className="mt-6 space-y-8">
            <form
              onSubmit={handleProjectSubmit}
              className="rounded-xl border border-white/10 bg-[#171717] p-5 space-y-3.5"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-sm font-bold flex items-center gap-2">
                  {editingId ? (
                    <Pencil className="h-4 w-4 text-[#F36B21]" />
                  ) : (
                    <Plus className="h-4 w-4 text-[#F36B21]" />
                  )}
                  <span>
                    {editingId
                      ? 'Editar Projecto & Imagem'
                      : 'Adicionar Novo Projecto ao Portefólio'}
                  </span>
                </h3>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetProjectForm}
                    className="text-xs text-[#A6A6A6] hover:text-white underline cursor-pointer"
                  >
                    Cancelar edição
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nome do projecto *"
                  className="rounded-md border border-white/10 bg-[#0B0B0B] px-3 py-2 text-xs text-white focus:border-[#F36B21] focus:outline-none"
                />
                <input
                  type="text"
                  required
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="Cliente / Marca *"
                  className="rounded-md border border-white/10 bg-[#0B0B0B] px-3 py-2 text-xs text-white focus:border-[#F36B21] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as Exclude<PortfolioCategory, 'Todos'>)
                  }
                  className="rounded-md border border-white/10 bg-[#0B0B0B] px-2.5 py-2 text-xs text-white focus:border-[#F36B21] focus:outline-none"
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
                  className="rounded-md border border-white/10 bg-[#0B0B0B] px-2.5 py-2 text-xs text-white focus:border-[#F36B21] focus:outline-none"
                >
                  <option value="video">Vídeo</option>
                  <option value="photo">Fotografia</option>
                  <option value="campaign">Campanha</option>
                </select>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="Ano"
                  className="rounded-md border border-white/10 bg-[#0B0B0B] px-3 py-2 text-xs text-white focus:border-[#F36B21] focus:outline-none"
                />
              </div>

              {/* Cover image uploader + preview */}
              <div className="space-y-2 rounded-lg border border-white/10 bg-[#0B0B0B]/60 p-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-white">
                    Imagem de Capa
                  </label>
                  <label className="inline-flex items-center gap-1.5 rounded bg-[#F36B21] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#dc5b14] cursor-pointer">
                    <UploadCloud className="h-3.5 w-3.5" />
                    <span>
                      {uploadingKey === 'project-cover' ? 'A carregar...' : 'Carregar foto'}
                    </span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0]
                        if (!f) return
                        handleUpload(f, 'project-cover', 'blvrs-media/portfolio', (url, type) => {
                          if (type === 'video') {
                            setMediaType('video')
                            setVideoUrl(url)
                          } else {
                            setImage(url)
                          }
                        })
                      }}
                      disabled={uploadingKey !== null}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={image || '/images/hero-cinema.jpg'}
                    alt="Pré-visualização"
                    className="h-14 w-20 rounded object-cover border border-white/10 shrink-0"
                  />
                  <div className="flex-1 space-y-1.5">
                    <select
                      value={IMAGE_PRESETS.some((p) => p.url === image) ? image : ''}
                      onChange={(e) => {
                        if (e.target.value) setImage(e.target.value)
                      }}
                      className="w-full rounded-md border border-white/10 bg-[#0B0B0B] px-2.5 py-1.5 text-[11px] text-white focus:border-[#F36B21] focus:outline-none"
                    >
                      <option value="">Escolher imagem modelo...</option>
                      {IMAGE_PRESETS.map((preset) => (
                        <option key={preset.url} value={preset.url}>
                          {preset.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="Ou cole o URL de uma imagem..."
                      className="w-full rounded-md border border-white/10 bg-[#0B0B0B] px-2.5 py-1.5 text-[11px] text-white focus:border-[#F36B21] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Extra gallery photos */}
              <div className="space-y-2 rounded-lg border border-white/10 bg-[#0B0B0B]/60 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-white">
                    Galeria Adicional ({gallery.length} fotos)
                  </span>
                  <label className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#F36B21] hover:underline cursor-pointer">
                    <Plus className="h-3.5 w-3.5" />
                    <span>
                      {uploadingKey === 'project-gallery'
                        ? 'A adicionar...'
                        : 'Adicionar foto à galeria'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0]
                        if (!f) return
                        handleUpload(f, 'project-gallery', 'blvrs-media/gallery', (url) => {
                          setGallery((prev) => [...prev, url])
                        })
                      }}
                      disabled={uploadingKey !== null}
                      className="hidden"
                    />
                  </label>
                </div>

                {gallery.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {gallery.map((gUrl, idx) => (
                      <div key={`${gUrl}-${idx}`} className="relative group">
                        <img
                          src={gUrl}
                          alt={`Galeria ${idx + 1}`}
                          className="h-12 w-12 rounded object-cover border border-white/15"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setGallery((prev) => prev.filter((_, i) => i !== idx))
                          }
                          className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-red-600 text-[10px] text-white flex items-center justify-center cursor-pointer"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="URL embed de vídeo (YouTube/Vimeo/Cloudinary - opcional)"
                className="w-full rounded-md border border-white/10 bg-[#0B0B0B] px-3 py-2 text-xs text-white focus:border-[#F36B21] focus:outline-none"
              />

              <textarea
                required
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Breve descrição do trabalho desenvolvido *"
                className="w-full rounded-md border border-white/10 bg-[#0B0B0B] px-3 py-2 text-xs text-white focus:border-[#F36B21] focus:outline-none"
              />

              <input
                type="text"
                value={deliverablesRaw}
                onChange={(e) => setDeliverablesRaw(e.target.value)}
                placeholder="Entregáveis separados por vírgula"
                className="w-full rounded-md border border-white/10 bg-[#0B0B0B] px-3 py-2 text-xs text-white focus:border-[#F36B21] focus:outline-none"
              />

              <button
                type="submit"
                className="w-full rounded-md bg-[#F36B21] py-2.5 font-display text-xs font-bold text-white hover:bg-[#dc5b14] cursor-pointer"
              >
                {editingId ? 'Guardar Alterações do Projecto' : 'Publicar no Portefólio'}
              </button>
            </form>

            {/* Existing Projects List with Edit & Delete */}
            <div className="space-y-3">
              <h3 className="font-display text-xs font-bold uppercase tracking-widest text-[#A6A6A6]">
                Projectos Activos (clique no lápis para actualizar a imagem)
              </h3>
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-[#171717] p-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="h-12 w-16 rounded object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate">{p.title}</p>
                      <p className="text-[11px] text-[#A6A6A6] truncate">
                        {p.category} • {p.client}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => startEditingProject(p)}
                      aria-label={`Editar ${p.title}`}
                      className="p-2 text-[#A6A6A6] hover:text-[#F36B21] cursor-pointer"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteProject(p.id)}
                      aria-label={`Remover ${p.title}`}
                      className="p-2 text-[#A6A6A6] hover:text-red-400 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Hero, Serviços & Sobre Nós Images */}
        {tab === 'sections' && (
          <div className="mt-6 space-y-8">
            {/* Hero Carousel Images */}
            <div className="space-y-3">
              <h3 className="font-display text-xs font-bold uppercase tracking-widest text-[#F36B21]">
                Imagens do Carrossel Inicial (Hero)
              </h3>
              {heroSlides.map((slide, idx) => (
                <div
                  key={slide.id}
                  className="rounded-xl border border-white/10 bg-[#171717] p-4 space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="h-12 w-20 rounded object-cover shrink-0 border border-white/10"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate">
                          Slide 0{idx + 1}: {slide.badge}
                        </p>
                        <p className="text-[11px] text-[#A6A6A6] truncate">{slide.title}</p>
                      </div>
                    </div>
                    <label className="inline-flex items-center gap-1.5 rounded bg-[#F36B21] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#dc5b14] shrink-0 cursor-pointer">
                      <UploadCloud className="h-3.5 w-3.5" />
                      <span>
                        {uploadingKey === slide.id ? 'A enviar...' : 'Trocar imagem'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0]
                          if (!f) return
                          handleUpload(f, slide.id, 'blvrs-media/hero', (url) =>
                            handleSlideImageUpdate(slide.id, url)
                          )
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={slide.image}
                    onChange={(e) => handleSlideImageUpdate(slide.id, e.target.value)}
                    placeholder="URL da imagem..."
                    className="w-full rounded-md border border-white/10 bg-[#0B0B0B] px-3 py-1.5 text-[11px] text-white focus:border-[#F36B21] focus:outline-none"
                  />
                </div>
              ))}
            </div>

            {/* Services Cards Images */}
            <div className="space-y-3">
              <h3 className="font-display text-xs font-bold uppercase tracking-widest text-[#F36B21]">
                Imagens dos Cartões de Serviços
              </h3>
              {services.map((srv) => (
                <div
                  key={srv.id}
                  className="rounded-xl border border-white/10 bg-[#171717] p-4 space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={srv.image}
                        alt={srv.title}
                        className="h-12 w-20 rounded object-cover shrink-0 border border-white/10"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate">
                          {srv.number}. {srv.title}
                        </p>
                        <p className="text-[11px] text-[#A6A6A6] truncate">{srv.tagline}</p>
                      </div>
                    </div>
                    <label className="inline-flex items-center gap-1.5 rounded bg-white px-3 py-1.5 text-[11px] font-bold text-[#0B0B0B] hover:bg-[#F36B21] hover:text-white shrink-0 cursor-pointer transition-colors">
                      <UploadCloud className="h-3.5 w-3.5" />
                      <span>
                        {uploadingKey === srv.id ? 'A enviar...' : 'Trocar imagem'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0]
                          if (!f) return
                          handleUpload(f, srv.id, 'blvrs-media/services', (url) =>
                            handleServiceImageUpdate(srv.id, url)
                          )
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={srv.image}
                    onChange={(e) => handleServiceImageUpdate(srv.id, e.target.value)}
                    placeholder="URL da imagem..."
                    className="w-full rounded-md border border-white/10 bg-[#0B0B0B] px-3 py-1.5 text-[11px] text-white focus:border-[#F36B21] focus:outline-none"
                  />
                </div>
              ))}
            </div>

            {/* About Us Image */}
            <div className="space-y-3">
              <h3 className="font-display text-xs font-bold uppercase tracking-widest text-[#F36B21]">
                Imagem da Secção "Sobre Nós"
              </h3>
              <div className="rounded-xl border border-white/10 bg-[#171717] p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={config.aboutImage || '/images/hero-branding.jpg'}
                      alt="Sobre Nós"
                      className="h-12 w-20 rounded object-cover border border-white/10"
                    />
                    <span className="text-xs font-bold">Imagem Institucional</span>
                  </div>
                  <label className="inline-flex items-center gap-1.5 rounded bg-[#F36B21] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#dc5b14] cursor-pointer">
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
                </div>
                <input
                  type="text"
                  value={config.aboutImage || '/images/hero-branding.jpg'}
                  onChange={(e) => onUpdateConfig({ ...config, aboutImage: e.target.value })}
                  className="w-full rounded-md border border-white/10 bg-[#0B0B0B] px-3 py-1.5 text-[11px] text-white focus:border-[#F36B21] focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Clientes & Criativos */}
        {tab === 'clients' && (
          <div className="mt-6 space-y-8">
            {/* Add New Client Logo */}
            <form
              onSubmit={handleAddClientLogo}
              className="rounded-xl border border-white/10 bg-[#171717] p-5 space-y-3"
            >
              <h3 className="font-display text-sm font-bold flex items-center gap-2">
                <Plus className="h-4 w-4 text-[#F36B21]" />
                <span>Adicionar Novo Logótipo de Cliente</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="Nome do cliente *"
                  className="rounded-md border border-white/10 bg-[#0B0B0B] px-3 py-2 text-xs text-white focus:border-[#F36B21] focus:outline-none"
                />
                <input
                  type="text"
                  value={newClientSector}
                  onChange={(e) => setNewClientSector(e.target.value)}
                  placeholder="Sector (ex: Restauração)"
                  className="rounded-md border border-white/10 bg-[#0B0B0B] px-3 py-2 text-xs text-white focus:border-[#F36B21] focus:outline-none"
                />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={newClientFit}
                  onChange={(e) => setNewClientFit(e.target.value as ClientLogoItem['fit'])}
                  className="rounded-md border border-white/10 bg-[#0B0B0B] px-3 py-2 text-xs text-white focus:border-[#F36B21] focus:outline-none"
                >
                  <option value="contain-white">Fundo Branco</option>
                  <option value="contain-black">Fundo Preto</option>
                  <option value="cover">Cartão Cheio</option>
                </select>
                <label className="inline-flex items-center gap-1.5 rounded bg-[#F36B21] px-3 py-2 text-xs font-semibold text-white hover:bg-[#dc5b14] cursor-pointer">
                  <UploadCloud className="h-3.5 w-3.5" />
                  <span>
                    {uploadingKey === 'new-logo' ? 'A enviar...' : 'Carregar logótipo'}
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
                className="w-full rounded-md border border-white/10 bg-[#0B0B0B] px-3 py-2 text-xs text-white focus:border-[#F36B21] focus:outline-none"
              />
              <button
                type="submit"
                className="w-full rounded-md bg-white py-2 font-display text-xs font-bold text-[#0B0B0B] hover:bg-[#F36B21] hover:text-white cursor-pointer transition-colors"
              >
                Adicionar Cliente
              </button>
            </form>

            {/* Add New Creative 4:5 */}
            <form
              onSubmit={handleAddCreative}
              className="rounded-xl border border-white/10 bg-[#171717] p-5 space-y-3"
            >
              <h3 className="font-display text-sm font-bold flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-[#F36B21]" />
                <span>Adicionar Novo Criativo (4:5)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={newCreativeClient}
                  onChange={(e) => setNewCreativeClient(e.target.value)}
                  placeholder="Nome do cliente *"
                  className="rounded-md border border-white/10 bg-[#0B0B0B] px-3 py-2 text-xs text-white focus:border-[#F36B21] focus:outline-none"
                />
                <input
                  type="text"
                  required
                  value={newCreativeTitle}
                  onChange={(e) => setNewCreativeTitle(e.target.value)}
                  placeholder="Título da peça *"
                  className="rounded-md border border-white/10 bg-[#0B0B0B] px-3 py-2 text-xs text-white focus:border-[#F36B21] focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  required
                  value={newCreativeImage}
                  onChange={(e) => setNewCreativeImage(e.target.value)}
                  placeholder="URL da imagem *"
                  className="flex-1 rounded-md border border-white/10 bg-[#0B0B0B] px-3 py-2 text-xs text-white focus:border-[#F36B21] focus:outline-none"
                />
                <label className="inline-flex items-center gap-1.5 rounded bg-[#F36B21] px-3 py-2 text-xs font-semibold text-white hover:bg-[#dc5b14] shrink-0 cursor-pointer">
                  <UploadCloud className="h-3.5 w-3.5" />
                  <span>
                    {uploadingKey === 'new-creative' ? 'A enviar...' : 'Carregar'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (!f) return
                      handleUpload(f, 'new-creative', 'blvrs-media/creatives', (url) =>
                        setNewCreativeImage(url)
                      )
                    }}
                    className="hidden"
                  />
                </label>
              </div>
              <button
                type="submit"
                className="w-full rounded-md bg-[#F36B21] py-2 font-display text-xs font-bold text-white hover:bg-[#dc5b14] cursor-pointer"
              >
                Publicar Criativo
              </button>
            </form>

            {/* Existing Clients List */}
            <div className="space-y-2.5">
              <h3 className="font-display text-xs font-bold uppercase tracking-widest text-[#A6A6A6]">
                Clientes Activos ({clients.length})
              </h3>
              {clients.map((cli) => (
                <div
                  key={cli.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-[#171717] p-2.5"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={cli.image}
                      alt={cli.name}
                      className="h-9 w-12 rounded bg-white object-contain p-1 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate">{cli.name}</p>
                      <p className="text-[11px] text-[#A6A6A6] truncate">{cli.sector}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateClients(clients.filter((item) => item.id !== cli.id))
                    }
                    className="p-2 text-[#A6A6A6] hover:text-red-400 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Socials & Config */}
        {tab === 'socials' && (
          <div className="mt-6 space-y-5">
            <p className="text-xs text-[#A6A6A6]">
              Actualize os links oficiais das páginas da BLVRS MEDIA ou active novas plataformas.
            </p>
            <div className="space-y-3">
              {config.socials.map((soc, idx) => (
                <div key={soc.platform} className="space-y-1.5 rounded-lg border border-white/10 bg-[#171717] p-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-white">{soc.platform}</label>
                    <button
                      type="button"
                      onClick={() => handleToggleSocial(idx)}
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold cursor-pointer ${
                        soc.active
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-white/10 text-[#A6A6A6]'
                      }`}
                    >
                      {soc.active ? 'Activo' : 'Oculto'}
                    </button>
                  </div>
                  <input
                    type="url"
                    value={soc.url}
                    onChange={(e) => handleSocialChange(idx, e.target.value)}
                    className="w-full rounded-md border border-white/10 bg-[#0B0B0B] px-3 py-2 text-xs text-white focus:border-[#F36B21] focus:outline-none"
                  />
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleExportJson}
                className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-xs font-bold text-[#0B0B0B] cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Exportar JSON</span>
              </button>
              <button
                type="button"
                onClick={onResetDefaults}
                className="inline-flex items-center gap-2 rounded-md border border-white/15 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Repor Originais</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: Quotes */}
        {tab === 'quotes' && (
          <div className="mt-6 space-y-3">
            {quotes.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-[#171717] p-8 text-center text-xs text-[#A6A6A6] space-y-2">
                <Inbox className="h-7 w-7 mx-auto text-[#F36B21]" />
                <p>Nenhum pedido de orçamento registado nesta sessão.</p>
              </div>
            ) : (
              quotes.map((q) => (
                <div
                  key={q.id}
                  className="rounded-xl border border-white/10 bg-[#171717] p-4 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#F36B21]">{q.service}</span>
                    <span className="text-[11px] text-[#A6A6A6]">
                      {new Date(q.createdAt).toLocaleDateString('pt-PT')}
                    </span>
                  </div>
                  <p className="text-sm font-bold">
                    {q.name} <span className="font-normal text-[#A6A6A6]">({q.company})</span>
                  </p>
                  <p className="text-xs text-[#A6A6A6]">
                    {q.email} • {q.phone}
                  </p>
                  <p className="text-xs text-[#E5E5E5] pt-1">{q.message}</p>
                </div>
              ))
            )}
          </div>
        )}
      </aside>
    </div>
  )
}
