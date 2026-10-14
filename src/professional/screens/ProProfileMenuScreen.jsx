// Menu do perfil do profissional · API: nenhuma
import { LogOut, User } from "lucide-react";
import { useKira } from "../../context/KiraContext";
import { ProfileMenuRow, ProfileSection } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay, gradientKira } from "../../shared/theme";
import { ProBottomNav } from "../components/ProBottomNav";
import { proProfileMenu } from "../data/mocks";

// Menu de Perfil do profissional — mesma lógica do renderClientProfile.
export default function ProProfileMenuScreen() {
  const { goToProTab, pForm, setScreen } = useKira();
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <div
        style={{ background: gradientKira, padding: "28px 24px 24px", display: "flex", alignItems: "center", gap: 14 }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            overflow: "hidden",
            border: "3px solid hsl(var(--white-hsl) / 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "hsl(var(--white-hsl) / 0.2)",
            flexShrink: 0,
          }}
        >
          {pForm.photo ? (
            <img src={pForm.photo} alt="Foto de perfil" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <User size={28} color={colors.primaryForeground} />
          )}
        </div>
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: 17,
              color: colors.primaryForeground,
              margin: 0,
            }}
          >
            {pForm.name || "Profissional Kira"}
          </p>
          <p
            style={{
              fontFamily: fontBody,
              fontSize: 12,
              color: colors.primaryForeground,
              opacity: 0.85,
              margin: "2px 0 0",
            }}
          >
            {pForm.specialties.length > 0 ? pForm.specialties.join(" · ") : "Profissional da beleza"}
          </p>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px 24px" }}>
        {proProfileMenu.map((section) => (
          <ProfileSection key={section.title} title={section.title}>
            {section.items.map((item, i) => (
              <ProfileMenuRow
                key={item.label}
                icon={item.icon}
                label={item.label}
                last={i === section.items.length - 1}
                onClick={() => setScreen(item.go)}
              />
            ))}
          </ProfileSection>
        ))}
        <button
          onClick={() => setScreen("splash")}
          style={{
            width: "100%",
            padding: 13,
            borderRadius: 14,
            border: `1px solid hsl(var(--destructive-hsl) / 0.3)`,
            background: "hsl(var(--destructive-hsl) / 0.06)",
            color: colors.destructive,
            fontWeight: 700,
            fontSize: 13,
            fontFamily: fontBody,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <LogOut size={15} /> Sair da conta
        </button>
      </div>
      <ProBottomNav active="proProfileMenu" onNavigate={goToProTab} />
    </div>
  );
}
