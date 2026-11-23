import React, { useMemo, useState } from 'react'
import { ArrowRight, Instagram, Linkedin, Sparkles, Users } from 'lucide-react'
import { SiteConfig, TeamMember } from '../types'
import { Reveal } from './Reveal'

interface TeamSectionProps {
  config: SiteConfig
  teamMembers: TeamMember[]
  onOpenQuote: () => void
}

export const TeamSection: React.FC<TeamSectionProps> = ({
  config,
  teamMembers,
  onOpenQuote,
}) => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('Todos')

  const departments = useMemo(() => {
    const unique = Array.from(
      new Set(teamMembers.map((m) => m.department).filter(Boolean))
    )
    return ['Todos', ...unique]
  }, [teamMembers])

  const filteredMembers = useMemo(() => {
    if (selectedDepartment === 'Todos') return teamMembers
    return teamMembers.filter((m) => m.department === selectedDepartment)
  }, [teamMembers, selectedDepartment])

  return (
    <section
      id="equipe"
      className="bg-white text-[#0B0B0B] py-16 sm:py-24 border-t border-black/10"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 space-y-10">
        {/* Header */}
        <Reveal>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#F36B21]">
                <Users className="h-3.5 w-3.5" />
                {config.teamBadge || 'Nossa Equipe'}
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0B0B0B]">
                {config.teamTitle || 'Talento criativo, visão estratégica e rigor técnico.'}
              </h2>
              <p className="text-sm sm:text-base text-[#444] leading-relaxed">
                {config.teamDescription ||
                  'Cada projecto da BLVRS MEDIA ganha vida através de uma estrutura multidisciplinar que une direcção criativa, produção audiovisual, fotografia e estratégia digital.'}
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenQuote}
              className="self-start lg:self-auto inline-flex items-center gap-2 rounded-[4px] bg-[#0B0B0B] px-6 py-3 font-display text-xs sm:text-sm font-semibold text-white transition hover:bg-[#F36B21] cursor-pointer"
            >
              <span>Falar com a nossa equipe</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </Reveal>

        {/* Department Filter Pills */}
        {departments.length > 2 && (
          <Reveal delayMs={60}>
            <div className="flex flex-wrap gap-2">
              {departments.map((dept) => {
                const active = selectedDepartment === dept
                return (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => setSelectedDepartment(dept)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                      active
                        ? 'bg-[#0B0B0B] text-white shadow-sm'
                        : 'bg-[#F2F2F2] text-[#444] hover:bg-[#e5e5e5] hover:text-[#0B0B0B]'
                    }`}
                  >
                    {dept}
                  </button>
                )
              })}
            </div>
          </Reveal>
        )}

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {filteredMembers.map((member, index) => (
            <Reveal key={member.id} delayMs={index * 70}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-[#F2F2F2] transition-all duration-300 hover:-translate-y-1 hover:border-[#F36B21]/60 hover:shadow-xl">
                <div className="cinema-card-sheen relative aspect-square w-full overflow-hidden bg-[#171717]">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      loading="lazy"
                      className="h-full w-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#1B1B1B] via-[#121212] to-[#0B0B0B] px-6 text-center">
                      <div className="rounded-2xl bg-white/95 px-6 py-4 shadow-xl transition-transform duration-500 group-hover:scale-105">
                        <img
                          src="/blvrs-logo.png"
                          alt="BLVRS MEDIA"
                          className="h-14 w-auto object-contain"
                        />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent pointer-events-none" />

                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5">
                    <span className="truncate rounded-full bg-black/75 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                      {member.department}
                    </span>
                    {member.isLead && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#F36B21] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white shadow">
                        <Sparkles className="h-2.5 w-2.5" />
                        <span>Direcção</span>
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-display text-lg font-extrabold leading-tight">
                      {member.name}
                    </h3>
                    <p className="mt-1 text-xs font-semibold text-[#F36B21]">{member.role}</p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-5 space-y-4 bg-white">
                  <p className="text-xs sm:text-sm text-[#444] leading-relaxed">{member.bio}</p>

                  <div className="space-y-3 pt-2 border-t border-black/5">
                    {member.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {member.specialties.map((spec) => (
                          <span
                            key={spec}
                            className="rounded-full bg-[#F2F2F2] px-2.5 py-1 text-[10px] font-semibold text-[#0B0B0B]"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    )}

                    {(member.instagram || member.linkedin) && (
                      <div className="flex items-center gap-2 pt-1">
                        {member.instagram && (
                          <a
                            href={member.instagram}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Instagram de ${member.name}`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-[#0B0B0B] hover:border-[#F36B21] hover:text-[#F36B21] transition-colors"
                          >
                            <Instagram className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`LinkedIn de ${member.name}`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-[#0B0B0B] hover:border-[#F36B21] hover:text-[#F36B21] transition-colors"
                          >
                            <Linkedin className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
