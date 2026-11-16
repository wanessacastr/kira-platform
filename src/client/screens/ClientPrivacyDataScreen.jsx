// Perfil: privacidade e dados · lê o perfil real da conta (api.profile)
import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useSession } from "../../context/SessionContext";
import { useMyProfile } from "../../shared/hooks/useMyProfile";
import { DemoNotice } from "../../shared/components/demo";
import { Sheet } from "../../shared/components/Sheet";
import { Header, PrimaryButton, ProfileSection, SecondaryButton } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay } from "../../shared/theme";

// === PERFIL: Dados e privacidade ===
const maskCpf = (cpf) => {
  const d = String(cpf ?? "").replace(/\D/g, "");
  return d.length === 11 ? `•••.•••.•••-${d.slice(9)}` : "—";
};

const formatAddress = (a) => {
  if (!a?.street) return "—";
  const line = [a.number ? `${a.street}, ${a.number}` : a.street, a.neighborhood].filter(Boolean).join(" · ");
  const place = [a.city, a.state].filter(Boolean).join("/");
  return [line, place].filter(Boolean).join(" — ");
};

export default function ClientPrivacyDataScreen() {
  const { data: profile, isPending, isError, refetch } = useMyProfile();
  const { setScreen } = useSession();
  const [exporting, setExporting] = useState(false);
  const [notice, setNotice] = useState(false);
  return (
    <div
      style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background, position: "relative" }}
    >
      <Header onBack={() => setScreen("clientProfile")} />
      <div style={{ flex: 1, padding: "0 var(--space-24) var(--space-32)", overflowY: "auto" }}>
        <h1
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: "var(--font-size-2xl)",
            color: colors.foreground,
            margin: "var(--space-4) 0 var(--space-4)",
          }}
        >
          Dados e privacidade
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            margin: "0 0 var(--space-18)",
          }}
        >
          Estes são os dados que a Kira guarda sobre sua conta.
        </p>
        {isPending && (
          <p
            role="status"
            style={{ fontFamily: fontBody, fontSize: "var(--font-size-xs)", color: colors.mutedForeground }}
          >
            Carregando seus dados…
          </p>
        )}
        {isError && (
          <div role="alert" style={{ marginBottom: "var(--space-16)" }}>
            <p style={{ fontFamily: fontBody, fontSize: "var(--font-size-xs)", color: colors.mutedForeground }}>
              Não foi possível carregar seus dados.
            </p>
            <SecondaryButton onClick={() => refetch()}>Tentar novamente</SecondaryButton>
          </div>
        )}
        {profile && (
          <ProfileSection title="Dados cadastrados">
            {[
              ["Nome", profile.name || "—"],
              ["E-mail", profile.email || "—"],
              ["Telefone", profile.phone || "—"],
              ["Endereço", formatAddress(profile.address)],
              ["CPF", maskCpf(profile.cpf)],
            ].map(([label, value], i, arr) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "var(--space-12) var(--space-14)",
                  borderBottom: i === arr.length - 1 ? "none" : `1px solid ${colors.border}`,
                }}
              >
                <span style={{ fontFamily: fontBody, fontSize: "var(--font-size-xs)", color: colors.mutedForeground }}>
                  {label}
                </span>
                <span
                  style={{
                    fontFamily: fontBody,
                    fontSize: "var(--font-size-xs)",
                    fontWeight: 600,
                    color: colors.foreground,
                    textAlign: "right",
                    maxWidth: 180,
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          </ProfileSection>
        )}
        <SecondaryButton onClick={() => setExporting(true)}>
          <ShieldCheck size={15} /> Solicitar exportação dos meus dados
        </SecondaryButton>
      </div>
      {exporting && (
        <Sheet
          title="Exportar meus dados"
          onClose={() => {
            setExporting(false);
            setNotice(false);
          }}
        >
          <p
            style={{
              fontFamily: fontBody,
              fontSize: "var(--font-size-sm)",
              color: colors.foreground,
              margin: "0 0 var(--space-16)",
            }}
          >
            Você pode pedir uma cópia dos seus dados pessoais, conforme a LGPD. Confirme para solicitar a exportação.
          </p>
          <PrimaryButton onClick={() => setNotice(true)}>Confirmar solicitação</PrimaryButton>
          <DemoNotice show={notice} />
        </Sheet>
      )}
    </div>
  );
}
