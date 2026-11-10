import { useHashRoute } from '@/ds';
import type { ComponentType } from 'react';
import TutorialMonitoring from '@/screens/TutorialMonitoring';
import UsersSettings from '@/screens/UsersSettings';
import HelpCenter from '@/screens/HelpCenter';

const ROUTES: Record<string, ComponentType> = {
  monitoreo: TutorialMonitoring,
  usuarios: UsersSettings,
  ayuda: HelpCenter,
};

export default function App() {
  const route = useHashRoute('monitoreo');
  const Page = ROUTES[route] ?? TutorialMonitoring;
  return <Page />;
}
