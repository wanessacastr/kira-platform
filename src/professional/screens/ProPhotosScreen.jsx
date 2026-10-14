// Cadastro: fotos do trabalho · FileReader local
import { ImagePlus, X } from "lucide-react";
import { useKira } from "../../context/KiraContext";
import { Header, PrimaryButton, StepDots } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay } from "../../shared/theme";

export default function ProPhotosScreen() {
  const { handleWorkPhotos, pErrors, pForm, pWorkPhotosInputRef, removeWorkPhoto, setPErrors, setScreen } = useKira();
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <StepDots total={8} done={7} />
      <Header onBack={() => setScreen("proServices")} />
      <div style={{ flex: 1, padding: "0 var(--space-24) var(--space-32)", overflowY: "auto" }}>
        <h1
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: 22,
            color: colors.foreground,
            margin: "var(--space-4) 0 var(--space-4)",
          }}
        >
          Fotos
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: 12,
            color: colors.mutedForeground,
            margin: "0 0 var(--space-18)",
          }}
        >
          Mostre seu estabelecimento e trabalhos. Sem limite de fotos.
        </p>

        <input
          ref={pWorkPhotosInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={(e) => handleWorkPhotos(e.target.files)}
        />
        <button
          onClick={() => pWorkPhotosInputRef.current?.click()}
          style={{
            width: "100%",
            padding: "var(--space-26)",
            borderRadius: "var(--radius-2xl)",
            border: `2px dashed ${pErrors.workPhotos ? colors.destructive : colors.border}`,
            background: colors.muted,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--space-6)",
            cursor: "pointer",
            marginBottom: "var(--space-14)",
          }}
        >
          <ImagePlus size={26} color={colors.mutedForeground} />
          <span style={{ fontSize: 13, fontWeight: 600, color: colors.primary, fontFamily: fontBody }}>
            Adicionar fotos
          </span>
          <span
            style={{
              fontSize: 11,
              color: colors.mutedForeground,
              fontFamily: fontBody,
              textAlign: "center",
            }}
          >
            Estabelecimento e trabalhos realizados. Sem limite.
          </span>
        </button>
        {pErrors.workPhotos && (
          <p
            style={{
              fontSize: 11,
              color: colors.destructive,
              fontFamily: fontBody,
              margin: "-var(--space-8) 0 var(--space-10)",
            }}
          >
            {pErrors.workPhotos}
          </p>
        )}

        {pForm.workPhotos.length > 0 && (
          <div>
            <p
              style={{
                fontSize: 11,
                color: colors.mutedForeground,
                fontFamily: fontBody,
                margin: "0 0 var(--space-8)",
              }}
            >
              Fotos adicionadas ({pForm.workPhotos.length})
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--space-8)" }}>
              {pForm.workPhotos.map((photo, idx) => (
                <div
                  key={idx}
                  style={{
                    position: "relative",
                    aspectRatio: "1",
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={photo}
                    alt={`Foto ${idx + 1}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div
                    onClick={() => removeWorkPhoto(idx)}
                    style={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "hsl(var(--white-hsl) / 0.85)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <X size={12} color={colors.foreground} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: "var(--space-16)" }}>
          <PrimaryButton
            onClick={() => {
              if (pForm.workPhotos.length === 0) {
                setPErrors({ workPhotos: "Adicione pelo menos uma foto" });
                return;
              }
              setScreen("proTerms");
            }}
          >
            Continuar
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
