import { ArrowUpRight, Compass, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import { AGENTS, MEDIA_ASSETS, type AgentProfile } from '../data/valleyData';
import { getLocalizedAgent, UI_COPY, type LanguageCode } from '../i18n/translations';
import { MediaImage, RevealText } from './RevealText';

interface TeamSectionProps {
  language: LanguageCode;
  onSelectAgent: (agent: AgentProfile) => void;
}

export function TeamSection({ language, onSelectAgent }: TeamSectionProps) {
  const copy = UI_COPY[language].team;
  const localizedAgents = AGENTS.map((a) => getLocalizedAgent(a, language));

  return (
    <section
      id="equipo"
      className="scroll-mt-20 bg-[#F3EFE6] text-[#0E2F1E] py-20 md:py-28 px-6 md:px-10"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-[#9A783A] mb-2">
              {copy.eyebrow}
            </p>
            <RevealText>
              <h2 className="font-serif text-[clamp(2rem,3.6vw,3rem)] font-normal leading-[1.12] tracking-tight text-[#0E2F1E]">
                {copy.heading}
              </h2>
            </RevealText>
          </div>

          <p className="text-sm md:text-[15px] text-[#2D3332]/75 max-w-md leading-relaxed">
            {copy.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {localizedAgents.map((agent) => {
            const whatsappHref = `https://wa.me/${agent.whatsappNumber}?text=${encodeURIComponent(
              language === 'en'
                ? `Hello ${agent.name}, I would like information about properties available in La Convención.`
                : `Hola ${agent.name}, me gustaría recibir información sobre propiedades disponibles en La Convención.`,
            )}`;

            return (
              <article
                key={agent.id}
                className="rounded-2xl overflow-hidden bg-white border border-[#0E2F1E]/10 shadow-sm flex flex-col sm:grid sm:grid-cols-12"
              >
                {/* Retrato / Identidad visual del asesor */}
                <div className="sm:col-span-5 relative bg-[#0E2F1E] text-[#FAF8F3] min-h-[290px] sm:min-h-full overflow-hidden">
                  {agent.photo ? (
                    <>
                      <MediaImage
                        src={agent.photo}
                        alt={`${agent.name}, ${agent.role}`}
                        fallbackTitle={agent.name}
                        className="w-full h-full object-cover object-[center_20%]"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-[#091F14]/90 via-transparent to-transparent pointer-events-none"
                      />
                      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                        <span className="inline-block text-[11px] font-medium text-[#E3C992]">
                          {copy.marianoBadge}
                        </span>
                        <p className="font-serif text-xl font-normal">{agent.name}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <MediaImage
                        src={MEDIA_ASSETS.huayopataCordillera}
                        alt={`${agent.name} · ${agent.coverage}`}
                        fallbackTitle={agent.name}
                        className="w-full h-full object-cover opacity-35"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-[#091F14]/95 via-[#0E2F1E]/80 to-[#0E2F1E]/65"
                      />
                      <div className="relative z-10 h-full p-6 flex flex-col justify-between">
                        <div className="w-14 h-14 rounded-2xl bg-[#FAF8F3]/10 border border-[#C8A562]/40 flex items-center justify-center font-serif text-2xl text-[#E3C992]">
                          {agent.name.slice(0, 1)}
                        </div>
                        <div>
                          <span className="inline-block text-[11px] font-medium text-[#E3C992] mb-1">
                            {copy.joseBadge}
                          </span>
                          <p className="font-serif text-2xl font-normal text-[#FAF8F3]">
                            {agent.name}
                          </p>
                          <p className="text-xs text-[#FAF8F3]/75 mt-1">{agent.coverage}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Biografía y contacto directo */}
                <div className="sm:col-span-7 p-6 md:p-7 flex flex-col justify-between gap-5">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-[#9A783A]">
                      <Compass className="w-3.5 h-3.5 shrink-0" />
                      <span>{agent.coverage}</span>
                    </div>

                    <h3 className="mt-2 font-serif text-2xl font-normal text-[#0E2F1E]">
                      {agent.name}
                    </h3>
                    <p className="text-xs font-medium text-[#1B4730] mt-0.5">{agent.role}</p>

                    <p className="mt-3 text-sm leading-relaxed text-[#2D3332]/80">{agent.bio}</p>

                    <ul className="mt-4 space-y-1.5 pt-4 border-t border-[#0E2F1E]/10">
                      {agent.specialties.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-xs text-[#2D3332]/85"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-[#1B4730] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-[#0E2F1E]/10 space-y-2.5">
                    <a
                      href={`tel:${agent.phoneHref}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#0E2F1E] hover:text-[#1B4730] tabular-nums transition-colors"
                    >
                      <Phone className="w-4 h-4 text-[#9A783A]" />
                      <span>{agent.phoneDisplay}</span>
                    </a>

                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0E2F1E] hover:bg-[#1B4730] text-[#FAF8F3] text-xs font-medium px-3.5 py-2.5 transition-colors whitespace-nowrap"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>
                          {copy.whatsappBtnPrefix} {agent.name}
                        </span>
                      </a>

                      <button
                        type="button"
                        onClick={() => onSelectAgent(agent)}
                        className="inline-flex items-center justify-center gap-1 rounded-xl border border-[#0E2F1E]/18 bg-white hover:bg-[#F3EFE6] text-[#0E2F1E] text-xs font-medium px-3.5 py-2.5 transition-colors whitespace-nowrap cursor-pointer"
                      >
                        <span>{copy.requestAppointment}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
