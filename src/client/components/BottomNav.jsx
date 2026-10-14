// Barra de navegação inferior do cliente (usa NavBar compartilhado) · API: nenhuma
import { NavBar } from "../../shared/components/NavBar";
import { bottomNavItems } from "../data/mocks";

export const BottomNav = (props) => <NavBar items={bottomNavItems} {...props} />;
