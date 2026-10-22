import L from "leaflet";

// Coloured pin drawn with HTML, so no marker image files are needed.
export function pinIcon(color = "#184d46", { size = 30, label } = {}) {
  return L.divIcon({
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size + 4],
    html: `<span style="display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${color};box-shadow:0 2px 6px rgba(0,0,0,.35);border:2px solid #fff"><span style="transform:rotate(45deg);color:#fff;font:600 ${Math.round(size / 2.6)}px/1 'Plus Jakarta Sans',sans-serif">${label ?? ""}</span></span>`,
  });
}

export const CUSTOMER_PIN = pinIcon("#2563eb", { size: 30, label: "•" });
export const WORKER_PIN = pinIcon("#184d46", { size: 28 });