export interface NavItem { id: string; label: string; i18n?: string; status?: string; icon?: string | null; path: string; renderer: string }
export interface NavGroup { group: string; i18n?: string; tab: 'desktop' | 'mobile'; items: NavItem[] }
export const NAV: NavGroup[] = [
 {
  "group": "Getting started",
  "i18n": "nav.gettingStarted",
  "tab": "desktop",
  "items": [
   {
    "id": "overview",
    "label": "Home",
    "i18n": "nav.readme",
    "icon": "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10",
    "path": "sections/overview.json",
    "renderer": "overview"
   },
   {
    "id": "changelog",
    "label": "Changelog",
    "i18n": "nav.changelog",
    "icon": "M12 22A10 10 0 1 0 12 2A10 10 0 0 0 12 22ZM12 6v6l4 2",
    "path": "sections/changelog.json",
    "renderer": "changelog"
   },
   {
    "id": "brand",
    "label": "Brand & products",
    "i18n": "nav.brand",
    "status": "in-progress",
    "icon": "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.8 0 1.5-.7 1.5-1.5 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.8.7-1.5 1.5-1.5H16c3.3 0 6-2.7 6-6 0-4.4-4.5-8-10-8z",
    "path": "sections/brand.json",
    "renderer": "brand"
   },
   {
    "id": "voice",
    "label": "Voice & content",
    "i18n": "nav.voice",
    "status": "in-progress",
    "icon": "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
    "path": "sections/voice.json",
    "renderer": "voice"
   }
  ]
 },
 {
  "group": "Foundations",
  "i18n": "nav.foundations",
  "tab": "desktop",
  "items": [
   {
    "id": "colors",
    "label": "Colors",
    "i18n": "nav.colors",
    "status": "ready",
    "icon": "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.8 0 1.5-.7 1.5-1.5 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.8.7-1.5 1.5-1.5H16c3.3 0 6-2.7 6-6 0-4.4-4.5-8-10-8z",
    "path": "sections/foundations/colors.json",
    "renderer": "colors"
   },
   {
    "id": "typography",
    "label": "Typography",
    "i18n": "nav.typography",
    "status": "ready",
    "icon": "M4 7V4h16v3M9 20h6M12 4v16",
    "path": "sections/foundations/typography.json",
    "renderer": "typography"
   },
   {
    "id": "spacing",
    "label": "Spacing",
    "i18n": "nav.spacing",
    "status": "ready",
    "icon": "M3 6h18M3 12h18M3 18h18",
    "path": "sections/foundations/spacing.json",
    "renderer": "spacing"
   },
   {
    "id": "radii",
    "label": "Radii",
    "i18n": "nav.radii",
    "status": "ready",
    "icon": "M3 8a5 5 0 0 1 5-5h13v18H8a5 5 0 0 1-5-5z",
    "path": "sections/foundations/radii.json",
    "renderer": "radii"
   },
   {
    "id": "shadows",
    "label": "Shadows",
    "i18n": "nav.shadows",
    "status": "ready",
    "icon": "M3 3h14v14H3zM7 17v4h14V7h-4",
    "path": "sections/foundations/shadows.json",
    "renderer": "shadows"
   },
   {
    "id": "iconography",
    "label": "Iconography",
    "i18n": "nav.iconography",
    "status": "in-progress",
    "icon": "M12 2 15 8 22 9 17 14 18 21 12 17 6 21 7 14 2 9 9 8 12 2",
    "path": "sections/foundations/iconography.json",
    "renderer": "iconography"
   }
  ]
 },
 {
  "group": "Components",
  "i18n": "nav.components",
  "tab": "desktop",
  "items": [
   {
    "id": "buttons",
    "label": "Buttons",
    "i18n": "nav.buttons",
    "status": "ready",
    "icon": "M3 9h18v6H3z",
    "path": "sections/components/buttons.json",
    "renderer": "buttons"
   },
   {
    "id": "inputs",
    "label": "Inputs & Dropdowns",
    "i18n": "nav.inputs",
    "status": "ready",
    "icon": "M3 7h18v10H3zM7 12h4",
    "path": "sections/components/inputs.json",
    "renderer": "inputs"
   },
   {
    "id": "tooltip",
    "label": "Tooltip",
    "i18n": "nav.tooltip",
    "status": "in-progress",
    "icon": "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z",
    "path": "sections/components/tooltip.json",
    "renderer": "tooltip"
   },
   {
    "id": "selection",
    "label": "Selection controls",
    "i18n": "nav.selection",
    "status": "ready",
    "icon": "M9 11 12 14 22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
    "path": "sections/components/selection.json",
    "renderer": "selection"
   },
   {
    "id": "image-uploader",
    "label": "Image uploader",
    "i18n": "nav.imageUploader",
    "status": "ready",
    "icon": "M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8M4 20a8 8 0 1 1 16 0M12 14v4M10 16h4",
    "path": "sections/components/image-uploader.json",
    "renderer": "imageUploader"
   },
   {
    "id": "empty-state",
    "label": "Empty state",
    "i18n": "nav.emptyState",
    "status": "ready",
    "icon": "M3 3h18v18H3zM8 12h8",
    "path": "sections/components/empty-state.json",
    "renderer": "emptyState"
   },
   {
    "id": "chips",
    "label": "Pills / Tags",
    "i18n": "nav.chips",
    "status": "ready",
    "icon": "M12 2 15 8 22 9 17 14 18 21 12 17 6 21 7 14 2 9 9 8 12 2",
    "path": "sections/components/chips.json",
    "renderer": "chips"
   },
   {
    "id": "alerts",
    "label": "Alerts / Toasts",
    "i18n": "nav.alerts",
    "status": "ready",
    "icon": "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
    "path": "sections/components/alerts.json",
    "renderer": "alerts"
   },
   {
    "id": "modal",
    "label": "Modal",
    "i18n": "nav.modal",
    "status": "in-progress",
    "icon": "M2 4h20v16H2zM2 9h20",
    "path": "sections/components/modal.json",
    "renderer": "modal"
   },
   {
    "id": "table",
    "label": "Tables",
    "i18n": "nav.table",
    "status": "ready",
    "icon": "M3 3h18v18H3zM3 9h18M3 15h18M9 3v18",
    "path": "sections/components/table.json",
    "renderer": "table"
   },
   {
    "id": "sidebar-comp",
    "label": "Sidebar",
    "i18n": "nav.sidebar",
    "status": "in-progress",
    "icon": "M3 3h18v18H3zM9 3v18",
    "path": "sections/components/sidebar.json",
    "renderer": "sidebar"
   },
   {
    "id": "topbar-comp",
    "label": "Topbar",
    "i18n": "nav.topbar",
    "status": "ready",
    "icon": "M3 3h18v18H3zM3 9h18",
    "path": "sections/components/topbar.json",
    "renderer": "topbar"
   },
   {
    "id": "filters",
    "label": "Filters",
    "i18n": "nav.filters",
    "status": "in-progress",
    "icon": "M18,28H14a2,2,0,0,1-2-2V18.41L4.59,11A2,2,0,0,1,4,9.59V6a2,2,0,0,1,2-2H26a2,2,0,0,1,2,2V9.59A2,2,0,0,1,27.41,11L20,18.41V26A2,2,0,0,1,18,28ZM6,6V9.59l8,8V26h4V17.59l8-8V6Z",
    "path": "sections/components/filters.json",
    "renderer": "filters"
   },
   {
    "id": "mappins",
    "label": "Map elements",
    "i18n": "nav.mappins",
    "status": "in-progress",
    "icon": "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0",
    "path": "sections/components/mappins.json",
    "renderer": "mappins"
   }
  ]
 },
 {
  "group": "Pages",
  "i18n": "nav.pages",
  "tab": "desktop",
  "items": [
   {
    "id": "pages-table",
    "label": "Table page",
    "i18n": "nav.pages.table",
    "status": "ready",
    "icon": "M2 3h20v14H2zM8 21h8M12 17v4",
    "path": "sections/pages/table-page.json",
    "renderer": "tablepage"
   },
   {
    "id": "pages-form",
    "label": "Form page",
    "i18n": "nav.pages.form",
    "status": "ready",
    "icon": "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M12 12h4M12 16h4M8 12h.01M8 16h.01",
    "path": "sections/pages/form-page.json",
    "renderer": "formpage"
   }
  ]
 },
 {
  "group": "Data",
  "i18n": "nav.data",
  "tab": "desktop",
  "items": [
   {
    "id": "charts",
    "label": "Charts",
    "i18n": "nav.charts",
    "status": "in-progress",
    "icon": "M5 21V10M12 21V3M19 21V13",
    "path": "sections/data/charts.json",
    "renderer": "charts"
   },
   {
    "id": "dataviz",
    "label": "Data viz palette",
    "i18n": "nav.dataviz",
    "icon": "M18 20 18 10M12 20 12 4M6 20 6 14",
    "path": "sections/data/dataviz.json",
    "renderer": "dataviz"
   },
   {
    "id": "serviceunits",
    "label": "Service units",
    "i18n": "nav.serviceunits",
    "icon": "M12 22A10 10 0 1 0 12 2A10 10 0 0 0 12 22ZM12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0",
    "path": "sections/data/service-units.json",
    "renderer": "serviceunits"
   }
  ]
 },
 {
  "group": "Assets",
  "i18n": "nav.assets",
  "tab": "desktop",
  "items": [
   {
    "id": "logos",
    "label": "Logos",
    "i18n": "nav.logos",
    "status": "in-progress",
    "icon": "M3 3h18v18H3zM3 9h18M9 3v18",
    "path": "sections/assets/logos.json",
    "renderer": "logos"
   }
  ]
 },
 {
  "group": "Patterns",
  "i18n": "nav.patterns",
  "tab": "desktop",
  "items": [
   {
    "id": "screen-examples",
    "label": "Screen examples",
    "i18n": "nav.screenExamples",
    "icon": "M2 3h20v14H2zM8 21h8M12 17v4",
    "path": "sections/patterns/screen-examples.json",
    "renderer": "screenexamples"
   }
  ]
 },
 {
  "group": "Resources",
  "i18n": "nav.resources",
  "tab": "desktop",
  "items": [
   {
    "id": "figma",
    "label": "Figma source",
    "i18n": "nav.figma",
    "icon": null,
    "path": "sections/figma.json",
    "renderer": "figma"
   }
  ]
 },
 {
  "group": "Backlog",
  "i18n": "nav.backlog",
  "tab": "desktop",
  "items": [
   {
    "id": "backlog",
    "label": "Planned components",
    "i18n": "nav.backlog.items",
    "icon": "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M12 12h4M12 16h4M8 12h.01M8 16h.01",
    "path": "sections/backlog.json",
    "renderer": "backlog"
   }
  ]
 },
 {
  "group": "Drafts",
  "i18n": "nav.drafts",
  "tab": "desktop",
  "items": [
   {
    "id": "drafts",
    "label": "Draft components",
    "i18n": "nav.drafts.components",
    "icon": "M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",
    "path": "sections/drafts.json",
    "renderer": "drafts"
   }
  ]
 },
 {
  "group": "App móvil — Drivers",
  "i18n": "nav.mobile",
  "tab": "mobile",
  "items": [
   {
    "id": "mobile-overview",
    "label": "Introducción",
    "i18n": "nav.mobile.overview",
    "icon": "M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM11 18h2",
    "path": "sections/mobile/overview.json",
    "renderer": "mOverview"
   }
  ]
 },
 {
  "group": "Componentes móviles",
  "i18n": "nav.mobile.components",
  "tab": "mobile",
  "items": [
   {
    "id": "mobile-topbar",
    "label": "Top app bar",
    "i18n": "nav.mobile.topbar",
    "status": "ready",
    "icon": "M3 3h18v18H3zM3 9h18",
    "path": "sections/mobile/topbar.json",
    "renderer": "mTopbar"
   },
   {
    "id": "mobile-nav",
    "label": "Menú lateral",
    "i18n": "nav.mobile.nav",
    "status": "ready",
    "icon": "M3 3h18v18H3zM9 3v18M5 7h2M5 11h2",
    "path": "sections/mobile/nav.json",
    "renderer": "mNav"
   },
   {
    "id": "mobile-buttons",
    "label": "Botones",
    "i18n": "nav.mobile.buttons",
    "status": "ready",
    "icon": "M3 9h18v6H3z",
    "path": "sections/mobile/buttons.json",
    "renderer": "mButtons"
   },
   {
    "id": "mobile-inputs",
    "label": "Inputs",
    "i18n": "nav.mobile.inputs",
    "status": "ready",
    "icon": "M3 7h18v10H3zM7 12h4",
    "path": "sections/mobile/inputs.json",
    "renderer": "mInputs"
   },
   {
    "id": "mobile-cards",
    "label": "Cards",
    "i18n": "nav.mobile.cards",
    "status": "ready",
    "icon": "M3 5h18v14H3zM3 9h18",
    "path": "sections/mobile/cards.json",
    "renderer": "mCards"
   },
   {
    "id": "mobile-lists",
    "label": "Listas y filtros",
    "i18n": "nav.mobile.lists",
    "status": "ready",
    "icon": "M3 5h18M3 12h18M3 19h18",
    "path": "sections/mobile/lists.json",
    "renderer": "mLists"
   },
   {
    "id": "mobile-bottom-sheets",
    "label": "Bottom sheets",
    "i18n": "nav.mobile.bottomSheets",
    "status": "ready",
    "icon": "M3 4h18v16H3zM3 12h18",
    "path": "sections/mobile/bottom-sheets.json",
    "renderer": "mBottomSheets"
   },
   {
    "id": "mobile-toasts",
    "label": "Toasts y banners",
    "i18n": "nav.mobile.toasts",
    "status": "ready",
    "icon": "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
    "path": "sections/mobile/toasts.json",
    "renderer": "mToasts"
   },
   {
    "id": "mobile-pod",
    "label": "Pruebas de entrega",
    "i18n": "nav.mobile.pod",
    "status": "ready",
    "icon": "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
    "path": "sections/mobile/pod.json",
    "renderer": "mPod"
   },
   {
    "id": "mobile-order-management",
    "label": "Gestión de órdenes",
    "i18n": "nav.mobile.orderManagement",
    "status": "ready",
    "icon": "M9 11l3 3L22 4M3 7h6M3 12h4M3 17h4",
    "path": "sections/mobile/order-management.json",
    "renderer": "mOrderManagement"
   },
   {
    "id": "mobile-maps",
    "label": "Mapa",
    "i18n": "nav.mobile.maps",
    "status": "ready",
    "icon": "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0",
    "path": "sections/mobile/maps.json",
    "renderer": "mMaps"
   }
  ]
 },
 {
  "group": "Pantallas",
  "i18n": "nav.mobile.screens",
  "tab": "mobile",
  "items": [
   {
    "id": "mobile-screen-login",
    "label": "Login",
    "i18n": "nav.mobile.screens.login",
    "status": "ready",
    "icon": "M15 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6M10 17l5-5-5-5M15 12H3",
    "path": "sections/mobile/screens-login.json",
    "renderer": "mScreenLogin"
   },
   {
    "id": "mobile-screen-map-list",
    "label": "Mapa + Lista",
    "i18n": "nav.mobile.screens.mapList",
    "status": "ready",
    "icon": "M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM5 13h14",
    "path": "sections/mobile/screens-map-list.json",
    "renderer": "mScreenMapList"
   },
   {
    "id": "mobile-screen-route-list",
    "label": "Lista de rutas",
    "i18n": "nav.mobile.screens.routeList",
    "status": "ready",
    "icon": "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
    "path": "sections/mobile/screens-route-list.json",
    "renderer": "mScreenRouteList"
   }
  ]
 }
] as NavGroup[];
