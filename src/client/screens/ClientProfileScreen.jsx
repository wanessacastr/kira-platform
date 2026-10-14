// Menu do perfil do cliente · API: nenhuma
import { LogOut, User } from "lucide-react";
import { useKira } from "../../context/KiraContext";
import { ProfileMenuRow, ProfileSection } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay, gradientKira } from "../../shared/theme";
import { BottomNav } from "../components/BottomNav";
import { clientProfileMenu } from "../data/mocks";

// ---------- Perfil da cliente ----------
export default function ClientProfileScreen() {
  const { cForm, goToTab, setScreen } = useKira();
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
            border: "3px solid rgba(255,255,255,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.2)",
            flexShrink: 0,
          }}
        >
          {cForm.photo ? (
            <img src={cForm.photo} alt="Foto de perfil" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
            {cForm.name || "Cliente Kira"}
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
            @
            {(cForm.name || "cliente")
              .toLowerCase()
              .replace(/\s+/g, "")
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "") || "cliente"}
          </p>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px 24px" }}>
        {clientProfileMenu.map((section) => (
          <ProfileSection key={section.title} title={section.title}>
            {section.items.map((item, i) => (
              <ProfileMenuRow
                key={item.label}
                icon={item.icon}
                label={item.label}
                last={i === section.items.length - 1}
                onClick={item.go ? () => setScreen(item.go) : undefined}
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
            border: `1px solid hsl(0 84% 60% / 0.3)`,
            background: "hsl(0 84% 60% / 0.06)",
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
      <BottomNav active="clientProfile" onNavigate={goToTab} />
    </div>
  );
}
