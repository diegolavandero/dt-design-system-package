// Fondo del mapa: calles en gris claro, sin comercios, transporte ni etiquetas (mínimo contenido).
// CARTO Positron (el fondo anterior del DS) ahora exige API key y dibuja una marca de agua, por eso se cambia a Google.
//
//  · Con VITE_GOOGLE_MAPS_KEY: Google Map Tiles API (oficial). Crea una sesión con el estilo de abajo y pide los tiles con esa sesión.
//  · Sin clave: endpoint público de tiles de Google (no documentado, sin garantías ni SLA), con el mismo estilo vía `apistyle`.
//    Sirve para el prototipo; para producción hay que usar la clave.
import L from 'leaflet';

const KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY as string | undefined;
const ATTR = 'Map data © Google';

/** Estilo en formato Google Maps (featureType / elementType / stylers). Los colores salen de los tokens del DS. */
function styleJson(tok: (name: string) => string) {
  const hide = { visibility: 'off' };
  return [
    { elementType: 'geometry', stylers: [{ color: tok('--n1') }] },
    { elementType: 'labels.icon', stylers: [hide] },
    { elementType: 'labels.text.fill', stylers: [{ color: tok('--n5') }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: tok('--white') }] },
    { featureType: 'poi', stylers: [hide] },
    { featureType: 'transit', stylers: [hide] },
    { featureType: 'administrative.land_parcel', stylers: [hide] },
    { featureType: 'administrative.neighborhood', stylers: [hide] },
    { featureType: 'road', elementType: 'geometry.fill', stylers: [{ color: tok('--white') }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: tok('--n3') }] },
    { featureType: 'road.local', elementType: 'labels', stylers: [hide] },
    { featureType: 'road.arterial', elementType: 'labels', stylers: [hide] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: tok('--b1') }] },
    { featureType: 'water', elementType: 'labels', stylers: [hide] },
  ];
}

// Equivalente en el formato de `apistyle` (poi=2, transit=4, agua=6, caminos=49; s=saturación, l=luminosidad).
const API_STYLE = encodeURIComponent('s.t:2|p.v:off,s.t:4|p.v:off,s.t:0|s.e:l.i|p.v:off,s.t:49|s.e:l|p.v:off,s.t:0|p.s:-100,s.t:0|p.l:30');

export function addBaseLayer(map: L.Map, tok: (name: string) => string) {
  const layer = L.tileLayer('', { attribution: ATTR, maxZoom: 19, tileSize: 256, subdomains: '0123' });
  if (!KEY) {
    layer.setUrl(`https://mt{s}.google.com/vt/lyrs=m&hl=en&gl=CL&x={x}&y={y}&z={z}&apistyle=${API_STYLE}`);
    layer.addTo(map);
    return;
  }
  fetch(`https://tile.googleapis.com/v1/createSession?key=${KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mapType: 'roadmap', language: 'en-US', region: 'CL', scale: 'scaleFactor1x', styles: styleJson(tok) }),
  })
    .then((r) => r.json())
    .then((s: { session: string }) => {
      layer.setUrl(`https://tile.googleapis.com/v1/2dtiles/{z}/{x}/{y}?session=${s.session}&key=${KEY}`);
      layer.addTo(map);
    })
    .catch(() => undefined);
}
