// Perfil: favoritas · estado local + mockProfessionals
import { Bookmark } from "lucide-react";
import { useKira } from "../../context/KiraContext";
import { Header } from "../../shared/components/ui";
import { mockProfessionals } from "../../shared/data/professionals";
import { colors, fontBody, fontDisplay } from "../../shared/theme";
import { ProfessionalCard } from "../components/ProfessionalCards";

// === PERFIL: Profissionais favoritos ===
export default function ClientFavoritesScreen() {
  const { favoriteProIds, setBookedSlot, setScreen, setSelectedProId } = useKira();
  const favorites = mockProfessionals.filter((p) => favoriteProIds.includes(p.id));
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("clientProfile")} />
      <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "4px 0 4px" }}>Profissionais favoritos</h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>Toque no ícone de marcador no perfil de um profissional para salvá-lo aqui.</p>
        {favorites.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "40px 24px", textAlign: "center" }}>
            <Bookmark size={30} color={colors.mutedForeground} />
            <p style={{ fontFamily: fontBody, fontSize: 13, color: colors.mutedForeground, margin: 0 }}>Você ainda não tem profissionais favoritos.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {favorites.map((pro) => (
              <ProfessionalCard key={pro.id} pro={pro} onClick={() => { setSelectedProId(pro.id); setBookedSlot(null); setScreen("clientProfessionalProfile"); }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
