// "Estou a caminho": gera e mostra o código de confirmação presencial · API: api.arrival (rotas ainda não existem no backend)
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Copy, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../../shared/api";
import { ErrorState } from "../../shared/components/states";
import { PrimaryButton, SecondaryButton } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay } from "../../shared/theme";
import { generationErrorMessage } from "../../shared/utils/arrival";

const WATCH_MS = 8000;
const card = {
  padding: "var(--space-16)",
  borderRadius: "var(--radius-2xl)",
  border: `1px solid ${colors.border}`,
  background: colors.card,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "var(--space-10)",
  textAlign: "center",
};
const small = { fontFamily: fontBody, fontSize: "var(--font-size-xs)", color: colors.mutedForeground, margin: 0 };

const timeLeft = (expiresAt, now) => {
  const s = Math.max(0, Math.ceil((expiresAt - now) / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

// O código vive só na memória da consulta: não vai para localStorage nem para log
export function ArrivalCode({ appointment }) {
  const queryClient = useQueryClient();
  const [now, setNow] = useState(() => Date.now());
  const [copied, setCopied] = useState(false);
  const confirmed = appointment.rawStatus === "CHEGADA_CONFIRMADA";
  const canGenerate = appointment.rawStatus === "CONFIRMADO";
  const tokenKey = ["arrivalToken", appointment.id];
  const stored = useQuery({
    queryKey: tokenKey,
    queryFn: () => api.arrival.getToken(appointment.id),
    enabled: canGenerate,
    retry: false,
  });
  const generate = useMutation({
    mutationFn: () => api.arrival.requestToken(appointment.id),
    onSuccess: (token) => queryClient.setQueryData(tokenKey, token),
  });
  const token = stored.data ?? null;
  const expired = Boolean(token?.expiresAt && token.expiresAt.getTime() <= now);
  const live = Boolean(token) && !expired;

  // Relógio da validade e, com o código à mostra, confere se o profissional já validou
  useEffect(() => {
    if (!live) return undefined;
    const tick = setInterval(() => setNow(Date.now()), 1000);
    const watch = setInterval(() => queryClient.invalidateQueries({ queryKey: ["appointments"] }), WATCH_MS);
    return () => {
      clearInterval(tick);
      clearInterval(watch);
    };
  }, [live, queryClient]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(token.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  if (confirmed) {
    return (
      <div role="status" style={card}>
        <Check size={28} color={colors.primaryText} aria-hidden="true" />
        <p style={{ ...small, color: colors.foreground, fontWeight: 700, fontSize: "var(--font-size-sm)" }}>
          Chegada confirmada! Seu atendimento está pronto para começar.
        </p>
      </div>
    );
  }
  if (!canGenerate) return null;
  if (stored.isLoading) return <p style={small}>Verificando seu código...</p>;
  if (stored.isError) {
    return <ErrorState onRetry={() => stored.refetch()} message={generationErrorMessage(stored.error)} />;
  }

  if (live) {
    return (
      <section aria-label="Código de confirmação" style={card}>
        <h2 style={{ ...small, fontFamily: fontDisplay, fontWeight: 700, color: colors.foreground }}>
          Seu código de confirmação
        </h2>
        <p
          aria-label={`Código ${token.code.split("").join(" ")}`}
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: "var(--font-size-3xl)",
            letterSpacing: "0.3em",
            color: colors.primaryText,
            margin: 0,
          }}
        >
          {token.code}
        </p>
        <SecondaryButton onClick={copy}>
          {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}{" "}
          {copied ? "Código copiado" : "Copiar código"}
        </SecondaryButton>
        {token.expiresAt && <p style={small}>Válido por mais {timeLeft(token.expiresAt, now)}.</p>}
        <p style={small}>Apresente este código ao profissional quando chegar para confirmar sua presença.</p>
      </section>
    );
  }

  return (
    <section aria-label="Estou a caminho" style={card}>
      {expired && (
        <p role="alert" style={{ ...small, color: colors.destructiveText }}>
          Seu código expirou. Gere um novo quando estiver chegando.
        </p>
      )}
      {generate.isError && (
        <p role="alert" style={{ ...small, color: colors.destructiveText }}>
          {generationErrorMessage(generate.error)}
        </p>
      )}
      <div style={{ width: "100%" }}>
        <PrimaryButton disabled={generate.isPending} onClick={() => generate.mutate()}>
          <MapPin size={15} aria-hidden="true" />{" "}
          {generate.isPending ? "Gerando código..." : expired ? "Gerar novo código" : "Estou a caminho"}
        </PrimaryButton>
      </div>
    </section>
  );
}
