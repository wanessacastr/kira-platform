// Perfil: histórico de pagamentos · mock
import { useKira } from "../../context/KiraContext";
import { EmptyState } from "../../shared/components/states";
import { Header } from "../../shared/components/ui";
import { mockProfessionals } from "../../shared/data/professionals";
import { colors, fontBody, fontDisplay } from "../../shared/theme";
import { appointmentsMock } from "../data/mocks";

// === PERFIL: Histórico de pagamentos ===
export default function ClientPaymentHistoryScreen() {
  const { setScreen } = useKira();
  const paid = appointmentsMock.filter((a) => a.status === "concluido");
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("clientProfile")} />
      <div style={{ flex: 1, padding: "0 var(--space-24) var(--space-32)", overflowY: "auto" }}>
        <h1
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: 22,
            color: colors.foreground,
            margin: "var(--space-4) 0 var(--space-4)",
          }}
        >
          Histórico de pagamentos
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: 12,
            color: colors.mutedForeground,
            margin: "0 0 var(--space-18)",
          }}
        >
          Pagamentos de serviços já concluídos.
        </p>
        {paid.length === 0 ? (
          <EmptyState onClear={() => setScreen("clientProfile")} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
            {paid.map((a) => {
              const pro = mockProfessionals.find((p) => p.id === a.proId) || mockProfessionals[0];
              return (
                <div
                  key={a.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-12)",
                    padding: "var(--space-12) var(--space-14)",
                    borderRadius: "var(--radius-xl)",
                    border: `1px solid ${colors.border}`,
                    background: colors.card,
                  }}
                >
                  <img
                    src={pro.photo}
                    alt={pro.name}
                    style={{ width: 40, height: 40, borderRadius: "var(--radius-md)", objectFit: "cover" }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily: fontBody,
                        fontSize: 12,
                        fontWeight: 600,
                        color: colors.foreground,
                        margin: 0,
                      }}
                    >
                      {a.service}
                    </p>
                    <p
                      style={{
                        fontFamily: fontBody,
                        fontSize: 11,
                        color: colors.mutedForeground,
                        margin: "var(--space-1) 0 0",
                      }}
                    >
                      {a.date} • {a.payment}
                    </p>
                  </div>
                  <span
                    style={{
                      fontFamily: fontBody,
                      fontSize: 13,
                      fontWeight: 700,
                      color: colors.primary,
                    }}
                  >
                    R$ {a.price.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
