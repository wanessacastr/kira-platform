// Perfil: avaliações feitas · mock
import { useKira } from "../../context/KiraContext";
import { EmptyState } from "../../shared/components/states";
import { Header } from "../../shared/components/ui";
import { mockProfessionals } from "../../shared/data/professionals";
import { colors, fontBody, fontDisplay } from "../../shared/theme";
import { RatingStars } from "../components/ProfessionalCards";
import { appointmentsMock, clientReviewsMock } from "../data/mocks";

// === PERFIL: Minhas avaliações ===
export default function ClientReviewsScreen() {
  const { setScreen, setSelectedAppointmentId } = useKira();
  const reviewed = appointmentsMock.filter((a) => a.status === "concluido");
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
          Minhas avaliações
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: 12,
            color: colors.mutedForeground,
            margin: "0 0 var(--space-18)",
          }}
        >
          Avaliações que você deixou para profissionais atendidos.
        </p>
        {reviewed.length === 0 ? (
          <EmptyState onClear={() => setScreen("clientProfile")} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-10)" }}>
            {reviewed.map((a) => {
              const pro = mockProfessionals.find((p) => p.id === a.proId) || mockProfessionals[0];
              const review = clientReviewsMock[a.id];
              return (
                <div
                  key={a.id}
                  style={{
                    padding: "var(--space-14)",
                    borderRadius: "var(--radius-2xl)",
                    border: `1px solid ${colors.border}`,
                    background: colors.card,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-10)",
                      marginBottom: "var(--space-8)",
                    }}
                  >
                    <img
                      src={pro.photo}
                      alt={pro.name}
                      style={{ width: 36, height: 36, borderRadius: "var(--radius-md)", objectFit: "cover" }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontFamily: fontBody,
                          fontSize: 12,
                          fontWeight: 700,
                          color: colors.foreground,
                          margin: 0,
                        }}
                      >
                        {pro.name}
                      </p>
                      <p
                        style={{
                          fontFamily: fontBody,
                          fontSize: 10,
                          color: colors.mutedForeground,
                          margin: 0,
                        }}
                      >
                        {a.service}
                      </p>
                    </div>
                    {review && <RatingStars value={review.rating} size={12} />}
                  </div>
                  {review ? (
                    <p
                      style={{
                        fontFamily: fontBody,
                        fontSize: 12,
                        color: colors.mutedForeground,
                        margin: 0,
                      }}
                    >
                      {review.text}
                    </p>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedAppointmentId(a.id);
                        setScreen("clientAgendaDetail");
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        fontFamily: fontBody,
                        fontSize: 12,
                        fontWeight: 700,
                        color: colors.primary,
                      }}
                    >
                      Avaliar este atendimento
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
