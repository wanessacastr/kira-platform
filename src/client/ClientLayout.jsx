// Layout das rotas /cliente: protege a área por tipo de conta e renderiza a tela filha · API: nenhuma
import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import { PRO_HOME } from "../routes";

// Profissional logado não entra na área do cliente. Sem conta escolhida (modo protótipo), libera.
export default function ClientLayout() {
  const { accountType } = useSession();
  if (accountType === "professional") return <Navigate to={PRO_HOME} replace />;
  return <Outlet />;
}
