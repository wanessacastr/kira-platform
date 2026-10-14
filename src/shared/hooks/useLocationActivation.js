// Ativar localização: pede a posição ao navegador (geolocation) e grava latitude e longitude no formulário · API do navegador: geolocation
import { useState } from "react";

export function useLocationActivation(setForm, alreadyActive = false) {
  const [status, setStatus] = useState(alreadyActive ? "success" : "idle"); // idle | loading | success | error
  const activate = () => {
    setStatus("loading");
    if (!navigator.geolocation) {
      setTimeout(() => setStatus("error"), 400);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({ ...f, latitude: pos.coords.latitude, longitude: pos.coords.longitude }));
        setStatus("success");
      },
      () => setStatus("error"),
      { timeout: 8000 },
    );
  };
  return { status, activate };
}
