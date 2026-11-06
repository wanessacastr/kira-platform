// Gerenciar funcionárias do estúdio · API: kira-backend (POST/PUT/DELETE /api/empresas/{id}/funcionarias)
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Power } from "lucide-react";
import { useSession } from "../../context/SessionContext";
import { api, errorMessage } from "../../shared/api";
import { Card } from "../../shared/components/primitives";
import { ErrorState, SkeletonLoading } from "../../shared/components/states";
import { Field, Header, PrimaryButton, SecondaryButton, inputStyle } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay } from "../../shared/theme";
import { useBusinessStaff } from "../hooks/useBusinessData";

const emptyForm = { name: "", specialties: "", commissionPercent: "" };

function validate(f) {
  const errors = {};
  if (!f.name.trim()) errors.name = "Informe o nome";
  const commission = f.commissionPercent === "" ? null : Number(String(f.commissionPercent).replace(",", "."));
  if (commission !== null && !(commission >= 0 && commission <= 100))
    errors.commissionPercent = "Use um valor de 0 a 100";
  return errors;
}

function StaffForm({ initial, onDone }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const save = useMutation({
    mutationFn: () => {
      const staff = {
        name: form.name,
        photo: form.photo ?? null,
        specialties: form.specialties,
        commissionPercent: form.commissionPercent === "" ? null : String(form.commissionPercent).replace(",", "."),
      };
      return form.id ? api.staff.update({ id: form.id, ...staff }) : api.staff.create(staff);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["staff"] });
      onDone();
    },
  });
  const submit = () => {
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length === 0) save.mutate();
  };
  return (
    <Card>
      <Field label="Nome" error={errors.name}>
        <input value={form.name} onChange={set("name")} style={inputStyle(errors.name)} />
      </Field>
      <Field label="Especialidades (opcional)">
        <input value={form.specialties} onChange={set("specialties")} style={inputStyle()} />
      </Field>
      <Field label="Comissão % (opcional)" error={errors.commissionPercent}>
        <input
          value={form.commissionPercent}
          onChange={set("commissionPercent")}
          inputMode="decimal"
          style={inputStyle(errors.commissionPercent)}
        />
      </Field>
      {save.error && (
        <p
          role="alert"
          style={{ fontFamily: fontBody, fontSize: "var(--font-size-xs)", color: colors.destructiveText }}
        >
          {errorMessage(save.error)}
        </p>
      )}
      <div style={{ display: "flex", gap: "var(--space-10)" }}>
        <div style={{ flex: 1 }}>
          <SecondaryButton onClick={onDone}>Cancelar</SecondaryButton>
        </div>
        <div style={{ flex: 1 }}>
          <PrimaryButton onClick={submit} disabled={save.isPending}>
            {save.isPending ? "Salvando..." : "Salvar"}
          </PrimaryButton>
        </div>
      </div>
    </Card>
  );
}

const iconButton = {
  width: 34,
  height: 34,
  borderRadius: "var(--radius-round)",
  border: `1px solid ${colors.border}`,
  background: colors.card,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  flexShrink: 0,
};

export default function ProStaffScreen() {
  const { setScreen } = useSession();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);
  const query = useBusinessStaff();
  // O backend só desativa; não há rota para reativar
  const deactivate = useMutation({
    mutationFn: (s) => api.staff.deactivate(s.id),
    onSuccess: () => {
      setConfirmingId(null);
      return queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });
  const staff = (query.data ?? []).filter((s) => s.active);
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("proProfileMenu")} />
      <div style={{ flex: 1, padding: "0 var(--space-24) var(--space-32)", overflowY: "auto" }}>
        <h1
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: "var(--font-size-2xl)",
            color: colors.foreground,
            margin: "var(--space-4) 0 var(--space-16)",
          }}
        >
          Minha equipe
        </h1>
        {editing ? (
          <StaffForm initial={editing} onDone={() => setEditing(null)} />
        ) : (
          <PrimaryButton onClick={() => setEditing(emptyForm)}>
            <Plus size={15} /> Nova funcionária
          </PrimaryButton>
        )}
        <div style={{ marginTop: "var(--space-14)" }}>
          {query.isLoading ? (
            <SkeletonLoading count={3} />
          ) : query.isError ? (
            <ErrorState onRetry={query.refetch} message="Não foi possível carregar sua equipe." />
          ) : staff.length === 0 ? (
            <p style={{ fontFamily: fontBody, fontSize: "var(--font-size-sm)", color: colors.mutedForeground }}>
              Nenhuma funcionária cadastrada ainda.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
              {staff.map((s) => (
                <div
                  key={s.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-10)",
                    padding: "var(--space-12) var(--space-14)",
                    borderRadius: "var(--radius-xl)",
                    border: `1px solid ${colors.border}`,
                    background: colors.card,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        margin: 0,
                        fontFamily: fontBody,
                        fontWeight: 700,
                        fontSize: "var(--font-size-sm)",
                        color: colors.foreground,
                      }}
                    >
                      {s.name}
                    </p>
                    <p
                      style={{
                        margin: "var(--space-2) 0 0",
                        fontFamily: fontBody,
                        fontSize: "var(--font-size-xs)",
                        color: colors.mutedForeground,
                      }}
                    >
                      {[s.specialties, s.commissionPercent != null && `${s.commissionPercent}% de comissão`]
                        .filter(Boolean)
                        .join(" · ") || "Sem detalhes"}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Editar ${s.name}`}
                    style={iconButton}
                    onClick={() =>
                      setEditing({
                        id: s.id,
                        name: s.name,
                        photo: s.photo,
                        specialties: s.specialties,
                        commissionPercent: s.commissionPercent != null ? String(s.commissionPercent) : "",
                      })
                    }
                  >
                    <Pencil size={15} color={colors.mutedForeground} />
                  </button>
                  {confirmingId === s.id ? (
                    <button
                      type="button"
                      disabled={deactivate.isPending}
                      onClick={() => deactivate.mutate(s)}
                      style={{
                        ...iconButton,
                        width: "auto",
                        padding: "0 var(--space-10)",
                        fontFamily: fontBody,
                        fontSize: "var(--font-size-xs)",
                        color: colors.destructiveText,
                      }}
                    >
                      {deactivate.isPending ? "Desativando..." : "Confirmar"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      aria-label={`Desativar ${s.name}`}
                      style={iconButton}
                      onClick={() => setConfirmingId(s.id)}
                    >
                      <Power size={15} color={colors.destructiveText} />
                    </button>
                  )}
                </div>
              ))}
              {deactivate.error && (
                <p
                  role="alert"
                  style={{ fontFamily: fontBody, fontSize: "var(--font-size-xs)", color: colors.destructiveText }}
                >
                  {errorMessage(deactivate.error)}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
