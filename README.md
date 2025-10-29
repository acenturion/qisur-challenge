## Qisur Challenge

Aplicación web construida con React, TypeScript y Vite. Incluye un dashboard, gestión de productos, componentes UI reutilizables y conexión a un WebSocket simulado para métricas en tiempo real.

### Cómo levantar el proyecto

Requisitos:
- Node.js 18+ y npm

Pasos:
1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Ambiente de desarrollo (HMR):
   ```bash
   npm run dev
   ```
   La app se sirve por defecto en `http://localhost:5173`.
3. Build de producción:
   ```bash
   npm run build
   ```
4. Previsualización del build:
   ```bash
   npm run preview
   ```

Scripts disponibles (desde `package.json`): `dev`, `build`, `preview`, `lint`.

### Tecnologías utilizadas

- React 19 + React DOM
- TypeScript
- Vite (rolldown-vite)
- Tailwind CSS 4 + `@tailwindcss/vite` + `tailwind-merge`
- Componentes UI utilitarios (inspirados en shadcn/ui) bajo `src/components/ui`
- React Hook Form + Zod (`@hookform/resolvers`, `react-hook-form`, `zod`)
- React Router
- ApexCharts (`apexcharts`, `react-apexcharts`)
- Cliente HTTP `axios`
- `mock-socket` para simular WebSocket en desarrollo
- ESLint + TypeScript-ESLint

### Nota sobre uso de IA

Se utilizó IA para acelerar la generación de algunos componentes y estructuras base (especialmente partes de `src/components/ui` y esqueletos de páginas). Todo el código generado fue revisado y adaptado manualmente para cumplir con las necesidades del proyecto.

### Estructura de carpetas

Vista general de `src/`:

```text
src/
  App.tsx                # Composición de layout y rutas principales
  App.css / index.css    # Estilos globales
  assets/                # Recursos estáticos (imágenes, íconos)
  components/            # Componentes reutilizables de la app
    ui/                  # Primitivas de UI (botones, inputs, tablas, etc.)
    CategoryDialog.tsx   # Diálogo para categorías
    Header.tsx           # Encabezado del layout
    HistoryStats.tsx     # Tarjetas/gráficos de métricas
    HistoryTable.tsx     # Tabla de historial
    Layout.tsx           # Layout con sidebar y header
    ProductCard.tsx      # Card de producto
    ProductForm.tsx      # Formulario de producto (RHForm + Zod)
    Sidebar.tsx          # Navegación lateral
  config/
    websocket.ts         # Cliente y helpers para WebSocket simulado
  context/
    Store.tsx            # Contexto global/estado compartido
  hooks/
    use-mobile.ts        # Hook utilitario (p.ej. detección móvil)
    use-websocket.ts     # Hook de conexión/suscripción a WebSocket
  lib/
    utils.ts             # Utilidades generales (clases, merges, etc.)
  pages/
    Dashboard.tsx        # Página principal del dashboard
    products/
      List.tsx           # Listado de productos
      New.tsx            # Alta de producto
      Edit.tsx           # Edición de producto
  utils/
    csv.ts               # Helpers para exportación/parseo CSV
  main.tsx               # Punto de entrada React + Router + Providers
```

Archivos de configuración relevantes en la raíz:
- `vite.config.ts`: configuración de Vite
- `tsconfig*.json`: configuración de TypeScript
- `eslint.config.js`: reglas de lint
- `index.html`: plantilla HTML base

### Licencia

Uso educativo/demostrativo.
