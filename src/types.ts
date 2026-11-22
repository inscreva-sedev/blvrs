export type ServiceCategory =
  | 'Produção Audiovisual'
  | 'Fotografia'
  | 'Branding e Direcção Criativa'
  | 'Conteúdos Digitais'
  | 'Estratégia e Consultoria'

export type PortfolioCategory =
  | 'Todos'
  | 'Audiovisual'
  | 'Fotografia'
  | 'Branding'
  | 'Conteúdos Digitais'
  | 'Bastidores'

export interface HeroSlide {
  id: string
  badge: string
  title: string
  subtitle: string
  description: string
  primaryCta: string
  secondaryCta: string
  image: string
  targetSection: string
  accentService?: ServiceCategory
}

export interface ServiceItem {
  id: string
  number: string
  title: ServiceCategory
  shortTitle: string
  tagline: string
  summary: string
  image: string
  deliverables: string[]
  idealFor: string
  featuredInMenu?: boolean
}

export interface ProjectItem {
  id: string
  title: string
  client: string
  year: string
  category: Exclude<PortfolioCategory, 'Todos'>
  mediaType: 'video' | 'photo' | 'campaign'
  image: string
  gallery?: string[]
  videoUrl?: string
  summary: string
  strategy: string
  deliverables: string[]
  featured: boolean
}

export interface ContentPillar {
  id: string
  title: string
  description: string
  frequency: string
}

export interface SocialLinkItem {
  platform: 'Instagram' | 'Facebook' | 'TikTok' | 'LinkedIn' | 'YouTube'
  handle: string
  url: string
  active: boolean
}

export interface ClientLogoItem {
  id: string
  name: string
  sector: string
  image: string
  fit: 'contain-white' | 'contain-black' | 'cover'
  creativesFolderKey?: string
}

export interface ClientCreativeItem {
  id: string
  clientKey: string
  clientName: string
  sector: string
  title: string
  image: string
}

export interface SiteConfig {
  brandName: string
  signature: string
  positioning: string
  shortDescription: string
  aboutImage?: string
  aboutVideoUrl?: string
  phone: string
  whatsappNumber: string
  whatsappDisplay: string
  email: string
  location: string
  socials: SocialLinkItem[]
}

export interface QuoteSubmission {
  id: string
  name: string
  company: string
  email: string
  phone: string
  service: string
  budgetRange: string
  timeline: string
  message: string
  createdAt: string
  status?: 'Novo' | 'Em análise' | 'Respondido'
}
