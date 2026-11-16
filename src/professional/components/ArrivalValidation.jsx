// "Confirmar chegada": o profissional digita o código que a cliente mostra · API: api.arrival (rotas ainda não existem no backend)
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useState } from "react";
import { api } from "../../shared/api";
import { inputStyle } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay } from "../../shared/theme";
import { arrivalDigits, isArrivalCodeComplete, validationErrorMessage } from "../../shared/utils/arrival";

const text = { fontFamily: fontBody, fontSize: "var(--font-size-xs)", margin: 0 };

export function ArrivalValidation({ appointment, onClose }) {
  const queryClient = useQueryClient();
  const [code, setCode] = useState("");
  const validate = useMutation({
    mutationFn: () => api.arrival.validateToken({ appointmentId: appointment.id, code }),
    onSuccess: () => {
      setCode("");
      return queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
  const done = validate.isSuccess;
  const submit = (e) => {
    e.preventDefault();
    if (!isArrivalCodeComplete(code) || validate.isPending) return;
    validate.mutate();
  };
  return (
    <form
      onSubmit={submit}
      aria-label="Confirmar chegada"
      style={{
        marginTop: "var(--space-10)",
        padding: "var(--space-12)",
        borderRadius: "var(--radius-xl)",
        background: colors.muted,
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-8)",
      }}
    >
      <h3
        style={{
          ...text,
          fontFamily: fontDisplay,
          fontWeight: 700,
          fontSize: "var(--font-size-sm)",
          color: colors.foreground,
        }}
      >
        Confirmar chegada
      </h3>
      {done ? (
        <p role="status" style={{ ...text, color: colors.primaryText, fontWeight: 700 }}>
          <Check size={14} aria-hidden="true" /> Chegada confirmada. O atendimento já pode começar.
        </p>
      ) : (
        <>
          <label htmlFor={`arrival-${appointment.id}`} style={{ ...text, color: colors.mutedForeground }}>
            Solicite ao cliente o código apresentado no aplicativo Kira.
          </label>
          <input
            id={`arrival-${appointment.id}`}
            value={code}
            onChange={(e) => {
              setCode(arrivalDigits(e.target.value));
              if (validate.isError) validate.reset();
            }}
            inputMode="numeric"
            autoComplete="off"
            maxLength={6}
            placeholder="000000"
            aria-invalid={validate.isError}
            style={{ ...inputStyle(validate.isError), textAlign: "center", letterSpacing: "0.3em" }}
          />
          {validate.isError && (
            <p role="alert" style={{ ...text, color: colors.destructiveText }}>
              {validationErrorMessage(validate.error)}
            </p>
          )}
          <button
            type="submit"
            disabled={!isArrivalCodeComplete(code) || validate.isPending}
            style={{
              padding: "var(--space-10) var(--space-12)",
              borderRadius: "var(--radius-lg)",
              border: "none",
              background: colors.primary,
              color: colors.primaryForeground,
              fontFamily: fontBody,
              fontSize: "var(--font-size-xs)",
              fontWeight: 700,
              cursor: "pointer",
              opacity: !isArrivalCodeComplete(code) || validate.isPending ? 0.6 : 1,
            }}
          >
            {validate.isPending ? "Validando..." : "Validar código"}
          </button>
        </>
      )}
      <button
        type="button"
        onClick={onClose}
        style={{
          ...text,
          background: "none",
          border: "none",
          color: colors.mutedForeground,
          cursor: "pointer",
          minHeight: 36,
        }}
      >
        {done ? "Fechar" : "Cancelar"}
      </button>
    </form>
  );
}
