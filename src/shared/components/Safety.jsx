// Botão de segurança, denúncia e emergência · mock · futura API: POST /api/denuncias
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  LockOpen,
  MessageSquareWarning,
  Phone,
  ShieldAlert,
  UserX,
  X,
} from "lucide-react";
import { useState } from "react";
import { colors, fontBody, fontDisplay } from "../theme";
import { Field, SecondaryButton, inputStyle } from "./ui";

// ==========================================================================
// NOVO — Canal de segurança e denúncia
// ==========================================================================
// Implementa o fluxograma "Canal de segurança e denúncia": aciona denúncia →
// seleciona motivo → risco imediato? Caminho "sim" pula fila e notifica a
// equipe na hora (identidade não anônima perante a equipe, para permitir
// contato rápido); caminho "não" registra denúncia anônima numa fila de
// análise. Adaptado dos componentes de referência (Tailwind) para os tokens
// visuais já usados no protótipo (colors, fontBody/fontDisplay, inputStyle).
// Aditivo: não altera nenhuma tela existente, só é inserido nelas.
export const reportMotivoOptions = [
  { value: "endereco_invalido", label: "Endereço não confere" },
  { value: "comportamento_suspeito", label: "Comportamento suspeito" },
  { value: "risco_imediato", label: "Risco imediato" },
  { value: "outro", label: "Outro" },
];

// Caminho "sim" do fluxograma — risco imediato: ligar 190 primeiro, com a
// opção de também registrar no Kira. Aqui a identidade do denunciante É
// associada internamente (não é anônima perante a equipe), diferente do
// fluxo padrão, justamente para permitir contato rápido.
export const EmergencyFlow = ({ onClose, onRegisterInternally }) => {
  const handleRegister = () => {
    // POST /api/denuncias { tipoMotivo: "risco_imediato" }
    // Notifica a equipe na hora (sem fila) e suspende o perfil envolvido de
    // forma preventiva — conforme o fluxograma do canal de segurança.
    onRegisterInternally?.();
    onClose();
  };
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "hsl(var(--foreground-hsl) / 0.45)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        zIndex: 60,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 380,
          background: colors.card,
          borderRadius: "24px 24px 0 0",
          padding: "20px 24px 28px",
        }}
      >
        <div style={{ width: 40, height: 4, borderRadius: 2, background: colors.border, margin: "0 auto 16px" }} />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: 12,
            borderRadius: 12,
            background: "hsl(var(--destructive-hsl) / 0.08)",
            marginBottom: 16,
          }}
        >
          <AlertTriangle size={20} color={colors.destructive} />
          <span style={{ fontFamily: fontBody, fontSize: 13, fontWeight: 700, color: colors.destructive }}>
            Se você está em perigo agora, ligue primeiro
          </span>
        </div>

        <a
          href="tel:190"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            height: 48,
            borderRadius: 14,
            background: colors.destructive,
            color: "var(--color-background)",
            fontFamily: fontBody,
            fontWeight: 700,
            fontSize: 14,
            textDecoration: "none",
            marginBottom: 10,
          }}
        >
          <Phone size={17} /> Ligar para 190 agora
        </a>

        <button
          onClick={handleRegister}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            height: 44,
            borderRadius: 14,
            border: `1px solid ${colors.border}`,
            background: colors.card,
            color: colors.foreground,
            fontFamily: fontBody,
            fontWeight: 600,
            fontSize: 13,
            cursor: "pointer",
            marginBottom: 18,
          }}
        >
          <MessageSquareWarning size={16} /> Também registrar no Kira
        </button>

        <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: 14 }}>
          <p style={{ fontFamily: fontBody, fontSize: 11, color: colors.mutedForeground, margin: "0 0 10px" }}>
            Ao registrar, a equipe do Kira é notificada imediatamente e:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { icon: Bell, text: "Um responsável é alertado na hora, sem entrar em fila" },
              { icon: UserX, text: "O perfil envolvido é suspenso de forma preventiva" },
              { icon: LockOpen, text: "Sua identidade fica visível só para a equipe, não é anônima aqui" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <Icon size={14} color={colors.mutedForeground} style={{ marginTop: 1, flexShrink: 0 }} />
                  <span style={{ fontFamily: fontBody, fontSize: 11, color: colors.mutedForeground }}>{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            width: "100%",
            textAlign: "center",
            background: "none",
            border: "none",
            color: colors.mutedForeground,
            fontFamily: fontBody,
            fontSize: 11,
            marginTop: 16,
            cursor: "pointer",
          }}
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

// Modal de motivo — caminho "não" do fluxograma (fluxo padrão): denúncia
// registrada de forma anônima, entra numa fila de análise administrativa.
// Selecionar "Risco imediato" desvia para o EmergencyFlow (caminho "sim").
export const ReportModal = ({ agendamentoId, papel, onClose }) => {
  const [motivo, setMotivo] = useState("endereco_invalido");
  const [descricao, setDescricao] = useState("");
  const [enviado, setEnviado] = useState(false);

  if (motivo === "risco_imediato") {
    return <EmergencyFlow onClose={onClose} />;
  }

  const handleSubmit = () => {
    // POST /api/denuncias { agendamentoId, papel, tipoMotivo: motivo, descricao }
    // A identidade do denunciante nunca é enviada como campo direto — o
    // backend associa via token de sessão, mantendo a denúncia anônima
    // perante o profissional e a equipe (fluxo padrão do fluxograma).
    setEnviado(true);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "hsl(var(--foreground-hsl) / 0.45)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        zIndex: 60,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 380,
          background: colors.card,
          borderRadius: "24px 24px 0 0",
          padding: "20px 24px 28px",
        }}
      >
        <div style={{ width: 40, height: 4, borderRadius: 2, background: colors.border, margin: "0 auto 16px" }} />
        {enviado ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "hsl(var(--primary-hsl) / 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 14px",
              }}
            >
              <CheckCircle2 size={26} color={colors.primary} />
            </div>
            <p
              style={{
                fontFamily: fontBody,
                fontSize: 14,
                fontWeight: 700,
                color: colors.foreground,
                margin: "0 0 6px",
              }}
            >
              Denúncia recebida
            </p>
            <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>
              Sua identidade fica protegida perante o profissional e a equipe do Kira.
            </p>
            <SecondaryButton onClick={onClose}>Fechar</SecondaryButton>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2
                style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 17, color: colors.foreground, margin: 0 }}
              >
                Reportar problema
              </h2>
              <button
                onClick={onClose}
                aria-label="Fechar"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: colors.mutedForeground,
                  padding: 0,
                }}
              >
                <X size={18} />
              </button>
            </div>

            <Field label="Motivo">
              <select value={motivo} onChange={(e) => setMotivo(e.target.value)} style={inputStyle(false)}>
                {reportMotivoOptions.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Descreva o ocorrido (opcional)">
              <textarea
                rows={3}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Conte o que aconteceu"
                style={{ ...inputStyle(false), resize: "none" }}
              />
            </Field>

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                padding: 10,
                borderRadius: 12,
                background: "hsl(var(--destructive-hsl) / 0.08)",
                marginBottom: 14,
              }}
            >
              <AlertTriangle size={15} color={colors.destructive} style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontFamily: fontBody, fontSize: 11, color: colors.destructive }}>
                Em caso de risco imediato, ligue 190 antes de qualquer outra coisa.
              </span>
            </div>

            <p style={{ fontFamily: fontBody, fontSize: 10, color: colors.mutedForeground, margin: "0 0 14px" }}>
              Sua identidade fica protegida perante o profissional e a equipe do Kira.
            </p>

            <button
              onClick={handleSubmit}
              style={{
                width: "100%",
                padding: 13,
                borderRadius: 12,
                border: "none",
                background: colors.destructive,
                color: "var(--color-background)",
                fontFamily: fontBody,
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Enviar denúncia anônima
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// Botão reutilizável de denúncia — ponto de entrada do fluxograma ("Aciona
// denúncia"). `papel` distingue se quem denuncia é cliente ou profissional;
// `agendamentoId` é opcional (nem toda tela tem um atendimento associado).
export const ReportButton = ({ agendamentoId, papel }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: 12,
          borderRadius: 12,
          border: `1px solid hsl(var(--destructive-hsl) / 0.35)`,
          background: "transparent",
          color: colors.destructive,
          fontFamily: fontBody,
          fontWeight: 600,
          fontSize: 13,
          cursor: "pointer",
        }}
      >
        <ShieldAlert size={16} /> Reportar problema de segurança
      </button>
      {open && <ReportModal agendamentoId={agendamentoId} papel={papel} onClose={() => setOpen(false)} />}
    </>
  );
};
