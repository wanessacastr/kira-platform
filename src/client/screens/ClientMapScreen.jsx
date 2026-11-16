// Mapa dos profissionais: pinos dos estúdios, toque para ver o cartão e abrir o perfil · API: kira-backend (estúdios)
import { lazy, Suspense, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { useScheduling } from "../../context/SchedulingContext";
import { useSession } from "../../context/SessionContext";
import { ErrorState, SkeletonLoading } from "../../shared/components/states";
import { Header } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay } from "../../shared/theme";
import { ProfessionalCard } from "../components/ProfessionalCards";
import { useMyCoordinates, useProfessionals } from "../hooks/useProfessionals";
import { mapPoints, nearbyLabel } from "../utils/mapPoints";

const ProfessionalsMap = lazy(() => import("../components/ProfessionalsMap"));

export default function ClientMapScreen() {
  const { setScreen } = useSession();
  const { setBookedSlot, setSelectedProId } = useScheduling();
  const navigate = useNavigate();
  const { key } = useLocation();
  const professionals = useProfessionals();
  const me = useMyCoordinates();
  const [selectedId, setSelectedId] = useState(null);
  // Volta para onde a pessoa estava (Início ou Buscar); aberta direto pela URL, volta para o Início
  const back = () => (key === "default" ? setScreen("clientHome") : navigate(-1));
  const points = mapPoints(professionals.data);
  const selected = points.find((p) => p.id === selectedId) ?? null;
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={back} />
      <div style={{ padding: "0 var(--space-24) var(--space-12)" }}>
        <h1
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: "var(--font-size-2xl)",
            color: colors.foreground,
            margin: "0 0 var(--space-2)",
          }}
        >
          Mapa
        </h1>
        {professionals.data && points.length > 0 && (
          <p
            style={{ fontFamily: fontBody, fontSize: "var(--font-size-xs)", color: colors.mutedForeground, margin: 0 }}
          >
            {nearbyLabel(professionals.data)}
          </p>
        )}
      </div>
      {professionals.isLoading ? (
        <div style={{ padding: "0 var(--space-24)" }}>
          <SkeletonLoading count={3} />
        </div>
      ) : professionals.isError ? (
        <div style={{ padding: "0 var(--space-24)" }}>
          <ErrorState onRetry={professionals.refetch} message="Não foi possível carregar o mapa." />
        </div>
      ) : points.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--space-12)",
            padding: "var(--space-40) var(--space-24)",
            textAlign: "center",
          }}
        >
          <MapPin size={30} color={colors.mutedForeground} />
          <p
            style={{ fontFamily: fontBody, fontSize: "var(--font-size-sm)", color: colors.mutedForeground, margin: 0 }}
          >
            Nenhum profissional com localização no mapa ainda.
          </p>
        </div>
      ) : (
        <div style={{ position: "relative", flex: 1, isolation: "isolate", minHeight: 280 }}>
          <Suspense fallback={<SkeletonLoading count={1} />}>
            <ProfessionalsMap
              professionals={points}
              me={me}
              selectedId={selectedId}
              onSelect={(p) => setSelectedId(p.id)}
            />
          </Suspense>
          {selected && (
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1000,
                padding: "var(--space-12) var(--space-16) var(--space-32)",
              }}
            >
              <ProfessionalCard
                pro={selected}
                onClick={() => {
                  setSelectedProId(selected.id);
                  setBookedSlot(null);
                  setScreen("clientProfessionalProfile");
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
