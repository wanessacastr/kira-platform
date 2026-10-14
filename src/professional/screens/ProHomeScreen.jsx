// Painel: métricas, receita da semana e próximos atendimentos · mock
import { ChevronRight, CreditCard, ShieldCheck, Sparkles, Star, User } from "lucide-react";
import { useKira } from "../../context/KiraContext";
import { colors, fontBody, fontDisplay, gradientKira } from "../../shared/theme";
import { ProBottomNav } from "../components/ProBottomNav";
import { ProStatCard, RevenueBarChart } from "../components/ProWidgets";
import { proDashboardStats, proUpcomingMock, proWeeklyRevenue } from "../data/mocks";

// "Meu painel" — visão geral do profissional: estatísticas do dia,
// faturamento semanal (gráfico) e próximos atendimentos, como no folheto.
export default function ProHomeScreen() {
  const { goToProTab, pForm, proHomeRevenueSel, setProHomeRevenueSel, setScreen } = useKira();
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <div style={{ padding: "20px 24px 4px" }}>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: 0 }}>Olá,</p>
        <h1
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: 22,
            color: colors.foreground,
            margin: "2px 0 18px",
          }}
        >
          {pForm.name ? pForm.name.split(" ")[0] : "Profissional"}{" "}
          <Sparkles size={16} style={{ display: "inline", verticalAlign: "middle", color: colors.primary }} />
        </h1>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 24px 24px" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <ProStatCard label="Clientes hoje" value={proDashboardStats.clientsToday} icon={User} />
          <ProStatCard
            label="Receita"
            value={`R$ ${proDashboardStats.weeklyRevenue.toLocaleString("pt-BR")}`}
            icon={CreditCard}
          />
          <ProStatCard label="Nota" value={proDashboardStats.rating} icon={Star} />
        </div>

        <div
          onClick={() => setScreen("proFinance")}
          role="button"
          tabIndex={0}
          style={{
            width: "100%",
            textAlign: "left",
            border: `1px solid ${colors.border}`,
            borderRadius: 18,
            background: colors.card,
            padding: 16,
            marginBottom: 22,
            cursor: "pointer",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 15, color: colors.foreground, margin: 0 }}>
              Faturamento semanal
            </h2>
            <span style={{ fontFamily: fontBody, fontSize: 11, fontWeight: 700, color: colors.primary }}>
              +{proDashboardStats.revenueDelta}%
            </span>
          </div>
          <RevenueBarChart
            data={proWeeklyRevenue}
            selectedIndex={proHomeRevenueSel}
            onSelect={(i) => {
              setProHomeRevenueSel(i);
            }}
          />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
            <span style={{ fontFamily: fontBody, fontSize: 11, color: colors.mutedForeground }}>
              {proHomeRevenueSel !== null
                ? `${proWeeklyRevenue[proHomeRevenueSel].label} · R$ ${proWeeklyRevenue[proHomeRevenueSel].value.toLocaleString("pt-BR")}`
                : "Toque em um dia para ver o valor"}
            </span>
            <span
              style={{
                fontFamily: fontBody,
                fontSize: 11,
                fontWeight: 700,
                color: colors.primary,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              Ver gestão financeira <ChevronRight size={13} />
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 16, color: colors.foreground, margin: 0 }}>
            Próximos atendimentos
          </h2>
          <span
            style={{ fontFamily: fontBody, fontSize: 12, fontWeight: 600, color: colors.primary, cursor: "pointer" }}
            onClick={() => setScreen("proAgendaDash")}
          >
            Ver agenda
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
          {proUpcomingMock.map((a) => (
            <div
              key={a.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: 12,
                borderRadius: 16,
                border: `1px solid ${colors.border}`,
                background: colors.card,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: colors.muted,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <User size={17} color={colors.mutedForeground} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: fontBody, fontWeight: 700, fontSize: 13, color: colors.foreground, margin: 0 }}>
                  {a.client}
                </p>
                <p style={{ fontFamily: fontBody, fontSize: 11, color: colors.mutedForeground, margin: "1px 0 0" }}>
                  {a.time} · {a.service}
                </p>
              </div>
              <ChevronRight size={16} color={colors.mutedForeground} />
            </div>
          ))}
        </div>

        <button
          onClick={() => setScreen("proSecurity")}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: 14,
            borderRadius: 16,
            border: "none",
            background: "hsl(var(--primary-hsl) / 0.08)",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: gradientKira,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={18} color={colors.primaryForeground} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: fontBody, fontWeight: 700, fontSize: 13, color: colors.foreground, margin: 0 }}>
              Perfil verificado
            </p>
            <p style={{ fontFamily: fontBody, fontSize: 11, color: colors.mutedForeground, margin: "1px 0 0" }}>
              Veja seu selo de confiança e segurança
            </p>
          </div>
          <ChevronRight size={18} color={colors.primary} />
        </button>
      </div>
      <ProBottomNav active="proHome" onNavigate={goToProTab} />
    </div>
  );
}
