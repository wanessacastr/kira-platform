// Cadastro: serviços com valor e duração · estado local
import { Plus, Trash2 } from "lucide-react";
import { useKira } from "../../context/KiraContext";
import { Field, Header, PrimaryButton, SecondaryButton, StepDots, inputStyle } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay } from "../../shared/theme";

export default function ProServicesScreen() {
  const { addService, pErrors, pForm, removeService, serviceDraft, setPErrors, setScreen, setServiceDraft } = useKira();
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <StepDots total={8} done={6} />
      <Header onBack={() => setScreen("proSpecialties")} />
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
          Serviços
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            margin: "0 0 var(--space-18)",
          }}
        >
          Cadastre os serviços que você oferece, com valor e tempo estimado.
        </p>

        <div
          style={{
            padding: "var(--space-12)",
            borderRadius: "var(--radius-xl)",
            border: `1px solid ${colors.border}`,
            marginBottom: "var(--space-14)",
          }}
        >
          <Field label="Nome do serviço">
            <input
              value={serviceDraft.name}
              onChange={(e) => setServiceDraft((s) => ({ ...s, name: e.target.value }))}
              placeholder="Ex.: Corte feminino"
              style={inputStyle(false)}
            />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-10)" }}>
            <Field label="Valor (R$)">
              <input
                value={serviceDraft.price}
                onChange={(e) => setServiceDraft((s) => ({ ...s, price: e.target.value }))}
                placeholder="Ex.: 80"
                style={inputStyle(false)}
              />
            </Field>
            <Field label="Tempo estimado">
              <input
                value={serviceDraft.duration}
                onChange={(e) => setServiceDraft((s) => ({ ...s, duration: e.target.value }))}
                placeholder="Ex.: 45 min"
                style={inputStyle(false)}
              />
            </Field>
          </div>
          <SecondaryButton onClick={addService}>
            <Plus size={15} /> Adicionar serviço
          </SecondaryButton>
        </div>

        {pErrors.services && (
          <p
            style={{
              fontSize: "var(--font-size-xs)",
              color: colors.destructiveText,
              fontFamily: fontBody,
              margin: "0 0 var(--space-10)",
            }}
          >
            {pErrors.services}
          </p>
        )}

        {pForm.services.length > 0 && (
          <div>
            <p
              style={{
                fontSize: "var(--font-size-xs)",
                color: colors.mutedForeground,
                fontFamily: fontBody,
                margin: "0 0 var(--space-8)",
              }}
            >
              Serviços cadastrados ({pForm.services.length})
            </p>
            {pForm.services.map((s) => (
              <div
                key={s.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "var(--space-10) var(--space-12)",
                  borderRadius: "var(--radius-lg)",
                  border: `1px solid ${colors.border}`,
                  marginBottom: "var(--space-8)",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: "var(--font-size-xs)",
                      fontWeight: 600,
                      color: colors.foreground,
                      fontFamily: fontBody,
                      margin: 0,
                    }}
                  >
                    {s.name}
                  </p>
                  <p
                    style={{
                      fontSize: "var(--font-size-xs)",
                      color: colors.mutedForeground,
                      fontFamily: fontBody,
                      margin: 0,
                    }}
                  >
                    {s.duration}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-10)" }}>
                  <span
                    style={{
                      fontSize: "var(--font-size-xs)",
                      fontWeight: 700,
                      color: colors.primaryText,
                      fontFamily: fontBody,
                    }}
                  >
                    R$ {s.price}
                  </span>
                  <Trash2
                    size={15}
                    color={colors.mutedForeground}
                    style={{ cursor: "pointer" }}
                    onClick={() => removeService(s.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: "var(--space-8)" }}>
          <PrimaryButton
            onClick={() => {
              if (pForm.services.length === 0) {
                setPErrors({ services: "Adicione pelo menos um serviço" });
                return;
              }
              setScreen("proPhotos");
            }}
          >
            Continuar
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
