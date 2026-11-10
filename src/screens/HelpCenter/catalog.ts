/* ───────── Tutoriales (catálogo por nivel) ───────── */

export type TutorialStatus = 'pendiente' | 'en-progreso' | 'completado';

export interface Tutorial {
  id: string;
  name: string;
  status: TutorialStatus;
  /** `app` = tutorial de la app móvil. */
  group?: 'app';
  level: string;
  videoSeen?: boolean;
  done?: boolean;
}

export interface Level {
  name: string;
  level: string;
  tuts: Tutorial[];
}

const t = (level: string, id: string, name: string, status: TutorialStatus, group?: 'app'): Tutorial => ({ id, name, status, level, ...(group ? { group } : {}) });

export const INITIAL_CATALOG: Level[] = [
  {
    name: 'Nivel 100',
    level: '100',
    tuts: [
      t('100', 'n1-intro', 'Intro: Qué es DT y LM', 'completado'),
      t('100', 'n1-usuarios-web', 'Usuarios web', 'completado'),
      t('100', 'n1-usuarios-mov', 'Usuarios móviles', 'completado'),
      t('100', 'n1-vehiculos', 'Vehículos', 'en-progreso'),
      t('100', 'n1-centros', 'Centros de distribución', 'pendiente'),
      t('100', 'n1-subestados', 'Subestados y Pruebas de entrega', 'pendiente'),
      t('100', 'n1-agrupaciones', 'Agrupaciones', 'pendiente'),
      t('100', 'n1-notificaciones', 'Notificaciones', 'completado'),
      t('100', 'n1-importador', 'Importador básico', 'pendiente'),
      t('100', 'n1-mon-actividad', 'Módulos monitoreo: Actividad', 'en-progreso'),
      t('100', 'n1-mon-rutas', 'Módulos monitoreo: Rutas', 'pendiente'),
      t('100', 'n1-mon-ordenes', 'Módulos monitoreo: Órdenes', 'pendiente'),
      t('100', 'n1-mon-alertas', 'Módulos monitoreo: Alertas', 'pendiente'),
      t('100', 'n1-app-login', 'Inicio de sesión', 'completado', 'app'),
      t('100', 'n1-app-inicio', 'Inicio de ruta', 'pendiente', 'app'),
      t('100', 'n1-app-gestion', 'Gestión de las órdenes', 'pendiente', 'app'),
      t('100', 'n1-app-fin', 'Finalización de ruta', 'pendiente', 'app'),
    ],
  },
  {
    name: 'Nivel 200',
    level: '200',
    tuts: [
      t('200', 'n2-copiloto', 'Copiloto', 'en-progreso'),
      t('200', 'n2-config-cuenta', 'Configuración de la cuenta', 'pendiente'),
      t('200', 'n2-seguridad', 'Seguridad', 'pendiente'),
      t('200', 'n2-campos', 'Configuración avanzada (Campos personalizados)', 'pendiente'),
      t('200', 'n2-widget', 'Widget', 'pendiente'),
      t('200', 'n2-form-ruta', 'Formularios de Ruta', 'pendiente'),
      t('200', 'n2-operacion', 'Configuración de operación (hitos, ítems, emergencia)', 'pendiente'),
      t('200', 'n2-webhooks', 'Webhooks', 'pendiente'),
      t('200', 'n2-api', 'Configuración avanzada (Llaves API)', 'pendiente'),
      t('200', 'n2-mon', 'Módulos monitoreo (Estadística, Flota, Clientes)', 'pendiente'),
      t('200', 'n2-importador', 'Importador pickup y troncales', 'pendiente'),
      t('200', 'n2-app-copiloto', 'Copiloto (traspaso y gestión de guías)', 'pendiente', 'app'),
      t('200', 'n2-app-sync', 'Tipos de sincronización', 'pendiente', 'app'),
      t('200', 'n2-app-emergencia', 'Contactos y mensajes de emergencia', 'pendiente', 'app'),
      t('200', 'n2-app-mapas', 'Waze y Google Maps', 'pendiente', 'app'),
      t('200', 'n2-app-pickup', 'Pickup y Troncales', 'pendiente', 'app'),
      t('200', 'n2-app-masiva', 'Gestión masiva', 'pendiente', 'app'),
      t('200', 'n2-app-ordenes', 'Agregar / Eliminar órdenes de ruta', 'pendiente', 'app'),
      t('200', 'n2-app-form', 'Formularios', 'pendiente', 'app'),
      t('200', 'n2-app-reordenar', 'Reordenar ruta', 'pendiente', 'app'),
    ],
  },
  {
    name: 'Nivel 300',
    level: '300',
    tuts: [
      t('300', 'n3-reporteria', 'Reportería', 'pendiente'),
      t('300', 'n3-costos', 'Módulo de costos', 'pendiente'),
      t('300', 'n3-pin', 'Pin', 'pendiente'),
      t('300', 'n3-doble-medida', 'Doble medida', 'pendiente'),
      t('300', 'n3-documentos', 'Módulo de documentos', 'pendiente'),
      t('300', 'n3-cod', 'Cash on delivery', 'pendiente'),
      t('300', 'n3-retiro', 'Retiro en tienda', 'pendiente'),
      t('300', 'n3-app-agrupacion', 'Agrupación / Filtro de órdenes', 'pendiente', 'app'),
      t('300', 'n3-app-items', 'Escaneo de ítems', 'pendiente', 'app'),
      t('300', 'n3-app-validacion', 'Validación de carga', 'pendiente', 'app'),
      t('300', 'n3-app-doc', 'Escaneo de documentos', 'pendiente', 'app'),
      t('300', 'n3-app-llegue', 'Botón "Llegué"', 'pendiente', 'app'),
    ],
  },
];
