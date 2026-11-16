// Perfil: contatos de emergência (até 5): lista, cadastro e remoção · API: kira-backend (api.emergencyContacts)
import { Phone, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import { useSession } from "../../context/SessionContext";
import { errorMessage } from "../../shared/api";
import { ScreenFrame } from "../../shared/components/ScreenFrame";
import { ErrorState, SkeletonLoading } from "../../shared/components/states";
import { Field, PrimaryButton, inputStyle } from "../../shared/components/ui";
import { emergencyContactSchema } from "../../shared/schemas/forms";
import { colors, fontBody } from "../../shared/theme";
import { formatPhone, onlyDigits } from "../../shared/utils/format";
import { MAX_EMERGENCY_CONTACTS, useEmergencyContacts } from "../hooks/useEmergencyContacts";

const text = { fontFamily: fontBody, fontSize: "var(--font-size-xs)", margin: 0 };
const empty = { name: "", phone: "", relationship: "" };

export default function ClientEmergencyContactsScreen() {
  const { setScreen } = useSession();
  const { list, create, remove } = useEmergencyContacts();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const contacts = list.data ?? [];
  const full = contacts.length >= MAX_EMERGENCY_CONTACTS;
  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: field === "phone" ? formatPhone(e.target.value) : e.target.value }));
    setErrors((er) => ({ ...er, [field]: undefined }));
    if (create.isError) create.reset();
  };
  const submit = (e) => {
    e.preventDefault();
    const result = emergencyContactSchema.safeParse(form);
    if (!result.success) {
      setErrors(Object.fromEntries(result.error.issues.map((i) => [i.path[0], i.message])));
      return;
    }
    create.mutate(
      { name: form.name, phone: onlyDigits(form.phone), relationship: form.relationship },
      { onSuccess: () => setForm(empty) },
    );
  };
  return (
    <ScreenFrame
      onBack={() => setScreen("clientProfile")}
      title="Contatos de emergência"
      subtitle={`Pessoas de confiança para ligar rápido se você precisar (até ${MAX_EMERGENCY_CONTACTS}).`}
    >
      {list.isLoading ? (
        <SkeletonLoading count={2} />
      ) : list.isError ? (
        <ErrorState
          onRetry={() => list.refetch()}
          message={errorMessage(list.error, "Não foi possível carregar seus contatos agora.")}
        />
      ) : (
        <>
          {contacts.length === 0 ? (
            <p style={{ ...text, color: colors.mutedForeground, margin: "0 0 var(--space-18)" }}>
              Você ainda não cadastrou nenhum contato.
            </p>
          ) : (
            <ul
              style={{
                listStyle: "none",
                margin: "0 0 var(--space-18)",
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-8)",
              }}
            >
              {contacts.map((c) => (
                <li
                  key={c.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-10)",
                    padding: "var(--space-12)",
                    borderRadius: "var(--radius-2xl)",
                    border: `1px solid ${colors.border}`,
                    background: colors.card,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ ...text, fontSize: "var(--font-size-sm)", fontWeight: 700, color: colors.foreground }}>
                      {c.name}
                    </p>
                    <p style={{ ...text, color: colors.mutedForeground }}>
                      {formatPhone(c.phone)}
                      {c.relationship ? ` · ${c.relationship}` : ""}
                    </p>
                  </div>
                  <a
                    href={`tel:${onlyDigits(c.phone)}`}
                    aria-label={`Ligar para ${c.name}`}
                    style={{
                      minWidth: 44,
                      minHeight: 44,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Phone size={18} color={colors.primaryText} />
                  </a>
                  <button
                    type="button"
                    aria-label={`Remover ${c.name}`}
                    disabled={remove.isPending}
                    onClick={() => remove.mutate(c.id)}
                    style={{ minWidth: 44, minHeight: 44, border: "none", background: "none", cursor: "pointer" }}
                  >
                    <Trash2 size={18} color={colors.destructiveText} />
                  </button>
                </li>
              ))}
            </ul>
          )}
          {remove.isError && (
            <p role="alert" style={{ ...text, color: colors.destructiveText, margin: "0 0 var(--space-12)" }}>
              {errorMessage(remove.error, "Não foi possível remover o contato agora.")}
            </p>
          )}
          {full ? (
            <p style={{ ...text, color: colors.mutedForeground }}>
              Você chegou ao limite de {MAX_EMERGENCY_CONTACTS} contatos. Remova um para adicionar outro.
            </p>
          ) : (
            <form onSubmit={submit} noValidate aria-label="Novo contato de emergência">
              <Field label="Nome" error={errors.name}>
                <input value={form.name} onChange={set("name")} autoComplete="off" style={inputStyle(!!errors.name)} />
              </Field>
              <Field label="Telefone" error={errors.phone}>
                <input
                  value={form.phone}
                  onChange={set("phone")}
                  inputMode="tel"
                  placeholder="(62) 99999-9999"
                  style={inputStyle(!!errors.phone)}
                />
              </Field>
              <Field label="Parentesco (opcional)" error={errors.relationship}>
                <input
                  value={form.relationship}
                  onChange={set("relationship")}
                  style={inputStyle(!!errors.relationship)}
                />
              </Field>
              {create.isError && (
                <p role="alert" style={{ ...text, color: colors.destructiveText, margin: "0 0 var(--space-12)" }}>
                  {errorMessage(create.error, "Não foi possível salvar o contato agora.")}
                </p>
              )}
              <PrimaryButton type="submit" disabled={create.isPending}>
                <UserPlus size={15} aria-hidden="true" /> {create.isPending ? "Salvando..." : "Adicionar contato"}
              </PrimaryButton>
            </form>
          )}
        </>
      )}
    </ScreenFrame>
  );
}
