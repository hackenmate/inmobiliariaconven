import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, MessageCircle, Send } from 'lucide-react';
import { AGENTS, type AgentProfile, type PropertyItem } from '../data/valleyData';
import { submitLeadInquiry } from '../services/api';
import { RevealText } from './RevealText';
import { UI_COPY, type LanguageCode } from '../i18n/translations';

type LeadIntent = 'buy' | 'sell';

interface LeadCaptureSectionProps {
  language: LanguageCode;
  preselectedProperty: PropertyItem | null;
  preselectedAgent?: AgentProfile | null;
}

export function LeadCaptureSection({
  language,
  preselectedProperty,
  preselectedAgent = null,
}: LeadCaptureSectionProps) {
  const copy = UI_COPY[language].lead;
  const [intent, setIntent] = useState<LeadIntent>('buy');
  const [selectedAgentId, setSelectedAgentId] = useState<'mariano' | 'jose'>('mariano');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [referenceCode, setReferenceCode] = useState<string | null>(null);

  useEffect(() => {
    if (preselectedProperty) {
      setIntent('buy');
      setInterest(`${preselectedProperty.title} (${preselectedProperty.zone})`);
      setReferenceCode(null);
      setErrorMessage(null);
    }
  }, [preselectedProperty]);

  useEffect(() => {
    if (preselectedAgent) {
      setSelectedAgentId(preselectedAgent.id);
      setReferenceCode(null);
      setErrorMessage(null);
      if (!interest.trim()) {
        setInterest(`Coordinar asesoría con ${preselectedAgent.name} (${preselectedAgent.coverage})`);
      }
    }
  }, [preselectedAgent]);

  const activeAgent = AGENTS.find((a) => a.id === selectedAgentId) ?? AGENTS[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (fullName.trim().length < 2) {
      setErrorMessage(copy.errName);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage(copy.errEmail);
      return;
    }

    if (phone.trim().replace(/\D/g, '').length < 7) {
      setErrorMessage(copy.errPhone);
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitLeadInquiry({
        intent,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        interest:
          interest.trim() ||
          (language === 'en'
            ? `Advisory requested with ${activeAgent.name}`
            : `Asesoría solicitada con ${activeAgent.name}`),
      });
      setReferenceCode(result.referenceCode ?? 'TR-REGISTRADO');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : copy.errGeneric);
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappText = encodeURIComponent(
    language === 'en'
      ? intent === 'buy'
        ? `Hello ${activeAgent.name}, I am interested in receiving information to invest or buy in La Convención${
            interest ? ` (${interest})` : ''
          }${referenceCode ? ` [Ref: ${referenceCode}]` : ''}.`
        : `Hello ${activeAgent.name}, I would like to request a valuation or listing advisory for my property in La Convención${
            interest ? ` (${interest})` : ''
          }${referenceCode ? ` [Ref: ${referenceCode}]` : ''}.`
      : intent === 'buy'
        ? `Hola ${activeAgent.name}, estoy interesado en recibir información para invertir o comprar en La Convención${
            interest ? ` (${interest})` : ''
          }${referenceCode ? ` [Ref: ${referenceCode}]` : ''}.`
        : `Hola ${activeAgent.name}, deseo solicitar una tasación o comercialización para mi propiedad en La Convención${
            interest ? ` (${interest})` : ''
          }${referenceCode ? ` [Ref: ${referenceCode}]` : ''}.`,
  );

  return (
    <section
      id="contacto"
      className="scroll-mt-20 bg-[#F3EFE6] text-[#0E2F1E] py-20 md:py-28 px-6 md:px-10"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <div className="lg:col-span-5 space-y-6">
          <div>
            <p className="text-sm font-medium text-[#9A783A] mb-2">
              {copy.eyebrow}
            </p>
            <RevealText>
              <h2 className="font-serif text-[clamp(2rem,3.6vw,3rem)] font-normal leading-[1.12] tracking-tight text-[#0E2F1E]">
                {copy.heading}
              </h2>
            </RevealText>
          </div>

          <p className="text-sm md:text-[15px] leading-relaxed text-[#2D3332]/80">
            {copy.subtitle}
          </p>

          <div className="pt-4 border-t border-[#0E2F1E]/10 space-y-2.5 text-sm text-[#2D3332]/85">
            <p>
              <span className="font-medium text-[#0E2F1E]">{copy.officeLabel}</span>{' '}
              {copy.officeValue}
            </p>
            <p>
              <span className="font-medium text-[#0E2F1E]">{copy.hoursLabel}</span>{' '}
              {copy.hoursValue}
            </p>
          </div>

          <div className="space-y-2.5">
            <p className="text-xs font-medium text-[#2D3332]/70">
              {copy.whatsappDirect}
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5">
              {AGENTS.map((agent) => {
                const isActive = agent.id === selectedAgentId;
                return (
                  <a
                    key={agent.id}
                    href={`https://wa.me/${agent.whatsappNumber}?text=${whatsappText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setSelectedAgentId(agent.id)}
                    className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl text-xs font-medium px-4 py-3 transition-colors ${
                      isActive
                        ? 'bg-[#0E2F1E] hover:bg-[#1B4730] text-[#FAF8F3]'
                        : 'bg-white hover:bg-[#FAF8F3] text-[#0E2F1E] border border-[#0E2F1E]/15'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span>
                      {agent.name} · {agent.phoneDisplay}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-2xl bg-white border border-[#0E2F1E]/10 p-6 sm:p-8 md:p-10 shadow-sm">
            <div
              role="tablist"
              aria-label={copy.tabAria}
              className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-1.5 rounded-xl bg-[#F3EFE6] mb-8"
            >
              <button
                type="button"
                role="tab"
                aria-selected={intent === 'buy'}
                onClick={() => {
                  setIntent('buy');
                  setReferenceCode(null);
                  setErrorMessage(null);
                }}
                className={`py-3 px-4 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  intent === 'buy'
                    ? 'bg-white text-[#0E2F1E] shadow-sm'
                    : 'text-[#2D3332]/75 hover:text-[#0E2F1E]'
                }`}
              >
                {copy.tabBuy}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={intent === 'sell'}
                onClick={() => {
                  setIntent('sell');
                  setReferenceCode(null);
                  setErrorMessage(null);
                }}
                className={`py-3 px-4 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  intent === 'sell'
                    ? 'bg-white text-[#0E2F1E] shadow-sm'
                    : 'text-[#2D3332]/75 hover:text-[#0E2F1E]'
                }`}
              >
                {copy.tabSell}
              </button>
            </div>

            {referenceCode ? (
              <div className="py-10 text-center space-y-4">
                <CheckCircle2 className="w-10 h-10 text-[#1B4730] mx-auto" />
                <div className="space-y-1">
                  <p className="text-xs font-medium text-[#9A783A] tabular-nums">
                    {copy.refCodeLabel} {referenceCode}
                  </p>
                  <h3 className="font-serif text-2xl font-normal text-[#0E2F1E]">
                    {copy.successTitle}
                  </h3>
                </div>
                <p className="text-sm text-[#2D3332]/80 max-w-md mx-auto leading-relaxed">
                  {copy.successBody(fullName, activeAgent.name, activeAgent.phoneDisplay)}
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
                  <a
                    href={`https://wa.me/${activeAgent.whatsappNumber}?text=${whatsappText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#0E2F1E] text-[#FAF8F3] text-xs font-medium px-4 py-2.5 hover:bg-[#1B4730] transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{copy.continueWhatsapp(activeAgent.name)}</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setReferenceCode(null);
                      setFullName('');
                      setEmail('');
                      setPhone('');
                      setInterest('');
                    }}
                    className="text-sm font-medium text-[#1B4730] underline underline-offset-4 cursor-pointer"
                  >
                    {copy.sendAnother}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="lead-name"
                      className="block text-xs font-medium text-[#2D3332]/80 mb-1.5"
                    >
                      {copy.nameLabel}
                    </label>
                    <input
                      id="lead-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={copy.namePlaceholder}
                      className="w-full rounded-xl border border-[#0E2F1E]/18 bg-[#FAF8F3] px-4 py-3 text-sm text-[#0E2F1E] placeholder:text-[#2D3332]/40 focus:border-[#0E2F1E] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lead-phone"
                      className="block text-xs font-medium text-[#2D3332]/80 mb-1.5"
                    >
                      {copy.phoneLabel}
                    </label>
                    <input
                      id="lead-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+51 950 155 945"
                      className="w-full rounded-xl border border-[#0E2F1E]/18 bg-[#FAF8F3] px-4 py-3 text-sm text-[#0E2F1E] placeholder:text-[#2D3332]/40 focus:border-[#0E2F1E] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="lead-email"
                    className="block text-xs font-medium text-[#2D3332]/80 mb-1.5"
                  >
                    {copy.emailLabel}
                  </label>
                  <input
                    id="lead-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={copy.emailPlaceholder}
                    className="w-full rounded-xl border border-[#0E2F1E]/18 bg-[#FAF8F3] px-4 py-3 text-sm text-[#0E2F1E] placeholder:text-[#2D3332]/40 focus:border-[#0E2F1E] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lead-interest"
                    className="block text-xs font-medium text-[#2D3332]/80 mb-1.5"
                  >
                    {intent === 'buy' ? copy.interestBuyLabel : copy.interestSellLabel}
                  </label>
                  <input
                    id="lead-interest"
                    type="text"
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    placeholder={
                      intent === 'buy'
                        ? copy.interestBuyPlaceholder
                        : copy.interestSellPlaceholder
                    }
                    className="w-full rounded-xl border border-[#0E2F1E]/18 bg-[#FAF8F3] px-4 py-3 text-sm text-[#0E2F1E] placeholder:text-[#2D3332]/40 focus:border-[#0E2F1E] focus:bg-white focus:outline-none"
                  />
                </div>

                {errorMessage && (
                  <p role="alert" className="text-xs font-medium text-[#9B2C2C]">
                    {errorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#0E2F1E] hover:bg-[#1B4730] disabled:opacity-70 text-[#FAF8F3] text-sm font-medium px-6 py-3.5 transition-colors cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{copy.submittingBtn}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>
                        {intent === 'buy' ? copy.submitBuyBtn : copy.submitSellBtn}
                      </span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
