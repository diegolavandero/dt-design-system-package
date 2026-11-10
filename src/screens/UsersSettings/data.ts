import type { IconName } from '@/ds';
import type { SettingsGroup } from '@/ds';

export type UserStatus = 'Activo' | 'Bloqueado';

export interface WebUser {
  id: string;
  name: string;
  estado: UserStatus;
  user: string;
  role: string;
  last: string;
  /** Capacitación activa. Los usuarios nuevos parten desactivados; aquí algunos ya la completaron. */
  cap: boolean;
}

const u = (id: string, name: string, estado: UserStatus, user: string, role: string, last: string, cap: boolean): WebUser => ({ id, name, estado, user, role, last, cap });

export const INITIAL_USERS: WebUser[] = [
  u('u1', 'Maya Jonson', 'Activo', 'mayaj', 'Admin Master', '10-10-25 10:35 hrs', true),
  u('u2', 'Lucas Martinez', 'Bloqueado', 'lucasm', 'Personalizado', '10-10-25 11:00 hrs', false),
  u('u3', 'Liam Smith', 'Activo', 'liams', 'Admin 2', '10-10-25 11:00 hrs', true),
  u('u4', 'Aisha Patel', 'Bloqueado', 'aishap', 'QC', '10-10-25 11:15 hrs', false),
  u('u5', 'Tommy Nguyen', 'Activo', 'tomn', 'Planificador', '10-10-25 11:30 hrs', true),
  u('u6', 'Clara Lopez', 'Bloqueado', 'claral', 'QC', '10-10-25 12:00 hrs', false),
  u('u7', 'Rajesh Kumar', 'Activo', 'rajeshk', 'Planificador', '10-10-25 12:15 hrs', true),
  u('u8', 'Sofia Garcia', 'Bloqueado', 'sofig', 'QC', '10-10-25 12:30 hrs', false),
  u('u9', 'Kevin Brown', 'Activo', 'kevinb', 'Planificador', '10-10-25 12:45 hrs', false),
];

export const RAIL_ICONS: IconName[] = [
  'report-data', 'dashboard', 'network-3', 'document-multiple', 'delivery', 'chart-column', 'notification',
  'events', 'file-system', 'currency', 'return', 'white-paper', 'store', 'document-import',
];

export const SETTINGS_GROUPS: SettingsGroup[] = [
  { label: 'Cuentas', items: [{ label: 'Configuración de cuenta' }] },
  { label: 'Usuarios', items: [{ label: 'Usuarios web', count: 38 }, { label: 'Usuarios móviles', count: 59 }] },
  {
    label: 'Gestionar',
    items: ['Vehículos', 'Subestados', 'Pruebas de entrega', 'Formularios de ruta', 'Centros de distribución', 'Agrupaciones', 'Alertas', 'Notificaciones', 'Configuración de Operación'].map((label) => ({ label })),
  },
  {
    label: 'Configuración avanzada',
    items: ['Importar Órdenes', 'Campos personalizados', 'Llaves API', 'Webhooks', 'Etiquetas de órdenes', 'Seguridad', 'Módulo de costo'].map((label) => ({ label })),
  },
  { label: 'Widget', items: [{ label: 'Seguimiento de pedidos' }] },
];
