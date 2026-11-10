import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const SCL: L.LatLngTuple = [-33.4489, -70.6693];
const GEO: L.LatLngTuple[] = [[-33.43, -70.65], [-33.44, -70.6], [-33.47, -70.61], [-33.49, -70.64], [-33.48, -70.68], [-33.45, -70.68]];
const RED = '#DE350B';

/** Mapa Leaflet (CartoDB Positron) con una geocerca de ejemplo. */
export function GeofenceMap({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const m = L.map(ref.current, { center: SCL, zoom: 11, scrollWheelZoom: false, attributionControl: true });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { attribution: '© <a href="https://carto.com/">CARTO</a>', subdomains: 'abcd', maxZoom: 19 }).addTo(m);
    L.polygon(GEO, { color: RED, fillColor: RED, fillOpacity: 0.1, weight: 2 }).addTo(m);
    GEO.forEach((p) => L.circleMarker(p, { radius: 5, color: RED, fillColor: RED, fillOpacity: 1, weight: 2 }).addTo(m));
    const id = requestAnimationFrame(() => m.invalidateSize());
    return () => { cancelAnimationFrame(id); m.remove(); };
  }, []);
  return <div ref={ref} className={className} />;
}
