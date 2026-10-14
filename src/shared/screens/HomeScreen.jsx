// Placeholder pós-cadastro com botão de reiniciar o protótipo · API: nenhuma
import { useKira } from "../../context/KiraContext";
import { PrimaryButton } from "../components/ui";
import { initialClientForm, initialProForm } from "../data/forms";
import { colors, fontBody, fontDisplay } from "../theme";

export default function HomeScreen() {
  const {
    setCErrors,
    setCForm,
    setCLocationStatus,
    setCPreferences,
    setFaceStatus,
    setPErrors,
    setPForm,
    setPLocationStatus,
    setScreen,
  } = useKira();
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: 24 }}>
      <p style={{ fontFamily: fontDisplay, fontSize: 20, fontWeight: 700, color: colors.foreground, margin: 0 }}>Bem-vinda! ✨</p>
      <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, textAlign: "center", margin: 0 }}>A partir daqui entra a Home real do app (fora do escopo deste protótipo).</p>
      <div style={{ width: "100%", maxWidth: 240 }}>
        <PrimaryButton
          onClick={() => {
            setCForm(initialClientForm); setCErrors({});
            setPForm(initialProForm); setPErrors({});
            setFaceStatus("idle"); setCLocationStatus("idle"); setPLocationStatus("idle"); setCPreferences([]);
            setScreen("splash");
          }}
        >
          Reiniciar protótipo
        </PrimaryButton>
      </div>
    </div>
  );
}
