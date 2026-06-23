import { useState } from "react";
import { useConsent } from "../contexts/ConsentContext";
import { useLang } from "../contexts/LanguageContext";

/**
 * LGPDNotice — banner discreto e cinematográfico (sem modal bloqueante).
 * Apenas APÓS o usuário aceitar, o site grava preferências em localStorage.
 * Conforme com:
 *  - LGPD art. 7º, I (consentimento) e II (legítimo interesse)
 *  - LGPD art. 8º (consentimento livre, informado, inequívoco)
 *  - LGPD art. 18 (direitos do titular: revogação)
 */
export function LGPDNotice() {
  const { status, grant, deny } = useConsent();
  const { lang } = useLang();
  const [policyOpen, setPolicyOpen] = useState(false);

  if (status !== "unknown") return null;

  const label = (pt: string, en: string) => (lang === "pt" ? pt : en);

  return (
    <>
      <div
        role="dialog"
        aria-live="polite"
        aria-label={label("Aviso de privacidade", "Privacy notice")}
        className="fixed inset-x-3 bottom-3 z-[210] mx-auto max-w-3xl rounded-sm border border-noir-700 bg-noir-900/95 p-4 shadow-2xl backdrop-blur-md fade-up md:bottom-5 md:p-5"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
          <p className="flex-1 text-left text-[13px] leading-relaxed text-noir-200">
            {label(
              "Usamos armazenamento local apenas para lembrar preferências (idioma, edições do painel). Nenhum dado pessoal é enviado a terceiros sem o seu consentimento.",
              "We use local storage only to remember preferences (language, panel edits). No personal data is sent to third parties without your consent."
            )}{" "}
            <button
              onClick={() => setPolicyOpen(true)}
              className="underline underline-offset-4 transition-colors hover:text-accent"
            >
              {label("Saiba mais", "Learn more")}
            </button>
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={deny}
              className="rounded-full border border-noir-600 px-4 py-2 font-mono text-[10px] uppercase tracking-wide2 text-noir-300 transition-colors hover:border-noir-400 hover:text-cream"
            >
              {label("Recusar", "Decline")}
            </button>
            <button
              onClick={grant}
              className="rounded-full bg-cream px-4 py-2 font-mono text-[10px] uppercase tracking-wide2 text-noir-950 transition-transform hover:scale-[1.02]"
            >
              {label("Aceitar", "Accept")}
            </button>
          </div>
        </div>
      </div>

      {policyOpen && <PrivacyPolicyModal onClose={() => setPolicyOpen(false)} />}
    </>
  );
}

/** Política de privacidade — texto enxuto e direto (LGPD art. 9º). */
function PrivacyPolicyModal({ onClose }: { onClose: () => void }) {
  const { lang } = useLang();
  const label = (pt: string, en: string) => (lang === "pt" ? pt : en);

  return (
    <div
      className="fixed inset-0 z-[220] flex items-center justify-center bg-noir-950/85 p-5 backdrop-blur-md fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden />
      <div className="relative z-10 max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-sm border border-noir-700 bg-noir-900 p-7 fade-up md:p-10">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wide2 text-accent">
              {label("Política de Privacidade", "Privacy Policy")}
            </div>
            <h3 className="mt-2 font-display text-2xl text-cream md:text-3xl">
              SIM — Still In Movement
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-noir-700 p-2 text-noir-400 transition-colors hover:border-noir-500 hover:text-cream"
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="space-y-5 text-[14px] leading-relaxed text-noir-300">
          <Section
            title={label("1. Dados coletados", "1. Data collected")}
            body={label(
              "Não coletamos dados pessoais identificáveis automaticamente. O site usa apenas armazenamento local do seu navegador para guardar idioma escolhido e, se você for editor, rascunhos do painel. Esses dados ficam apenas no seu dispositivo.",
              "We do not automatically collect identifiable personal data. The site only uses your browser's local storage to remember language preference and, if you are an editor, draft edits in the panel. This data stays only on your device."
            )}
          />
          <Section
            title={label("2. Finalidade", "2. Purpose")}
            body={label(
              "Lembrar suas preferências e permitir que o estúdio edite conteúdo do site (textos, imagens, vídeos) sem perder rascunhos.",
              "Remember your preferences and allow the studio to edit site content (text, images, videos) without losing drafts."
            )}
          />
          <Section
            title={label("3. Compartilhamento", "3. Sharing")}
            body={label(
              "Nenhum dado é enviado para servidores externos ou serviços de terceiros. Não usamos analytics, pixels ou cookies de rastreamento.",
              "No data is sent to external servers or third-party services. We do not use analytics, pixels or tracking cookies."
            )}
          />
          <Section
            title={label("4. Direitos do titular (LGPD art. 18)", "4. Your rights (Brazilian LGPD art. 18)")}
            body={label(
              "Você pode revogar o consentimento a qualquer momento e apagar todos os dados gravados clicando em \"Recusar\" no aviso, ou limpando o armazenamento local do navegador.",
              "You may revoke consent at any time and erase all stored data by clicking \"Decline\" in the notice, or by clearing your browser's local storage."
            )}
          />
          <Section
            title={label("5. Contato", "5. Contact")}
            body={label(
              "Em caso de dúvidas, escreva para hello@sim.studio.",
              "For any questions, write to hello@sim.studio."
            )}
          />
        </div>

        <button
          onClick={onClose}
          className="mt-8 w-full rounded-full bg-cream py-3 font-mono text-[11px] uppercase tracking-wide2 text-noir-950 transition-transform hover:scale-[1.01]"
        >
          {label("Entendi", "Got it")}
        </button>
      </div>
    </div>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-wide2 text-noir-500">
        {title}
      </div>
      <p className="mt-1 text-noir-200">{body}</p>
    </div>
  );
}
