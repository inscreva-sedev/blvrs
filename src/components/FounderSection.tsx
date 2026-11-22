import React, { useState } from 'react'
import { Award, Briefcase, Compass, Sparkles, ArrowRight } from 'lucide-react'
import { Reveal } from './Reveal'

interface FounderSectionProps {
  onOpenQuote: () => void
}

const SOFT_SKILLS: string[] = [
  'Pensamento estratégico e visão criativa',
  'Storytelling visual e verbal',
  'Direção criativa de campanhas e conteúdos',
  'Capacidade de transformar ideias em projetos executáveis',
  'Adaptação de linguagem para diferentes públicos e contextos',
  'Escrita criativa com foco em impacto e autenticidade',
  'Sensibilidade cultural e estética para o mercado moçambicano',
  'Capacidade de liderança em projetos colaborativos',
  'Comunicação clara e persuasiva',
  'Espírito crítico e atenção ao detalhe',
  'Curiosidade constante e vontade de aprender',
  'Resiliência e gestão de pressão em ambientes criativos',
  'Capacidade de inspirar, ensinar e aprender em equipa',
  'Organização e gestão de múltiplas tarefas e prazos',
  'Iniciativa e proatividade em ambientes dinâmicos',
]

const EXPERIENCES = [
  {
    company: 'STUDIO 75 + CANAL 258',
    period: 'SETEMBRO 2022 - ABRIL 2025',
    roles: [
      'Gestor de Redes Sociais',
      'Produtor de Conteúdos',
      'Director Criativo',
      'Produtor de Programas Televisivos',
      'Apresentador de Programas de TV',
    ],
  },
  {
    company: 'VS MOBILE',
    period: 'SETEMBRO 2022 - ABRIL 2025',
    roles: [
      'Director Criativo',
      'Produtor de Conteúdos',
      'Gestor de Redes Sociais',
    ],
  },
  {
    company: 'TV SUCESSO',
    period: 'NOVEMBRO 2020 - DEZEMBRO 2021',
    roles: [
      'Fotógrafo',
      'Produtor de Programas Televisivos',
      'Gestor de Redes Sociais',
    ],
  },
  {
    company: 'VFASHION WORLD',
    period: 'OUTUBRO 2019 - MAIO 2020',
    roles: [
      'Produtor de Conteúdo',
      'Gestor de Redes Sociais',
    ],
  },
]

export const FounderSection: React.FC<FounderSectionProps> = ({ onOpenQuote }) => {
  const [activeTab, setActiveTab] = useState<'bio' | 'vision' | 'experience' | 'skills'>('bio')

  return (
    <section
      id="fundador"
      className="bg-[#0B0B0B] text-white py-16 sm:py-24 border-t border-white/10"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 space-y-12">
        {/* Header */}
        <Reveal>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#F36B21]">
                Fundador & Direcção Criativa
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                  Jermaine Adverencio
                </h2>
                <span className="rounded-full border border-[#F36B21]/40 bg-[#F36B21]/15 px-3.5 py-1 font-display text-xs font-bold uppercase tracking-widest text-[#F36B21]">
                  Len Wolts
                </span>
              </div>
              <p className="text-sm sm:text-base text-[#A6A6A6] leading-relaxed">
                Artista e profissional de Marketing, 27 anos, com 6 anos de experiência em
                comunicação criativa, gestão de redes sociais e produção de conteúdos com impacto.
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenQuote}
              className="self-start lg:self-auto inline-flex items-center gap-2 rounded-[4px] bg-[#F36B21] px-6 py-3 font-display text-xs sm:text-sm font-semibold text-white transition hover:bg-[#dc5b14] cursor-pointer"
            >
              <span>Trabalhar com a nossa direcção</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </Reveal>

        {/* Interactive Tabs */}
        <Reveal delayMs={80}>
          <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
            {[
              { id: 'bio', label: '01 - Sobre o Fundador', icon: <Sparkles className="h-3.5 w-3.5" /> },
              {
                id: 'experience',
                label: '04 - Experiências Profissionais',
                icon: <Briefcase className="h-3.5 w-3.5" />,
              },
              {
                id: 'skills',
                label: '03 - Habilidades Criativas (15)',
                icon: <Award className="h-3.5 w-3.5" />,
              },
              {
                id: 'vision',
                label: '05 - Posicionamento Digital',
                icon: <Compass className="h-3.5 w-3.5" />,
              },
            ].map((item) => {
              const active = activeTab === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id as typeof activeTab)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-[#F36B21] text-white shadow-md'
                      : 'bg-[#171717] text-[#A6A6A6] hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        </Reveal>

        {/* Tab 1: 01 - Sobre mim + highlight metrics */}
        {activeTab === 'bio' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#171717] p-6 sm:p-8 space-y-4 text-sm sm:text-base text-[#E5E5E5] leading-relaxed">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#F36B21]">
                01 - Sobre mim
              </span>
              <p>
                Sou <strong className="text-white">Jermaine Adverencio (Len Wolts)</strong>, 27
                anos, artista e profissional de Marketing com 6 anos de experiência em comunicação
                criativa, redes sociais e produção de conteúdos.
              </p>
              <p>
                Comecei em 2019 como fotógrafo publicitário e liderei a campanha completa da{' '}
                <strong className="text-white">Fashion World Mz</strong> (estratégia, spots,
                cartazes e direção criativa).
              </p>
              <p className="text-white font-medium">
                Movido por ideias que conectam estética e resultados, procuro ensinar, aprender e
                construir marcas com alma e propósito.
              </p>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-white/10 bg-[#171717] p-5">
                  <p className="font-display text-3xl font-extrabold text-[#F36B21]">6+</p>
                  <p className="mt-1 text-xs font-semibold text-white">Anos de Experiência</p>
                  <p className="mt-1 text-[11px] text-[#A6A6A6]">
                    Comunicação criativa e marketing digital
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-[#171717] p-5">
                  <p className="font-display text-3xl font-extrabold text-[#F36B21]">2019</p>
                  <p className="mt-1 text-xs font-semibold text-white">Início Profissional</p>
                  <p className="mt-1 text-[11px] text-[#A6A6A6]">
                    Fotografia publicitária & direção criativa
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#F36B21]/30 bg-gradient-to-br from-[#171717] to-[#0B0B0B] p-6 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#F36B21]">
                  Visão em Destaque
                </span>
                <p className="font-display text-lg font-bold text-white leading-snug">
                  "Posicionamento digital não é um fim em si, mas um ponto de partida para marcas
                  que querem marcar território, criar relações e gerar impacto."
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('vision')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F36B21] hover:underline cursor-pointer"
                >
                  <span>Ler visão completa de posicionamento</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: 04 - Experiências Profissionais */}
        {activeTab === 'experience' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {EXPERIENCES.map((exp) => (
              <div
                key={exp.company}
                className="rounded-2xl border border-white/10 bg-[#171717] p-6 space-y-4 transition hover:border-[#F36B21]/50"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <h3 className="font-display text-lg font-extrabold text-white">{exp.company}</h3>
                  <span className="rounded-full bg-[#0B0B0B] border border-white/10 px-3 py-1 text-[10px] font-bold tracking-wider text-[#F36B21]">
                    {exp.period}
                  </span>
                </div>
                <ul className="space-y-2">
                  {exp.roles.map((role) => (
                    <li key={role} className="flex items-center gap-2.5 text-sm text-[#E5E5E5]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#F36B21] shrink-0" />
                      <span>{role}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: 03 - Habilidades Criativas / Soft Skills */}
        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {SOFT_SKILLS.map((skill, idx) => (
              <div
                key={skill}
                className="flex items-start gap-3.5 rounded-xl border border-white/10 bg-[#171717] p-4 transition hover:border-[#F36B21]/50"
              >
                <span className="font-display text-xs font-extrabold text-[#F36B21] shrink-0 mt-0.5">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <p className="text-sm text-[#E5E5E5] leading-snug">{skill}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: 05 - Posicionamento Digital: Minha Visão */}
        {activeTab === 'vision' && (
          <div className="rounded-2xl border border-white/10 bg-[#171717] p-6 sm:p-10 space-y-4 max-w-4xl">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#F36B21]">
              05 - Posicionamento Digital: Minha Visão
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              Identidade, consistência, narrativa e propósito.
            </h3>
            <div className="space-y-3 text-sm sm:text-base text-[#E5E5E5] leading-relaxed">
              <p>
                O verdadeiro poder do digital está no posicionamento e na forma como uma marca
                comunica com o seu público - construído com identidade, consistência e narrativa.
              </p>
              <p>
                As marcas que se destacam sabem o que representam e a quem falam. O meu papel é
                ajudar cada cliente a ocupar o seu lugar com força, coerência e autenticidade.
              </p>
              <p className="text-white font-semibold pt-1">
                Posicionamento digital é o ponto de partida para marcas que querem marcar
                território, criar relações e gerar impacto.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
