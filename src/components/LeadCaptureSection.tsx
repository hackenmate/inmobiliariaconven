import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, MessageCircle, Send } from 'lucide-react';
import type { PropertyItem } from '../data/valleyData';
import { submitLeadInquiry } from '../services/api';
import { RevealText } from './RevealText';

type LeadIntent = 'buy' | 'sell';

interface LeadCaptureSectionProps {
  preselectedProperty: PropertyItem | null;
}

export function LeadCaptureSection({ preselectedProperty }: LeadCaptureSectionProps) {
  const [intent, setIntent] = useState<LeadIntent>('buy');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (fullName.trim().length < 2) {
      setErrorMessage('Ingresa tu nombre completo para asignarte un asesor.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Ingresa un correo electrónico válido.');
      return;
    }

    if (phone.trim().replace(/\D/g, '').length < 7) {
      setErrorMessage('Ingresa un número de teléfono o WhatsApp válido.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitLeadInquiry({
        intent,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        interest: interest.trim(),
      });
      setReferenceCode(result.referenceCode ?? 'SA-REGISTRADO');
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'No pudimos registrar la consulta. Intenta nuevamente.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappText = encodeURIComponent(
    intent === 'buy'
      ? `Hola, estoy interesado en recibir información para invertir o comprar en La Convención${
          interest ? ` (${interest})` : ''
        }${referenceCode ? ` [Ref: ${referenceCode}]` : ''}.`
      : `Hola, deseo solicitar una tasación o comercialización para mi propiedad en La Convención${
          interest ? ` (${interest})` : ''
        }${referenceCode ? ` [Ref: ${referenceCode}]` : ''}.`,
  );

  return (
    <section
      id="contacto"
      className="scroll-mt-20 bg-[#F1EFEA] text-[#18241E] py-20 md:py-28 px-6 md:px-10"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <div className="lg:col-span-5 space-y-6">
          <div>
            <p className="text-sm font-medium text-[#2A4736] mb-2">
              Atención personalizada
            </p>
            <RevealText>
              <h2 className="font-serif text-[clamp(2rem,3.6vw,3rem)] font-normal leading-[1.12] tracking-tight text-[#18241E]">
                Coordina una visita técnica o tasación
              </h2>
            </RevealText>
          </div>

          <p className="text-sm md:text-[15px] leading-relaxed text-[#18241E]/75">
            Ya sea que busques adquirir una finca cafetalera, un terreno con frente fluvial o
            poner en valor una propiedad familiar en La Convención, nuestro equipo local te atiende
            en Quillabamba y Cusco.
          </p>

          <div className="pt-4 border-t border-[#18241E]/10 space-y-3 text-sm text-[#18241E]/80">
            <p>
              <span className="font-medium text-[#18241E]">Oficina Quillabamba:</span> Jr. Espinar
              248, La Convención, Cusco
            </p>
            <p>
              <span className="font-medium text-[#18241E]">Horario:</span> Lunes a sábado, 08:30 –
              18:00 h
            </p>
          </div>

          <a
            href={`https://wa.me/51984000000?text=${whatsappText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-xl bg-[#2A4736] hover:bg-[#18241E] text-[#FAF9F6] text-sm font-medium px-6 py-3.5 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Escribir por WhatsApp Business</span>
          </a>
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-2xl bg-white border border-[#18241E]/10 p-6 sm:p-8 md:p-10 shadow-sm">
            <div
              role="tablist"
              aria-label="Tipo de solicitud"
              className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-1.5 rounded-xl bg-[#F1EFEA] mb-8"
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
                    ? 'bg-white text-[#18241E] shadow-sm'
                    : 'text-[#18241E]/70 hover:text-[#18241E]'
                }`}
              >
                Busco invertir o comprar
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
                    ? 'bg-white text-[#18241E] shadow-sm'
                    : 'text-[#18241E]/70 hover:text-[#18241E]'
                }`}
              >
                Quiero vender o tasar
              </button>
            </div>

            {referenceCode ? (
              <div className="py-10 text-center space-y-4">
                <CheckCircle2 className="w-10 h-10 text-[#2A4736] mx-auto" />
                <div className="space-y-1">
                  <p className="text-xs font-medium text-[#8C6239] tabular-nums">
                    Código de registro: {referenceCode}
                  </p>
                  <h3 className="font-serif text-2xl font-normal text-[#18241E]">
                    Solicitud recibida correctamente
                  </h3>
                </div>
                <p className="text-sm text-[#18241E]/75 max-w-md mx-auto leading-relaxed">
                  Gracias, {fullName}. Un asesor senior de Selva Alta Realty en Quillabamba se
                  comunicará contigo en menos de 24 horas hábiles.
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
                  <a
                    href={`https://wa.me/51984000000?text=${whatsappText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#2A4736] text-[#FAF9F6] text-xs font-medium px-4 py-2.5 hover:bg-[#18241E] transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Continuar en WhatsApp</span>
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
                    className="text-sm font-medium text-[#2A4736] underline underline-offset-4 cursor-pointer"
                  >
                    Enviar otra consulta
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="lead-name"
                      className="block text-xs font-medium text-[#18241E]/75 mb-1.5"
                    >
                      Nombre completo
                    </label>
                    <input
                      id="lead-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ej. Carlos Mendoza"
                      className="w-full rounded-xl border border-[#18241E]/18 bg-[#FAF9F6] px-4 py-3 text-sm text-[#18241E] placeholder:text-[#18241E]/40 focus:border-[#2A4736] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lead-phone"
                      className="block text-xs font-medium text-[#18241E]/75 mb-1.5"
                    >
                      Teléfono / WhatsApp
                    </label>
                    <input
                      id="lead-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+51 984 000 000"
                      className="w-full rounded-xl border border-[#18241E]/18 bg-[#FAF9F6] px-4 py-3 text-sm text-[#18241E] placeholder:text-[#18241E]/40 focus:border-[#2A4736] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="lead-email"
                    className="block text-xs font-medium text-[#18241E]/75 mb-1.5"
                  >
                    Correo electrónico
                  </label>
                  <input
                    id="lead-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nombre@empresa.com"
                    className="w-full rounded-xl border border-[#18241E]/18 bg-[#FAF9F6] px-4 py-3 text-sm text-[#18241E] placeholder:text-[#18241E]/40 focus:border-[#2A4736] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lead-interest"
                    className="block text-xs font-medium text-[#18241E]/75 mb-1.5"
                  >
                    {intent === 'buy'
                      ? 'Zona, presupuesto o propiedad de interés'
                      : 'Ubicación, extensión (Ha o m²) y situación registral'}
                  </label>
                  <input
                    id="lead-interest"
                    type="text"
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    placeholder={
                      intent === 'buy'
                        ? 'Ej. Finca productiva en Huayopata desde 20 Ha'
                        : 'Ej. Predio de 15 Ha en Maranura inscrito en SUNARP'
                    }
                    className="w-full rounded-xl border border-[#18241E]/18 bg-[#FAF9F6] px-4 py-3 text-sm text-[#18241E] placeholder:text-[#18241E]/40 focus:border-[#2A4736] focus:bg-white focus:outline-none"
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
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#18241E] hover:bg-[#2A4736] disabled:opacity-70 text-[#FAF9F6] text-sm font-medium px-6 py-3.5 transition-colors cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Registrando consulta...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>
                        {intent === 'buy'
                          ? 'Solicitar dossier privado'
                          : 'Solicitar evaluación de tasación'}
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
