// Ajuda do profissional · estático
import { HelpCircle, MessageCircle } from "lucide-react";
import { useKira } from "../../context/KiraContext";
import { Header, ProfileMenuRow, ProfileSection, SecondaryButton } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay } from "../../shared/theme";

// "Ajuda e suporte" do profissional — mesma lógica do renderClientHelpSupport.
export default function ProHelpScreen() {
  const { setScreen } = useKira();
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("proProfileMenu")} />
      <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "4px 0 4px" }}>Ajuda e suporte</h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>Como podemos ajudar?</p>
        <ProfileSection title="Dúvidas frequentes">
          {["Como funciona a recomendação por IA?", "Como recebo pelos meus atendimentos?", "Como funciona o Canal de Segurança?"].map((q, i, arr) => (
            <ProfileMenuRow key={q} icon={HelpCircle} label={q} last={i === arr.length - 1} onClick={() => {}} />
          ))}
        </ProfileSection>
        <SecondaryButton onClick={() => {}}><MessageCircle size={15} /> Conversar com o suporte</SecondaryButton>
      </div>
    </div>
  );
}
