import {
  ClientCreativeItem,
  ClientLogoItem,
  ContentPillar,
  HeroSlide,
  ProjectItem,
  ServiceItem,
  SiteConfig,
} from '../types'

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  brandName: 'BLVRS MEDIA',
  signature: 'Criamos histórias. Posicionamos marcas.',
  positioning: 'Conteúdo que gera percepção. Estratégia que cria autoridade.',
  shortDescription:
    'A BLVRS MEDIA é uma agência criativa e de comunicação especializada em produção audiovisual, fotografia, branding, direcção criativa e desenvolvimento de estratégias de comunicação para marcas, empresas, artistas e projectos.',
  phone: '+258 87 408 7213',
  whatsappNumber: '258844756340',
  whatsappDisplay: '+258 84 475 6340',
  email: 'blvrsbookings@gmail.com',
  location: 'Maputo, Moçambique',
  socials: [
    {
      platform: 'Instagram',
      handle: '@blvrs_media',
      url: 'https://www.instagram.com/blvrs_media/',
      active: true,
    },
    {
      platform: 'Facebook',
      handle: 'BLVRS MEDIA',
      url: 'https://www.facebook.com/media/set/?set=a.380111124239557&type=3',
      active: true,
    },
    {
      platform: 'TikTok',
      handle: '@believers.media1',
      url: 'https://www.tiktok.com/@believers.media1?_r=1&_t=ZS-9BSMGtIIICq',
      active: true,
    },
    { platform: 'LinkedIn', handle: 'BLVRS MEDIA', url: 'https://linkedin.com', active: false },
    { platform: 'YouTube', handle: 'BLVRS MEDIA', url: 'https://youtube.com', active: false },
  ],
}

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-main',
    badge: 'Agência Criativa & Comunicação',
    title: 'Criamos histórias. Posicionamos marcas.',
    subtitle: 'Conteúdo que gera percepção. Estratégia que cria autoridade.',
    description:
      'Transformamos ideias em experiências visuais e desenvolvemos comunicação que aproxima marcas das pessoas.',
    primaryCta: 'Fale connosco',
    secondaryCta: 'Explorar projectos',
    image: '/images/hero-cinema.jpg',
    targetSection: '#portfolio',
  },
  {
    id: 'slide-audiovisual',
    badge: 'Produção Audiovisual',
    title: 'Narrativas cinematográficas de alto impacto.',
    subtitle: 'Vídeos comerciais, documentários, videoclipes e campanhas publicitárias.',
    description:
      'Produção completa do conceito à pós-produção, com rigor estético e intenção estratégica para marcas e artistas.',
    primaryCta: 'Solicitar orçamento',
    secondaryCta: 'Ver serviços',
    image: '/images/service-audiovisual.jpg',
    targetSection: '#servicos',
    accentService: 'Produção Audiovisual',
  },
  {
    id: 'slide-branding',
    badge: 'Branding & Direcção Criativa',
    title: 'Estética com propósito. Identidade com força.',
    subtitle: 'Cada projecto com intenção, identidade e uma mensagem clara.',
    description:
      'Desenvolvemos sistemas visuais, conceitos de campanha e posicionamento que constroem autoridade duradoura.',
    primaryCta: 'Iniciar projecto',
    secondaryCta: 'Explorar portefólio',
    image: '/images/hero-branding.jpg',
    targetSection: '#portfolio',
    accentService: 'Branding e Direcção Criativa',
  },
]

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'srv-audiovisual',
    number: '01',
    title: 'Produção Audiovisual',
    shortTitle: 'Audiovisual',
    tagline: 'Cinema comercial, institucional e narrativas em movimento.',
    summary:
      'Produzimos filmes de marca, comerciais, videoclipes e documentários pensados para elevar a percepção e gerar impacto real.',
    image: '/images/service-audiovisual.jpg',
    deliverables: [
      'Vídeos comerciais e promocionais',
      'Vídeos institucionais',
      'Documentários e filmes',
      'Videoclipes',
      'Entrevistas e podcasts',
      'Cobertura audiovisual de eventos',
      'Campanhas publicitárias',
    ],
    idealFor: 'Marcas, empresas, artistas e campanhas de lançamento.',
    featuredInMenu: true,
  },
  {
    id: 'srv-fotografia',
    number: '02',
    title: 'Fotografia',
    shortTitle: 'Fotografia',
    tagline: 'Imagem editorial que comunica valor à primeira vista.',
    summary:
      'Sessões fotográficas com direcção de arte dedicada para destacar produtos, equipas, eventos e retratos de liderança.',
    image: '/images/service-photography.jpg',
    deliverables: [
      'Fotografia corporativa',
      'Fotografia de produtos',
      'Fotografia publicitária',
      'Fotografia de eventos',
      'Retratos profissionais',
      'Fotografia institucional',
    ],
    idealFor: 'Empresas, catálogos comerciais, artistas e executivos.',
    featuredInMenu: true,
  },
  {
    id: 'srv-branding',
    number: '03',
    title: 'Branding e Direcção Criativa',
    shortTitle: 'Branding',
    tagline: 'Construção de identidades visuais memoráveis e coerentes.',
    summary:
      'Alinhamos estética e estratégia para dar voz, personalidade e consistência visual a novos projectos ou marcas em expansão.',
    image: '/images/hero-branding.jpg',
    deliverables: [
      'Desenvolvimento de identidade visual',
      'Direcção criativa de campanhas',
      'Conceitos visuais',
      'Desenvolvimento de narrativas para marcas',
      'Posicionamento e comunicação de marca',
    ],
    idealFor: 'Startups, rebrandings, lançamentos de produtos e artistas.',
    featuredInMenu: true,
  },
  {
    id: 'srv-digitais',
    number: '04',
    title: 'Conteúdos Digitais',
    shortTitle: 'Conteúdos Digitais',
    tagline: 'Ritmo, edição e presença digital de elevada qualidade.',
    summary:
      'Formatos dinâmicos pensados para plataformas digitais, unindo motion design, edição ágil e estratégia editorial.',
    image: '/images/service-postprod.jpg',
    deliverables: [
      'Criação de conteúdos para redes sociais',
      'Produção de vídeos curtos',
      'Motion design',
      'Edição e pós-produção',
      'Estratégia de conteúdos',
    ],
    idealFor: 'Marcas activas no Instagram, TikTok, YouTube e LinkedIn.',
    featuredInMenu: true,
  },
  {
    id: 'srv-consultoria',
    number: '05',
    title: 'Estratégia e Consultoria',
    shortTitle: 'Estratégia',
    tagline: 'Orientação estratégica que transforma comunicação em autoridade.',
    summary:
      'Não somos apenas uma agência de publicação. Orientamos marcas na construção de percepção, posicionamento e crescimento.',
    image: '/images/hero-cinema.jpg',
    deliverables: [
      'Assessoria de marketing',
      'Estratégia de comunicação',
      'Posicionamento digital',
      'Consultoria criativa',
      'Gestão de redes sociais para projectos seleccionados',
    ],
    idealFor: 'Lideranças empresariais, projectos institucionais e marcas em consolidação.',
    featuredInMenu: false,
  },
]

export const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-real-chicken-village',
    title: 'Campanha Digital & Identidade - Chicken Village',
    client: 'Chicken Village',
    year: '2026',
    category: 'Conteúdos Digitais',
    mediaType: 'campaign',
    image:
      '/Criativos%20feitos%20para%20clientes/images%20-%20Chicken%20Village/Semana-1_01.png',
    gallery: [
      '/Criativos%20feitos%20para%20clientes/images%20-%20Chicken%20Village/Semana-1_01.png',
      '/Criativos%20feitos%20para%20clientes/images%20-%20Chicken%20Village/Semana-1_02.png',
      '/Criativos%20feitos%20para%20clientes/images%20-%20Chicken%20Village/Semana-1_03.png',
      '/Criativos%20feitos%20para%20clientes/images%20-%20Chicken%20Village/Semana-1_04.png',
    ],
    summary:
      'Série de criativos semanais e direcção visual para redes sociais focada em apelo gastronómico, clareza de oferta e consistência de marca.',
    strategy:
      'Planeamento semanal orientado aos pilares de conversão e entretenimento visual para aumentar reconhecimento e encomendas.',
    deliverables: ['4 Criativos Semanais', 'Direcção de Arte Digital', 'Copywriting Estratégico'],
    featured: true,
  },
  {
    id: 'proj-real-alibaba',
    title: 'Conteúdos de Marca & Campanhas - Ali Baba',
    client: 'Ali Baba e os 40 Frangos',
    year: '2026',
    category: 'Branding',
    mediaType: 'campaign',
    image:
      '/Criativos%20feitos%20para%20clientes/images%20-%20AliBaba/Alibaba-Foof-4-contents_01.png',
    gallery: [
      '/Criativos%20feitos%20para%20clientes/images%20-%20AliBaba/Alibaba-Foof-4-contents_01.png',
      '/Criativos%20feitos%20para%20clientes/images%20-%20AliBaba/Alibaba-Foof-4-contents_02.png',
      '/Criativos%20feitos%20para%20clientes/images%20-%20AliBaba/Alibaba-Foof-4-contents_03.png',
      '/Criativos%20feitos%20para%20clientes/images%20-%20AliBaba/Alibaba-Foof-4-contents_04.png',
    ],
    summary:
      'Desenvolvimento de linha criativa para comunicação digital e posicionamento visual de restaurante com identidade vibrante.',
    strategy:
      'Combinação de tipografia expressiva, fotografia de produto e chamadas à acção directas para tráfego e engajamento.',
    deliverables: ['Pacote 4 Peças Criativas', 'Sistema Visual Social', 'Comunicação Promocional'],
    featured: true,
  },
  {
    id: 'proj-real-vivasaude',
    title: 'Comunicação & Autoridade - Farmácia Viva Saúde',
    client: 'Farmácia Viva Saúde',
    year: '2026',
    category: 'Conteúdos Digitais',
    mediaType: 'campaign',
    image:
      '/Criativos%20feitos%20para%20clientes/images%20-%20Farmacia%20VIVA%20saude/Farmacia-4-contents_01.png',
    gallery: [
      '/Criativos%20feitos%20para%20clientes/images%20-%20Farmacia%20VIVA%20saude/Farmacia-4-contents_01.png',
      '/Criativos%20feitos%20para%20clientes/images%20-%20Farmacia%20VIVA%20saude/Farmacia-4-contents_02.png',
      '/Criativos%20feitos%20para%20clientes/images%20-%20Farmacia%20VIVA%20saude/Farmacia-4-contents_03.png',
      '/Criativos%20feitos%20para%20clientes/images%20-%20Farmacia%20VIVA%20saude/Farmacia-4-contents_04.png',
    ],
    summary:
      'Campanha educativa e institucional focada em saúde, confiança e proximidade com a comunidade.',
    strategy:
      'Conteúdos de conhecimento e autoridade com linguagem clara e estética limpa para transmitir credibilidade clínica.',
    deliverables: ['4 Criativos Educativos', 'Posicionamento Digital', 'Identidade de Campanha'],
    featured: true,
  },
  {
    id: 'proj-real-imfisio',
    title: 'Posicionamento Clínico - IM Fisio',
    client: 'IM Fisio',
    year: '2026',
    category: 'Branding',
    mediaType: 'campaign',
    image:
      '/Criativos%20feitos%20para%20clientes/images%20-IMfisio/Clinica-Fisioterapeuta-4-contents_01.png',
    gallery: [
      '/Criativos%20feitos%20para%20clientes/images%20-IMfisio/Clinica-Fisioterapeuta-4-contents_01.png',
      '/Criativos%20feitos%20para%20clientes/images%20-IMfisio/Clinica-Fisioterapeuta-4-contents_02.png',
      '/Criativos%20feitos%20para%20clientes/images%20-IMfisio/Clinica-Fisioterapeuta-4-contents_03.png',
      '/Criativos%20feitos%20para%20clientes/images%20-IMfisio/Clinica-Fisioterapeuta-4-contents_04.png',
    ],
    summary:
      'Série de peças de comunicação estratégica para clínica de fisioterapia e reabilitação, valorizando autoridade técnica e cuidado humano.',
    strategy:
      'Estrutura editorial equilibrada entre informação clínica acessível e chamadas para agendamento.',
    deliverables: ['4 Peças de Autoridade', 'Direcção Visual', 'Estratégia de Conteúdo'],
    featured: true,
  },
  {
    id: 'proj-horizon-film',
    title: 'Manifesto Institucional - Horizonte Energia',
    client: 'Horizonte Energia',
    year: '2026',
    category: 'Audiovisual',
    mediaType: 'video',
    image: '/images/hero-cinema.jpg',
    videoUrl: '',
    summary:
      'Filme institucional e campanha multicanal produzida para posicionar a marca como referência no sector corporativo.',
    strategy:
      'Narrativa cinematográfica centrada nas pessoas e na engenharia, combinando captação 4K anamórfica com color grading editorial.',
    deliverables: ['Filme Institucional 90s', '3 Cutdowns para Redes', 'Fotografia de Bastidores'],
    featured: true,
  },
  {
    id: 'proj-noir-editorial',
    title: 'Fotografia Corporativa & Espaço - IM Fisio',
    client: 'IM Fisio',
    year: '2026',
    category: 'Fotografia',
    mediaType: 'photo',
    image: '/images/im-fisio-arrumacao.jpg',
    gallery: [
      '/images/im-fisio-consulta.jpg',
      '/images/im-fisio-arrumacao.jpg',
      '/images/im-fisio-equipamento.jpg',
    ],
    summary:
      'Sessão fotográfica institucional das instalações e equipamentos da clínica, destacando organização, iluminação natural e modernidade.',
    strategy:
      'Enquadramentos arquitectónicos limpos para transmitir confiança clínica, rigor e profissionalismo nos canais digitais.',
    deliverables: ['Fotografia Institucional', 'Registo de Infraestruturas', 'Edição & Tratamento'],
    featured: true,
  },
  {
    id: 'proj-pulse-brand',
    title: 'Rebranding & Direcção Criativa - Vértice Studio',
    client: 'Vértice Arquitectos',
    year: '2025',
    category: 'Branding',
    mediaType: 'campaign',
    image: '/images/hero-branding.jpg',
    summary:
      'Reposicionamento completo de identidade visual, sistema tipográfico e narrativa de comunicação para estúdio de arquitectura.',
    strategy:
      'Estética monocromática com acento estratégico de cor, traduzindo rigor técnico e sofisticação em cada ponto de contacto.',
    deliverables: ['Identidade Visual', 'Narrativa de Marca', 'Direcção de Arte', 'Kit Digital'],
    featured: true,
  },
  {
    id: 'proj-soundwave-clip',
    title: 'Produção Audiovisual & Tour Virtual - Espaço IM Fisio',
    client: 'IM Fisio',
    year: '2026',
    category: 'Audiovisual',
    mediaType: 'video',
    image: '/images/im-fisio-equipamento.jpg',
    summary:
      'Captação audiovisual e apresentação detalhada da zona de treino terapêutico e equipamentos modernos para campanhas digitais.',
    strategy:
      'Planos estabilizados de detalhe e ambiente para valorizar o investimento técnico da marca e atrair novos pacientes.',
    deliverables: ['Vídeo Institucional', 'Reels de Apresentação', 'Fotografia Complementar'],
    featured: true,
  },
  {
    id: 'proj-motion-launch',
    title: 'Série de Conteúdos Digitais & Motion - Finova',
    client: 'Finova Digital',
    year: '2026',
    category: 'Conteúdos Digitais',
    mediaType: 'video',
    image: '/images/service-postprod.jpg',
    summary:
      'Estratégia mensal de vídeos curtos educativos e motion design para consolidação de autoridade no LinkedIn e Instagram.',
    strategy:
      'Estruturação dos pilares de autoridade e conversão com ritmo de edição ágil e identidade gráfica consistente.',
    deliverables: ['12 Vídeos Curtos/Mês', 'Pacote Motion Design', 'Calendário Editorial'],
    featured: false,
  },
  {
    id: 'proj-bts-studio',
    title: 'Bastidores & Fluxo de Pós-Produção BLVRS',
    client: 'BLVRS MEDIA Lab',
    year: '2026',
    category: 'Bastidores',
    mediaType: 'photo',
    image: '/images/service-postprod.jpg',
    summary:
      'Registo documental dos processos internos de filmagem, iluminação, direcção e color grading da equipa BLVRS MEDIA.',
    strategy:
      'Transparência técnica para demonstrar aos clientes a atenção ao detalhe por trás de cada entrega visual.',
    deliverables: ['Série Bastidores', 'Documentação de Equipamentos', 'Reels de Processo'],
    featured: false,
  },
]

export const CONTENT_PILLARS: ContentPillar[] = [
  {
    id: 'pil-portfolio',
    title: 'Portfólio e Projectos',
    description:
      'Apresentação de trabalhos realizados, campanhas, vídeos, fotografias e projectos desenvolvidos pela agência.',
    frequency: '1x / semana',
  },
  {
    id: 'pil-bastidores',
    title: 'Bastidores',
    description:
      'Demonstração dos processos de filmagem, fotografia, direcção, produção e edição.',
    frequency: 'Stories & semanal',
  },
  {
    id: 'pil-autoridade',
    title: 'Conhecimento e Autoridade',
    description:
      'Conteúdos educativos sobre comunicação, branding, marketing, produção audiovisual e posicionamento de marcas.',
    frequency: '1x / semana',
  },
  {
    id: 'pil-criatividade',
    title: 'Criatividade e Entretenimento',
    description:
      'Conteúdos dinâmicos, situações do quotidiano da produção e abordagens criativas relacionadas com o mercado.',
    frequency: '1x / semana',
  },
  {
    id: 'pil-conversao',
    title: 'Serviços e Conversão',
    description:
      'Apresentação dos serviços da agência, vantagens de trabalhar com a BLVRS MEDIA e chamadas à acção.',
    frequency: 'Contínuo',
  },
]

export const CLIENT_LOGOS: ClientLogoItem[] = [
  {
    id: 'cli-canal258',
    name: 'Canal 258',
    sector: 'Comunicação & Média',
    image: '/NOSSOS%20CLIENTES/CANAL%20258.jpg',
    fit: 'cover',
  },
  {
    id: 'cli-muzza',
    name: 'Muzza',
    sector: 'Restauração & Lifestyle',
    image: '/NOSSOS%20CLIENTES/MUZZA.jpg',
    fit: 'cover',
  },
  {
    id: 'cli-chicken-village',
    name: 'Chicken Village',
    sector: 'Gastronomia',
    image: '/NOSSOS%20CLIENTES/Chicken%20Vilage%20LOGO.png',
    fit: 'contain-white',
    creativesFolderKey: 'Chicken Village',
  },
  {
    id: 'cli-alibaba',
    name: 'Ali Baba e os 40 Frangos',
    sector: 'Restauração',
    image: '/NOSSOS%20CLIENTES/LOGO%201.jpg',
    fit: 'contain-white',
    creativesFolderKey: 'Ali Baba',
  },
  {
    id: 'cli-viva-saude',
    name: 'Farmácia Viva Saúde',
    sector: 'Saúde & Bem-Estar',
    image: '/NOSSOS%20CLIENTES/FARMACIA%20VIVA%20SAUDE%20LOGO.png',
    fit: 'contain-white',
    creativesFolderKey: 'Farmácia Viva Saúde',
  },
  {
    id: 'cli-fisiocare',
    name: 'Fisiocare',
    sector: 'Fisioterapia & Reabilitação',
    image: '/NOSSOS%20CLIENTES/FISIOCARE%20Logo.png',
    fit: 'contain-white',
  },
  {
    id: 'cli-imfisio',
    name: 'IM Fisio',
    sector: 'Saúde & Clínica',
    image: '/NOSSOS%20CLIENTES/IM%20FISIO%20LOGO.png',
    fit: 'contain-white',
    creativesFolderKey: 'IM Fisio',
  },
  {
    id: 'cli-fashion-world',
    name: 'Fashion World',
    sector: 'Moda & Retalho',
    image: '/NOSSOS%20CLIENTES/FASHION%20WORLD.jpg',
    fit: 'cover',
  },
  {
    id: 'cli-dj-faya',
    name: 'DJ Faya',
    sector: 'Música & Entretenimento',
    image: '/NOSSOS%20CLIENTES/DJ%20FAYA.jpeg',
    fit: 'contain-black',
  },
  {
    id: 'cli-vs-mobile',
    name: 'VS Mobile',
    sector: 'Tecnologia & Mobile',
    image: '/NOSSOS%20CLIENTES/VS%20MOBILE.jpg',
    fit: 'contain-black',
  },
]

export const CLIENT_CREATIVES: ClientCreativeItem[] = [
  // Chicken Village
  ...[1, 2, 3, 4].map((n) => ({
    id: `cre-cv-${n}`,
    clientKey: 'Chicken Village',
    clientName: 'Chicken Village',
    sector: 'Gastronomia',
    title: `Campanha Semana 1 - Peça 0${n}`,
    image: `/Criativos%20feitos%20para%20clientes/images%20-%20Chicken%20Village/Semana-1_0${n}.png`,
  })),
  // Ali Baba
  ...[1, 2, 3, 4].map((n) => ({
    id: `cre-ab-${n}`,
    clientKey: 'Ali Baba',
    clientName: 'Ali Baba e os 40 Frangos',
    sector: 'Restauração',
    title: `Campanha Promocional - Peça 0${n}`,
    image: `/Criativos%20feitos%20para%20clientes/images%20-%20AliBaba/Alibaba-Foof-4-contents_0${n}.png`,
  })),
  // Farmácia Viva Saúde
  ...[1, 2, 3, 4].map((n) => ({
    id: `cre-fvs-${n}`,
    clientKey: 'Farmácia Viva Saúde',
    clientName: 'Farmácia Viva Saúde',
    sector: 'Saúde & Bem-Estar',
    title: `Série Saúde & Bem-Estar - Peça 0${n}`,
    image: `/Criativos%20feitos%20para%20clientes/images%20-%20Farmacia%20VIVA%20saude/Farmacia-4-contents_0${n}.png`,
  })),
  // IM Fisio
  {
    id: 'cre-imf-photo',
    clientKey: 'IM Fisio',
    clientName: 'IM Fisio',
    sector: 'Fisioterapia & Reabilitação',
    title: 'Fotografia Editorial - Consulta Clínica',
    image: '/images/im-fisio-consulta.jpg',
  },
  ...[1, 2, 3, 4].map((n) => ({
    id: `cre-imf-${n}`,
    clientKey: 'IM Fisio',
    clientName: 'IM Fisio',
    sector: 'Fisioterapia & Reabilitação',
    title: `Campanha Clínica - Peça 0${n}`,
    image: `/Criativos%20feitos%20para%20clientes/images%20-IMfisio/Clinica-Fisioterapeuta-4-contents_0${n}.png`,
  })),
]
