// Cadastro: especialidades · estado local
import { Plus, Sparkles, X } from "lucide-react";
import { useKira } from "../../context/KiraContext";
import { Header, PrimaryButton, StepDots, inputStyle } from "../../shared/components/ui";
import { specialtySuggestions } from "../../shared/data/forms";
import { colors, fontBody, fontDisplay, gradientKira } from "../../shared/theme";

export default function ProSpecialtiesScreen() {
  const { addSpecialty, pErrors, pForm, removeSpecialty, setPErrors, setScreen, setSpecialtyInput, specialtyInput } =
    useKira();
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <StepDots total={8} done={5} />
      <Header onBack={() => setScreen("face")} />
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
          Especialidades
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            margin: "0 0 var(--space-18)",
          }}
        >
          Quais áreas você atende? Adicione quantas quiser.
        </p>

        <div style={{ display: "flex", gap: "var(--space-8)", marginBottom: "var(--space-8)" }}>
          <input
            value={specialtyInput}
            onChange={(e) => setSpecialtyInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSpecialty(specialtyInput);
              }
            }}
            placeholder="Ex.: Coloração, Design de sobrancelhas..."
            style={inputStyle(pErrors.specialties)}
          />
          <button
            onClick={() => addSpecialty(specialtyInput)}
            style={{
              width: 44,
              height: 44,
              borderRadius: "var(--radius-lg)",
              border: "none",
              background: gradientKira,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <Plus size={18} color={colors.primaryForeground} />
          </button>
        </div>
        {pErrors.specialties && (
          <p
            style={{
              fontSize: "var(--font-size-xs)",
              color: colors.destructiveText,
              fontFamily: fontBody,
              margin: "0 0 var(--space-10)",
            }}
          >
            {pErrors.specialties}
          </p>
        )}

        <p
          style={{
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            fontFamily: fontBody,
            margin: "var(--space-6) 0 var(--space-6)",
          }}
        >
          Sugestões
        </p>
        <div style={{ display: "flex", gap: "var(--space-6)", flexWrap: "wrap", marginBottom: "var(--space-14)" }}>
          {specialtySuggestions
            .filter((s) => !pForm.specialties.includes(s))
            .map((s) => (
              <span
                key={s}
                onClick={() => addSpecialty(s)}
                style={{
                  padding: "var(--space-6) var(--space-12)",
                  borderRadius: "var(--radius-pill)",
                  fontSize: "var(--font-size-xs)",
                  fontWeight: 500,
                  fontFamily: fontBody,
                  background: colors.muted,
                  color: colors.mutedForeground,
                  cursor: "pointer",
                }}
              >
                + {s}
              </span>
            ))}
        </div>

        {pForm.specialties.length > 0 && (
          <div>
            <p
              style={{
                fontSize: "var(--font-size-xs)",
                color: colors.mutedForeground,
                fontFamily: fontBody,
                margin: "0 0 var(--space-6)",
              }}
            >
              Suas especialidades ({pForm.specialties.length})
            </p>
            <div style={{ display: "flex", gap: "var(--space-6)", flexWrap: "wrap" }}>
              {pForm.specialties.map((s) => (
                <span
                  key={s}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-5)",
                    padding: "var(--space-6) var(--space-12)",
                    borderRadius: "var(--radius-pill)",
                    fontSize: "var(--font-size-xs)",
                    fontWeight: 600,
                    fontFamily: fontBody,
                    background: gradientKira,
                    color: colors.primaryForeground,
                  }}
                >
                  <Sparkles size={11} />
                  {s}
                  <X size={11} style={{ cursor: "pointer" }} onClick={() => removeSpecialty(s)} />
                </span>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: "var(--space-20)" }}>
          <PrimaryButton
            onClick={() => {
              if (pForm.specialties.length === 0) {
                setPErrors({ specialties: "Adicione pelo menos uma especialidade" });
                return;
              }
              setScreen("proServices");
            }}
          >
            Continuar
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
