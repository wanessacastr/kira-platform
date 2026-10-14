// Entrada: monta <App /> no #root · API: nenhuma
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./shared/styles/tokens.css";
import "./shared/styles/base.css";

createRoot(document.getElementById("root")).render(<App />);
