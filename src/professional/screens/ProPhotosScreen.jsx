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
          Fotos
        </h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>
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
            padding: 26,
            borderRadius: 16,
            border: `2px dashed ${pErrors.workPhotos ? colors.destructive : colors.border}`,
            background: colors.muted,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            cursor: "pointer",
            marginBottom: 14,
          }}
        >
          <ImagePlus size={26} color={colors.mutedForeground} />
          <span style={{ fontSize: 13, fontWeight: 600, color: colors.primary, fontFamily: fontBody }}>
            Adicionar fotos
          </span>
          <span style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: fontBody, textAlign: "center" }}>
            Estabelecimento e trabalhos realizados. Sem limite.
          </span>
        </button>
        {pErrors.workPhotos && (
          <p style={{ fontSize: 11, color: colors.destructive, fontFamily: fontBody, margin: "-8px 0 10px" }}>
            {pErrors.workPhotos}
          </p>
        )}

        {pForm.workPhotos.length > 0 && (
          <div>
            <p style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: fontBody, margin: "0 0 8px" }}>
              Fotos adicionadas ({pForm.workPhotos.length})
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {pForm.workPhotos.map((photo, idx) => (
                <div key={idx} style={{ position: "relative", aspectRatio: "1", borderRadius: 10, overflow: "hidden" }}>
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
                      background: "rgba(255,255,255,0.85)",
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

        <div style={{ marginTop: 16 }}>
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
