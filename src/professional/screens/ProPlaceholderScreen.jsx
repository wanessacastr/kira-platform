// Placeholder de tela em breve (ex.: Buscar) · API: nenhuma
import { Sparkles } from "lucide-react";
import { useKira } from "../../context/KiraContext";
import { Header } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay } from "../../shared/theme";
import { ProBottomNav } from "../components/ProBottomNav";

// ---------- NOVO: Telas do painel profissional ----------
// Placeholder leve para os destinos "Buscar" e "Provador" da bottom nav do
// profissional (mostrados no mockup do folheto, mas fora do escopo pedido
// agora). Nada aqui altera o Provador virtual do cliente.
export default function ProPlaceholderScreen({ title, message, activeKey }) {
  const { goToProTab, setScreen } = useKira();
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("proHome")} />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "var(--space-14)",
          padding: "var(--space-24)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "var(--radius-round)",
            background: colors.muted,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Sparkles size={26} color={colors.mutedForeground} />
        </div>
        <h1
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: "var(--font-size-lg)",
            color: colors.foreground,
            margin: 0,
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            margin: 0,
            maxWidth: 240,
          }}
        >
          {message}
        </p>
      </div>
      <ProBottomNav active={activeKey} onNavigate={goToProTab} />
    </div>
  );
}

export function ProSearchScreen() {
  return (
    <ProPlaceholderScreen
      title="Buscar"
      message="Em breve você poderá buscar parcerias e profissionais próximos."
      activeKey="proSearch"
    />
  );
}
