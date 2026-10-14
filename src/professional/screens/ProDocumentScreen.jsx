// Cadastro: foto do documento · FileReader local, sem upload
import { useKira } from "../../context/KiraContext";
import { DocUploadBox, Header, PrimaryButton, StepDots } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay } from "../../shared/theme";

export default function ProDocumentScreen() {
  const { goToFace, handlePhoto, pDocBackRef, pDocFrontRef, pErrors, pForm, setPErrors, setPField, setScreen } =
    useKira();
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <StepDots total={8} done={4} />
      <Header onBack={() => setScreen("proLocation")} />
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
          Documento de identidade
        </h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>
          Envie a foto da frente e do verso do seu documento com foto.
        </p>
        <DocUploadBox
          label="Frente do documento"
          value={pForm.docFrontPhoto}
          error={pErrors.docFrontPhoto}
          inputRef={pDocFrontRef}
          onChange={(f) => handlePhoto(f, (v) => setPField("docFrontPhoto", v))}
        />
        <DocUploadBox
          label="Verso do documento"
          value={pForm.docBackPhoto}
          error={pErrors.docBackPhoto}
          inputRef={pDocBackRef}
          onChange={(f) => handlePhoto(f, (v) => setPField("docBackPhoto", v))}
        />
        <p
          style={{
            fontSize: 11,
            color: colors.mutedForeground,
            fontFamily: fontBody,
            textAlign: "center",
            margin: "0 0 12px",
          }}
        >
          Aceitamos RG, CNH ou outro documento oficial com foto.
        </p>
        <PrimaryButton
          onClick={() => {
            const e = {};
            if (!pForm.docFrontPhoto) e.docFrontPhoto = "Adicione a foto da frente do documento";
            if (!pForm.docBackPhoto) e.docBackPhoto = "Adicione a foto do verso do documento";
            if (Object.keys(e).length > 0) {
              setPErrors(e);
              return;
            }
            setPErrors({});
            goToFace("proDocument", "proSpecialties");
          }}
        >
          Continuar para verificação facial
        </PrimaryButton>
      </div>
    </div>
  );
}
