// Rotas do app: telas compartilhadas na raiz e áreas /cliente e /profissional com layout próprio · API: nenhuma
import { Navigate, Route, Routes } from "react-router-dom";
import ClientLayout from "./client/ClientLayout";
import ProLayout from "./professional/ProLayout";
import { CLIENT_HOME, clientPaths, PRO_HOME, professionalPaths, sharedPaths } from "./routes";
import { screens } from "./screens";

const relative = (prefix, path) => path.slice(prefix.length + 1);

const areaRoutes = (prefix, paths) =>
  Object.entries(paths).map(([key, path]) => {
    const Screen = screens[key];
    return <Route key={key} path={relative(prefix, path)} element={<Screen />} />;
  });

export default function AppRoutes() {
  return (
    <Routes>
      {Object.entries(sharedPaths).map(([key, path]) => {
        const Screen = screens[key];
        return <Route key={key} path={path} element={<Screen />} />;
      })}
      <Route path="/cliente" element={<ClientLayout />}>
        <Route index element={<Navigate to={CLIENT_HOME} replace />} />
        {areaRoutes("/cliente", clientPaths)}
      </Route>
      <Route path="/profissional" element={<ProLayout />}>
        <Route index element={<Navigate to={PRO_HOME} replace />} />
        {areaRoutes("/profissional", professionalPaths)}
      </Route>
      <Route path="*" element={<Navigate to={sharedPaths.splash} replace />} />
    </Routes>
  );
}
