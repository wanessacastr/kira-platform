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
      <div style={{ flex: 1, padding: "0 var(--space-24) var(--space-32)", overflowY: "auto" }}>
        <h1
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: "var(--font-size-2xl)",
            color: colors.foreground,
            margin: "var(--space-4) 0 var(--space-4)",
          }}
        >
          Gestão financeira
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            margin: "0 0 var(--space-18)",
          }}
        >
          Controle financeiro com métricas e recebimento protegido.
        </p>

        <div style={{ display: "flex", gap: "var(--space-10)", marginBottom: "var(--space-20)" }}>
          <ProStatCard
            label="Saldo disponível"
            value={`R$ ${Math.round(proDashboardStats.weeklyRevenue * 0.7)}`}
            icon={CreditCard}
          />
          <ProStatCard label="Próximo repasse" value="Sex, 18/07" icon={Calendar} />
        </div>

        <div
          style={{
            borderRadius: "var(--radius-3xl)",
            border: `1px solid ${colors.border}`,
            background: colors.card,
            padding: "var(--space-16)",
            marginBottom: "var(--space-20)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "var(--space-12)",
            }}
          >
            <h2
              style={{
                fontFamily: fontDisplay,
                fontWeight: 700,
                fontSize: "var(--font-size-base)",
                color: colors.foreground,
                margin: 0,
              }}
            >
              Faturamento
            </h2>
            <div
              style={{
                display: "flex",
                gap: "var(--space-4)",
                background: colors.muted,
                borderRadius: "var(--radius-pill)",
                padding: "var(--space-3)",
              }}
            >
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
                    padding: "var(--space-5) var(--space-11)",
                    borderRadius: "var(--radius-pill)",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: fontBody,
                    fontSize: "var(--font-size-xs)",
                    fontWeight: 700,
                    background: financePeriod === p.key ? colors.card : "transparent",
                    color: financePeriod === p.key ? colors.primary : colors.mutedForeground,
                    boxShadow: financePeriod === p.key ? "var(--shadow-xs)" : "none",
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <RevenueBarChart data={financeData} selectedIndex={financeRevenueSel} onSelect={setFinanceRevenueSel} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "var(--space-12)",
            }}
          >
            <span style={{ fontFamily: fontBody, fontSize: "var(--font-size-xs)", color: colors.mutedForeground }}>
              {financeRevenueSel !== null
                ? `${financeData[financeRevenueSel].label} · R$ ${financeData[financeRevenueSel].value.toLocaleString("pt-BR")}`
                : "Toque em uma barra para ver o valor"}
            </span>
            <span
              style={{
                fontFamily: fontBody,
                fontSize: "var(--font-size-xs)",
                fontWeight: 700,
                color: colors.foreground,
              }}
            >
              Total: R$ {periodTotal.toLocaleString("pt-BR")}
            </span>
          </div>
        </div>

        <h2
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: "var(--font-size-base)",
            color: colors.foreground,
            margin: "0 0 var(--space-10)",
          }}
        >
          Formas de recebimento
        </h2>
        <div style={{ display: "flex", gap: "var(--space-8)", marginBottom: "var(--space-20)" }}>
          {["Pix", "Cartão", "Gift Card Kira"].map((m) => (
            <span
              key={m}
              style={{
                padding: "var(--space-8) var(--space-12)",
                borderRadius: "var(--radius-pill)",
                background: colors.muted,
                fontFamily: fontBody,
                fontSize: "var(--font-size-xs)",
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
            fontSize: "var(--font-size-base)",
            color: colors.foreground,
            margin: "0 0 var(--space-10)",
          }}
        >
          Últimas transações
        </h2>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)", marginBottom: "var(--space-20)" }}
        >
          {proTransactionsMock.map((tx) => (
            <div
              key={tx.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "var(--space-12) var(--space-14)",
                borderRadius: "var(--radius-xl)",
                border: `1px solid ${colors.border}`,
                background: colors.card,
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: fontBody,
                    fontSize: "var(--font-size-xs)",
                    fontWeight: 600,
                    color: colors.foreground,
                    margin: 0,
                  }}
                >
                  {tx.client} · {tx.service}
                </p>
                <p
                  style={{
                    fontFamily: fontBody,
                    fontSize: "var(--font-size-xs)",
                    color: colors.mutedForeground,
                    margin: "var(--space-1) 0 0",
                  }}
                >
                  {tx.date} · {tx.method}
                </p>
              </div>
              <span
                style={{
                  fontFamily: fontBody,
                  fontSize: "var(--font-size-sm)",
                  fontWeight: 700,
                  color: colors.primary,
                }}
              >
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
