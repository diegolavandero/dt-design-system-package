import { useEffect, useState, type ComponentType } from 'react';
import TutorialMonitoring from '@/screens/TutorialMonitoring';
import UsersSettings from '@/screens/UsersSettings';
import HelpCenter from '@/screens/HelpCenter';
import DocsApp from '@/docs/DocsApp';

/** Prototipos de pantalla: `#/monitoreo`, `#/usuarios`, `#/ayuda`. Todo lo demás es el sitio de documentación (`#overview`, `#colors`…). */
const SCREENS: Record<string, ComponentType> = {
  monitoreo: TutorialMonitoring,
  usuarios: UsersSettings,
  ayuda: HelpCenter,
};

const screenKey = () => (location.hash.startsWith('#/') ? location.hash.slice(2) : '');

export default function App() {
  const [key, setKey] = useState(screenKey);
  useEffect(() => {
    const on = () => setKey(screenKey());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  const Screen = SCREENS[key];
  return Screen ? <Screen /> : <DocsApp />;
}
