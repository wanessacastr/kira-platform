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
      <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
        <h1
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: 22,
            color: colors.foreground,
            margin: "4px 0 4px",
          }}
        >
          Serviços
        </h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>
          Cadastre os serviços que você oferece, com valor e tempo estimado.
        </p>

        <div style={{ padding: 12, borderRadius: 14, border: `1px solid ${colors.border}`, marginBottom: 14 }}>
          <Field label="Nome do serviço">
            <input
              value={serviceDraft.name}
              onChange={(e) => setServiceDraft((s) => ({ ...s, name: e.target.value }))}
              placeholder="Ex.: Corte feminino"
              style={inputStyle(false)}
            />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
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
          <p style={{ fontSize: 11, color: colors.destructive, fontFamily: fontBody, margin: "0 0 10px" }}>
            {pErrors.services}
          </p>
        )}

        {pForm.services.length > 0 && (
          <div>
            <p style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: fontBody, margin: "0 0 8px" }}>
              Serviços cadastrados ({pForm.services.length})
            </p>
            {pForm.services.map((s) => (
              <div
                key={s.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: `1px solid ${colors.border}`,
                  marginBottom: 8,
                }}
              >
                <div>
                  <p
                    style={{ fontSize: 12, fontWeight: 600, color: colors.foreground, fontFamily: fontBody, margin: 0 }}
                  >
                    {s.name}
                  </p>
                  <p style={{ fontSize: 10, color: colors.mutedForeground, fontFamily: fontBody, margin: 0 }}>
                    {s.duration}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: colors.primary, fontFamily: fontBody }}>
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

        <div style={{ marginTop: 8 }}>
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
