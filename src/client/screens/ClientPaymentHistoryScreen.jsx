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
      <div style={{ flex: 1, padding: "0 24px 32px", overflowY: "auto" }}>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, color: colors.foreground, margin: "4px 0 4px" }}>Histórico de pagamentos</h1>
        <p style={{ fontFamily: fontBody, fontSize: 12, color: colors.mutedForeground, margin: "0 0 18px" }}>Pagamentos de serviços já concluídos.</p>
        {paid.length === 0 ? (
          <EmptyState onClear={() => setScreen("clientProfile")} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {paid.map((a) => {
              const pro = mockProfessionals.find((p) => p.id === a.proId) || mockProfessionals[0];
              return (
                <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 14, border: `1px solid ${colors.border}`, background: colors.card }}>
                  <img src={pro.photo} alt={pro.name} style={{ width: 40, height: 40, borderRadius: 10, objectFit: "cover" }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: fontBody, fontSize: 12, fontWeight: 600, color: colors.foreground, margin: 0 }}>{a.service}</p>
                    <p style={{ fontFamily: fontBody, fontSize: 11, color: colors.mutedForeground, margin: "1px 0 0" }}>{a.date} • {a.payment}</p>
                  </div>
                  <span style={{ fontFamily: fontBody, fontSize: 13, fontWeight: 700, color: colors.primary }}>R$ {a.price.toFixed(2)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
