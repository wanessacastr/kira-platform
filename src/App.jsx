// Moldura do celular + atalhos de tela (dev) · API externa: Google Fonts (CSS das fontes)
import { useEffect } from "react";
import { KiraProvider, useKira } from "./context/KiraContext";
import { screens } from "./screens";
import { colors, fontBody } from "./shared/theme";

function Prototype() {
  const { screen, setScreen } = useKira();
  const Screen = screens[screen];

  const phoneFrame = {
    width: 390,
    minHeight: 780,
    background: colors.background,
    borderRadius: 32,
    overflow: "hidden",
    position: "relative",
    boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
    fontFamily: fontBody,
    display: "flex",
    flexDirection: "column",
  };

  const outer = {
    width: "100%",
    minHeight: "100vh",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    background: "#efeff1",
    padding: "32px 12px",
    colorScheme: "light",
  };

  const navGroups = [
    {
      label: "Início",
      screens: [
        ["Splash", "splash"],
        ["Login", "login"],
        ["Escolher tipo", "signup"],
      ],
    },
    {
      label: "Cliente",
      screens: [
        ["Dados", "clientPersonal"],
        ["Endereço", "clientAddress"],
        ["Localização", "clientLocation"],
        ["Documento", "clientDocument"],
        ["Selfie", "clientSelfie"],
        ["Termos", "clientTerms"],
        ["Concluído", "clientDone"],
        ["Personalizar", "clientPreferences"],
        ["Home (dashboard)", "clientHome"],
        ["Buscar", "clientSearch"],
        ["Perfil Pro (mock)", "clientProfessionalProfile"],
        ["Agendamento (mock)", "clientScheduling"],
        ["Provador: referência", "clientTryOnReference"],
        ["Provador: foto", "clientTryOnPhoto"],
        ["Provador: resultado", "clientTryOnResult"],
        ["Agenda", "clientAgenda"],
        ["Agenda: detalhe", "clientAgendaDetail"],
        ["Perfil (menu)", "clientProfile"],
        ["Perfil: editar", "clientProfileEdit"],
        ["Perfil: segurança", "clientAccountSecurity"],
        ["Perfil: privacidade", "clientPrivacyData"],
        ["Perfil: LGPD", "clientLgpdConsents"],
        ["Perfil: pagamentos", "clientPaymentMethods"],
        ["Perfil: hist. pagamentos", "clientPaymentHistory"],
        ["Perfil: cupons", "clientCoupons"],
        ["Perfil: ajuda", "clientHelpSupport"],
        ["Perfil: avaliações", "clientReviews"],
        ["Perfil: favoritos", "clientFavorites"],
        ["Perfil: histórico", "clientHistory"],
      ],
    },
    {
      label: "Profissional",
      screens: [
        ["Dados", "proPersonal"],
        ["Endereço", "proAddress"],
        ["Localização", "proLocation"],
        ["Documento", "proDocument"],
        ["Selfie", "face"],
        ["Especialidades", "proSpecialties"],
        ["Serviços", "proServices"],
        ["Fotos", "proPhotos"],
        ["Termos", "proTerms"],
        ["Concluído", "proDone"],
        ["Painel", "proHome"],
        ["Agenda", "proAgendaDash"],
        ["Perfil (menu)", "proProfileMenu"],
        ["Financeiro", "proFinance"],
        ["Analytics", "proAnalytics"],
        ["Gift Cards", "proGiftCards"],
        ["Fidelidade", "proLoyalty"],
        ["Segurança Kira", "proSecurity"],
        ["Ajuda", "proHelp"],
        ["Buscar (em breve)", "proSearch"],
      ],
    },
  ];

  return (
    <div style={outer}>
      <style>
        {
          "body, html { margin: 0; padding: 0; } .spin { animation: kiraspin 1s linear infinite; } @keyframes kiraspin { to { transform: rotate(360deg); } }"
        }
      </style>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={phoneFrame} data-testid="phone-frame">
          <Screen />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 390 }}>
          {navGroups.map((group) => (
            <div key={group.label} style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: colors.mutedForeground,
                  fontFamily: fontBody,
                  width: 72,
                }}
              >
                {group.label}
              </span>
              {group.screens.map(([label, key]) => (
                <button
                  key={key}
                  data-testid="screen-shortcut"
                  onClick={() => setScreen(key)}
                  style={{
                    padding: "5px 10px",
                    borderRadius: 999,
                    border: `1px solid ${screen === key ? colors.primary : colors.border}`,
                    background: screen === key ? "hsl(340 70% 55% / 0.1)" : colors.card,
                    color: screen === key ? colors.primary : colors.mutedForeground,
                    fontSize: 10,
                    fontFamily: fontBody,
                    cursor: "pointer",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  return (
    <KiraProvider>
      <Prototype />
    </KiraProvider>
  );
}
