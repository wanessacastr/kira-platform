// Gerenciar serviços do estúdio · API: kira-backend (POST/PUT/DELETE /api/empresas/{id}/servicos)
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Power } from "lucide-react";
import { useSession } from "../../context/SessionContext";
import { api, errorMessage } from "../../shared/api";
import { Card } from "../../shared/components/primitives";
import { ErrorState, SkeletonLoading } from "../../shared/components/states";
import { Field, Header, PrimaryButton, SecondaryButton, inputStyle } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay } from "../../shared/theme";
import { useQuery } from "@tanstack/react-query";

// Valores do enum CategoriaServico do backend; sem escolha, ele deduz pelo nome
const categories = [
  ["", "Automática (pelo nome)"],
  ["CABELO", "Cabelo"],
  ["BARBA", "Barba"],
  ["UNHAS", "Unhas"],
  ["CILIOS", "Cílios"],
  ["SOBRANCELHAS", "Sobrancelhas"],
  ["MAQUIAGEM", "Maquiagem"],
  ["ESTETICA", "Estética"],
  ["MASSAGEM", "Massagem"],
  ["OUTRO", "Outro"],
];

const emptyForm = { name: "", description: "", durationMinutes: "", price: "", category: "" };
const toPrice = (v) => Number(String(v).replace(",", "."));

function validate(f) {
  const errors = {};
  if (!f.name.trim()) errors.name = "Informe o nome do serviço";
  if (!(Number(f.durationMinutes) > 0)) errors.durationMinutes = "Informe a duração em minutos";
  if (!(toPrice(f.price) > 0)) errors.price = "Informe um preço maior que zero";
  return errors;
}

function ServiceForm({ initial, onDone }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const save = useMutation({
    mutationFn: () => {
      const service = {
        name: form.name,
        description: form.description,
        durationMinutes: Number(form.durationMinutes),
        price: toPrice(form.price),
        category: form.category || null,
      };
      return form.id ? api.services.update({ id: form.id, ...service }) : api.services.create(service);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["services"] });
      await queryClient.invalidateQueries({ queryKey: ["professionals"] });
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
      <Field label="Nome do serviço" error={errors.name}>
        <input value={form.name} onChange={set("name")} style={inputStyle(errors.name)} />
      </Field>
      <Field label="Descrição (opcional)">
        <input value={form.description} onChange={set("description")} style={inputStyle()} />
      </Field>
      <div style={{ display: "flex", gap: "var(--space-10)" }}>
        <div style={{ flex: 1 }}>
          <Field label="Duração (min)" error={errors.durationMinutes}>
            <input
              value={form.durationMinutes}
              onChange={set("durationMinutes")}
              inputMode="numeric"
              style={inputStyle(errors.durationMinutes)}
            />
          </Field>
        </div>
        <div style={{ flex: 1 }}>
          <Field label="Preço (R$)" error={errors.price}>
            <input value={form.price} onChange={set("price")} inputMode="decimal" style={inputStyle(errors.price)} />
          </Field>
        </div>
      </div>
      <Field label="Categoria">
        <select value={form.category} onChange={set("category")} style={inputStyle()}>
          {categories.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
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

export default function ProManageServicesScreen() {
  const { setScreen } = useSession();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null); // null | form inicial
  const query = useQuery({ queryKey: ["services", "business"], queryFn: api.services.listForMyBusiness });
  const [confirmingId, setConfirmingId] = useState(null);
  // O backend só desativa; não há rota para reativar. O serviço continua no histórico.
  const deactivate = useMutation({
    mutationFn: (s) => api.services.deactivate(s.id),
    onSuccess: () => {
      setConfirmingId(null);
      return queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
  const services = query.data ?? [];
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
            margin: "var(--space-4) 0 var(--space-4)",
          }}
        >
          Meus serviços
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            margin: "0 0 var(--space-16)",
          }}
        >
          Ao desativar, o serviço some da busca, mas continua no histórico dos agendamentos.
        </p>
        {editing ? (
          <ServiceForm initial={editing} onDone={() => setEditing(null)} />
        ) : (
          <div style={{ marginBottom: "var(--space-14)" }}>
            <PrimaryButton onClick={() => setEditing(emptyForm)}>
              <Plus size={15} /> Novo serviço
            </PrimaryButton>
          </div>
        )}
        {query.isLoading ? (
          <SkeletonLoading count={3} />
        ) : query.isError ? (
          <ErrorState onRetry={query.refetch} message="Não foi possível carregar seus serviços." />
        ) : services.length === 0 ? (
          <p style={{ fontFamily: fontBody, fontSize: "var(--font-size-sm)", color: colors.mutedForeground }}>
            Nenhum serviço cadastrado ainda.
          </p>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)", marginTop: "var(--space-14)" }}
          >
            {services.map((s) => (
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
                    {s.durationMinutes} min · R$ {s.price.toFixed(2)}
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
                      description: s.description,
                      durationMinutes: String(s.durationMinutes),
                      price: String(s.price),
                      category: s.category ?? "",
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
  );
}
