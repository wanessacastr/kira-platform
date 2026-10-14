// Layout das rotas /profissional: protege a área por tipo de conta e renderiza a tela filha · API: nenhuma
import { Navigate, Outlet } from "react-router-dom";
import { useKira } from "../context/KiraContext";
import { CLIENT_HOME } from "../routes";

// Cliente logado não entra na área do profissional. Sem conta escolhida (modo protótipo), libera.
export default function ProLayout() {
  const { accountType } = useKira();
  if (accountType === "client") return <Navigate to={CLIENT_HOME} replace />;
  return <Outlet />;
}
