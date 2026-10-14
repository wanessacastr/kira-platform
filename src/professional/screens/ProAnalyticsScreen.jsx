// Analytics: serviços mais agendados, avaliações e retorno · mock
import { CheckCircle2, ChevronRight, CreditCard, Star, TrendingUp, User, X } from "lucide-react";
import { useKira } from "../../context/KiraContext";
import { colors, fontBody, fontDisplay, gradientKira } from "../../shared/theme";
import { ProBottomNav } from "../components/ProBottomNav";
import { ProStatCard, RevenueBarChart } from "../components/ProWidgets";
import {
  getServiceClientBreakdown,
  proAnalyticsSummary,
  proAppointmentsWeekMock,
  proRatingBreakdownMock,
  proServiceRankingMock,
} from "../data/mocks";

// "Analytics" — painel de desempenho do profissional: atendimentos por
// dia, serviços mais procurados, distribuição de avaliações e métricas
// de conversão/retorno de clientes.
export default function ProAnalyticsScreen() {
  const { goToProTab, proAnalyticsSel, proServiceDetail, setProAnalyticsSel, setProServiceDetail } = useKira();
  const maxServiceCount = Math.max(...proServiceRankingMock.map((s) => s.count));
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <div style={{ padding: "20px 24px 4px" }}>
        <h1
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: 22,
            color: colors.foreground,
            margin: "4px 0 4px",
          }}
        >
          Analytics
        </h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 4px" }}>
          Desempenho do seu perfil profissional na Kira.
        </p>
      </div>
      <div style={{ flex: 1, padding: "8px 24px 24px", overflowY: "auto" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <ProStatCard label="Ticket médio" value={`R$ ${proAnalyticsSummary.avgTicket}`} icon={CreditCard} />
          <ProStatCard label="Retorno de clientes" value={`${proAnalyticsSummary.retentionRate}%`} icon={TrendingUp} />
          <ProStatCard label="Conclusão" value={`${proAnalyticsSummary.completionRate}%`} icon={CheckCircle2} />
        </div>

        <div
          style={{
            borderRadius: 18,
            border: `1px solid ${colors.border}`,
            background: colors.card,
            padding: 16,
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: 15,
              color: colors.foreground,
              margin: "0 0 14px",
            }}
          >
            Atendimentos por dia
          </h2>
          <RevenueBarChart
            data={proAppointmentsWeekMock}
            selectedIndex={proAnalyticsSel}
            onSelect={setProAnalyticsSel}
          />
          <p style={{ fontFamily: fontBody, fontSize: 11, color: colors.mutedForeground, margin: "12px 0 0" }}>
            {proAnalyticsSel !== null
              ? `${proAppointmentsWeekMock[proAnalyticsSel].label} · ${proAppointmentsWeekMock[proAnalyticsSel].value} atendimento(s)`
              : "Toque em um dia para ver o total"}
          </p>
        </div>

        <h2
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: 15,
            color: colors.foreground,
            margin: "0 0 10px",
          }}
        >
          Serviços mais procurados
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {proServiceRankingMock.map((s) => (
            <button
              key={s.service}
              onClick={() => setProServiceDetail(s)}
              style={{
                padding: "12px 14px",
                borderRadius: 14,
                border: `1px solid ${colors.border}`,
                background: colors.card,
                width: "100%",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontFamily: fontBody, fontSize: 12, fontWeight: 700, color: colors.foreground }}>
                  {s.service}
                </span>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontFamily: fontBody,
                    fontSize: 11,
                    color: colors.mutedForeground,
                  }}
                >
                  {s.count}x · R$ {s.revenue} <ChevronRight size={13} color={colors.mutedForeground} />
                </span>
              </div>
              <div
                style={{ width: "100%", height: 6, borderRadius: 999, background: colors.muted, overflow: "hidden" }}
              >
                <div
                  style={{
                    width: `${(s.count / maxServiceCount) * 100}%`,
                    height: "100%",
                    borderRadius: 999,
                    background: gradientKira,
                  }}
                />
              </div>
            </button>
          ))}
        </div>

        <h2
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: 15,
            color: colors.foreground,
            margin: "0 0 10px",
          }}
        >
          Distribuição de avaliações
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {proRatingBreakdownMock.map((r) => (
            <div key={r.stars} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  fontFamily: fontBody,
                  fontSize: 11,
                  fontWeight: 600,
                  color: colors.foreground,
                  width: 34,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                {r.stars} <Star size={11} color={colors.primary} fill={colors.primary} />
              </span>
              <div style={{ flex: 1, height: 6, borderRadius: 999, background: colors.muted, overflow: "hidden" }}>
                <div style={{ width: `${r.percent}%`, height: "100%", borderRadius: 999, background: gradientKira }} />
              </div>
              <span
                style={{
                  fontFamily: fontBody,
                  fontSize: 11,
                  color: colors.mutedForeground,
                  width: 32,
                  textAlign: "right",
                  flexShrink: 0,
                }}
              >
                {r.percent}%
              </span>
            </div>
          ))}
        </div>
      </div>
      <ProBottomNav active="proAnalytics" onNavigate={goToProTab} />

      {proServiceDetail &&
        (() => {
          const clients = getServiceClientBreakdown(proServiceDetail);
          const uniqueClients = clients.length;
          return (
            <div
              onClick={() => setProServiceDetail(null)}
              style={{
                position: "fixed",
                inset: 0,
                background: "hsl(var(--foreground-hsl) / 0.45)",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                zIndex: 60,
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: "100%",
                  maxWidth: 380,
                  maxHeight: "78%",
                  margin: "0 auto",
                  background: colors.card,
                  borderRadius: "24px 24px 0 0",
                  padding: "20px 24px 28px",
                  overflowY: "auto",
                }}
              >
                <div
                  style={{ width: 40, height: 4, borderRadius: 2, background: colors.border, margin: "0 auto 16px" }}
                />
                <div
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}
                >
                  <h2
                    style={{
                      fontFamily: fontDisplay,
                      fontWeight: 700,
                      fontSize: 17,
                      color: colors.foreground,
                      margin: 0,
                    }}
                  >
                    {proServiceDetail.service}
                  </h2>
                  <button
                    onClick={() => setProServiceDetail(null)}
                    aria-label="Fechar"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: colors.mutedForeground,
                      padding: 0,
                    }}
                  >
                    <X size={18} />
                  </button>
                </div>
                <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 16px" }}>
                  {proServiceDetail.count} atendimentos · {uniqueClients} cliente{uniqueClients === 1 ? "" : "s"} · R${" "}
                  {proServiceDetail.revenue}
                </p>

                <p
                  style={{
                    fontFamily: fontBody,
                    fontSize: 11,
                    fontWeight: 700,
                    color: colors.mutedForeground,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    margin: "0 0 10px",
                  }}
                >
                  Clientes que realizaram este serviço
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {clients.map((c) => (
                    <div
                      key={c.name}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 12px",
                        borderRadius: 14,
                        border: `1px solid ${colors.border}`,
                        background: colors.background,
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: colors.muted,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <User size={16} color={colors.mutedForeground} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontFamily: fontBody,
                            fontWeight: 700,
                            fontSize: 12,
                            color: colors.foreground,
                            margin: 0,
                          }}
                        >
                          {c.name}
                        </p>
                        <p
                          style={{
                            fontFamily: fontBody,
                            fontSize: 11,
                            color: colors.mutedForeground,
                            margin: "1px 0 0",
                          }}
                        >
                          {c.visits} atendimento{c.visits === 1 ? "" : "s"} · Último: {c.lastDate}
                        </p>
                      </div>
                      <span
                        style={{
                          fontFamily: fontBody,
                          fontSize: 12,
                          fontWeight: 700,
                          color: colors.primary,
                          flexShrink: 0,
                        }}
                      >
                        R$ {c.totalSpent}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}
