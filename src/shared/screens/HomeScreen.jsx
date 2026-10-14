// Placeholder pós-cadastro com botão de reiniciar o protótipo · API: nenhuma
import { useSignup } from "../../context/SignupContext";
import { useSession } from "../../context/SessionContext";
import { PrimaryButton } from "../components/ui";
import { colors, fontBody, fontDisplay } from "../theme";

export default function HomeScreen() {
  const { reset } = useSignup();
  const { setScreen } = useSession();
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--space-12)",
        padding: "var(--space-24)",
      }}
    >
      <p
        style={{
          fontFamily: fontDisplay,
          fontSize: "var(--font-size-xl)",
          fontWeight: 700,
          color: colors.foreground,
          margin: 0,
        }}
      >
        Bem-vinda! ✨
      </p>
      <p
        style={{
          fontFamily: fontBody,
          fontSize: "var(--font-size-xs)",
          color: colors.mutedForeground,
          textAlign: "center",
          margin: 0,
        }}
      >
        A partir daqui entra a Home real do app (fora do escopo deste protótipo).
      </p>
      <div style={{ width: "100%", maxWidth: 240 }}>
        <PrimaryButton
          onClick={() => {
            reset();
            setScreen("splash");
          }}
        >
          Reiniciar protótipo
        </PrimaryButton>
      </div>
    </div>
  );
}
