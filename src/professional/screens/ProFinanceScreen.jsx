// Financeiro: saldo, faturamento e transações · mock
import { Calendar, CreditCard } from "lucide-react";
import { useKira } from "../../context/KiraContext";
import { Header, SecondaryButton } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay } from "../../shared/theme";
import { ProStatCard, RevenueBarChart } from "../components/ProWidgets";
import { proDashboardStats, proTransactionsMock } from "../data/mocks";

// "Gestão financeira" — painel de controle financeiro do profissional:
// saldo, próximo repasse, faturamento por semana ou mês (gráfico
// interativo), formas de recebimento e últimas transações, conforme
// "Controle financeiro com métricas e gráfico de faturamento" do folheto.
export default function ProFinanceScreen() {
  const { financeData, financePeriod, financeRevenueSel, setFinancePeriod, setFinanceRevenueSel, setScreen } =
    useKira();
  const periodTotal = financeData.reduce((sum, d) => sum + d.value, 0);
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("proProfileMenu")} />
      <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
        <h1
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: 22,
            color: colors.foreground,
            margin: "4px 0 4px",
          }}
        >
          Gestão financeira
        </h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>
          Controle financeiro com métricas e recebimento protegido.
        </p>

        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <ProStatCard
            label="Saldo disponível"
            value={`R$ ${Math.round(proDashboardStats.weeklyRevenue * 0.7)}`}
            icon={CreditCard}
          />
          <ProStatCard label="Próximo repasse" value="Sex, 18/07" icon={Calendar} />
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
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 15, color: colors.foreground, margin: 0 }}>
              Faturamento
            </h2>
            <div style={{ display: "flex", gap: 4, background: colors.muted, borderRadius: 999, padding: 3 }}>
              {[
                { key: "semana", label: "Semana" },
                { key: "mes", label: "Mês" },
              ].map((p) => (
                <button
                  key={p.key}
                  onClick={() => {
                    setFinancePeriod(p.key);
                    setFinanceRevenueSel(null);
                  }}
                  style={{
                    padding: "5px 11px",
                    borderRadius: 999,
                    border: "none",
                    cursor: "pointer",
                    fontFamily: fontBody,
                    fontSize: 11,
                    fontWeight: 700,
                    background: financePeriod === p.key ? colors.card : "transparent",
                    color: financePeriod === p.key ? colors.primary : colors.mutedForeground,
                    boxShadow: financePeriod === p.key ? "0 1px 2px hsl(280 20% 15% / 0.1)" : "none",
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <RevenueBarChart data={financeData} selectedIndex={financeRevenueSel} onSelect={setFinanceRevenueSel} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
            <span style={{ fontFamily: fontBody, fontSize: 11, color: colors.mutedForeground }}>
              {financeRevenueSel !== null
                ? `${financeData[financeRevenueSel].label} · R$ ${financeData[financeRevenueSel].value.toLocaleString("pt-BR")}`
                : "Toque em uma barra para ver o valor"}
            </span>
            <span style={{ fontFamily: fontBody, fontSize: 11, fontWeight: 700, color: colors.foreground }}>
              Total: R$ {periodTotal.toLocaleString("pt-BR")}
            </span>
          </div>
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
          Formas de recebimento
        </h2>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["Pix", "Cartão", "Gift Card Kira"].map((m) => (
            <span
              key={m}
              style={{
                padding: "8px 12px",
                borderRadius: 999,
                background: colors.muted,
                fontFamily: fontBody,
                fontSize: 11,
                fontWeight: 600,
                color: colors.foreground,
              }}
            >
              {m}
            </span>
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
          Últimas transações
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {proTransactionsMock.map((tx) => (
            <div
              key={tx.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 14px",
                borderRadius: 14,
                border: `1px solid ${colors.border}`,
                background: colors.card,
              }}
            >
              <div>
                <p style={{ fontFamily: fontBody, fontSize: 12, fontWeight: 600, color: colors.foreground, margin: 0 }}>
                  {tx.client} · {tx.service}
                </p>
                <p style={{ fontFamily: fontBody, fontSize: 11, color: colors.mutedForeground, margin: "1px 0 0" }}>
                  {tx.date} · {tx.method}
                </p>
              </div>
              <span style={{ fontFamily: fontBody, fontSize: 13, fontWeight: 700, color: colors.primary }}>
                +R$ {tx.value.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <SecondaryButton onClick={() => {}}>Baixar relatório</SecondaryButton>
      </div>
    </div>
  );
}
