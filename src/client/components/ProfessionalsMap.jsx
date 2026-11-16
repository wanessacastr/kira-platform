// Mapa dos profissionais (Leaflet + OpenStreetMap) · coordenadas vêm do kira-backend; carregado sob demanda
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import { colors, gradientKira } from "../../shared/theme";
import { boundsOf, mapPoints } from "../utils/mapPoints";

const pinHtml = (active) =>
  `<span style="display:block;width:${active ? 34 : 28}px;height:${active ? 34 : 28}px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${gradientKira};border:3px solid ${colors.card};box-shadow:var(--shadow-md)"></span>`;

const pinIcon = (active) =>
  L.divIcon({
    className: "",
    html: pinHtml(active),
    iconSize: [34, 34],
    iconAnchor: [active ? 17 : 14, active ? 34 : 28],
  });

const meIcon = L.divIcon({
  className: "",
  html: `<span style="display:block;width:16px;height:16px;border-radius:50%;background:${colors.primary};border:3px solid ${colors.card};box-shadow:var(--shadow-md)"></span>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

/**
 * `interactive` false: faixa da Home, só para olhar (não arrasta nem dá zoom).
 * `selectedId` e `onSelect`: pino tocado na tela do mapa.
 */
export default function ProfessionalsMap({ professionals, me, interactive = true, selectedId = null, onSelect }) {
  const box = useRef(null);
  const map = useRef(null);
  const layer = useRef(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    const instance = L.map(box.current, {
      zoomControl: interactive,
      dragging: interactive,
      scrollWheelZoom: interactive,
      doubleClickZoom: interactive,
      touchZoom: interactive,
      keyboard: interactive,
      boxZoom: interactive,
      attributionControl: interactive,
    });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }).addTo(instance);
    layer.current = L.layerGroup().addTo(instance);
    map.current = instance;
    return () => {
      instance.remove();
      map.current = null;
    };
  }, [interactive]);

  useEffect(() => {
    const instance = map.current;
    if (!instance) return;
    layer.current.clearLayers();
    const points = mapPoints(professionals);
    for (const pro of points) {
      const marker = L.marker([pro.latitude, pro.longitude], {
        icon: pinIcon(pro.id === selectedId),
        title: pro.name,
        keyboard: interactive,
        interactive: interactive,
      });
      marker.on("click", () => onSelectRef.current?.(pro));
      marker.addTo(layer.current);
    }
    if (Number.isFinite(me?.latitude) && Number.isFinite(me?.longitude)) {
      L.marker([me.latitude, me.longitude], { icon: meIcon, interactive: false, keyboard: false }).addTo(layer.current);
    }
    const bounds = boundsOf(points, me);
    if (bounds) instance.fitBounds(bounds, { padding: [32, 32], maxZoom: 15, animate: false });
  }, [professionals, me, selectedId, interactive]);

  return <div ref={box} role="img" aria-label="Mapa dos profissionais" style={{ position: "absolute", inset: 0 }} />;
}
