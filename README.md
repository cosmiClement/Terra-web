# Terra Autoservicio

Tienda web de colchones y muebles, desarrollada con Next.js App Router, React y TypeScript. La aplicación se organiza como monolito modular: cada dominio mantiene su interfaz, reglas y adaptadores, mientras Next.js compone las rutas.

## Inicio

Necesitas Node.js compatible con Next.js 16 y npm.

```bash
npm ci
npm run dev
```

Abre `http://localhost:3000`. Comandos disponibles: `npm run lint`, `npm run build` y `npm run start` (después de compilar).

## Mapa del proyecto

```text
app/                         Rutas y convenciones del App Router
  page.tsx                   Inicio
  catalog/page.tsx           Búsqueda y catálogo
  products/[id]/page.tsx     Detalle del producto
  cart/page.tsx              Carrito
  account/page.tsx           Perfil
  checkout/page.tsx          Identificación y revisión previa
src/
  components/ui/             Primitivas visuales compartidas
  components/layout/         Elementos generales de la aplicación
  config/                    Configuración de la web
  lib/api/                   Transporte HTTP
  lib/errors/                Errores técnicos compartidos
  modules/storefront/        Composición del inicio de tienda
  modules/catalog/           Categorías, productos y ofertas
  modules/cart/              Carrito y cantidades
  modules/checkout/          Entrega, pago y confirmación
  modules/account/           Perfil del cliente
  modules/support/           Ayuda y navegación de soporte
  modules/shared/            Conceptos de negocio realmente compartidos
  types/                     Tipos globales; no modelos privados de dominio
public/images/               Fotografías locales del diseño de Figma
public/icons/                Iconos SVG locales
packages/contracts/          Contratos entre aplicaciones/servicios
services/                    Scaffolds documentales de servicios futuros
infrastructure/              Scaffolds de despliegue
docs/architecture/           Documentación y decisiones de arquitectura
```

Los archivos especiales de rutas (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `route.ts`) permanecen en `app/`: Next.js ignora `src/app` si existe una carpeta `app/` en la raíz. Las páginas deben ser delgadas y componer módulos.

El carrito se comparte desde el layout raíz para mantener sus artículos al navegar entre rutas. El catálogo, precios, imágenes y promociones son datos de demostración. El checkout genera un ticket local imprimible de solicitud pendiente con folio temporal, pero no registra ventas ni procesa pagos; el ticket no se conserva después de cerrar o recargar la pantalla. Inventario, políticas de invitado, autenticación y modalidades de entrega requieren configuración/integración real. El catálogo ofrece filtros por nombre, modelo y categoría, y orden por precio; no inventa filtros de stock o popularidad.

## Límites del código

- Cada módulo es dueño de sus componentes, casos de uso, tipos y adaptadores. Para compartir funcionalidad entre dominios, expón una API pública pequeña en su `index.ts`; no importes internals de otro módulo.
- Deja los componentes de servidor como opción por defecto y añade `"use client"` solo a las partes interactivas que lo requieran.
- Usa `src/components/ui` para primitivas de presentación genéricas. La lógica de negocio no debe terminar en `src/lib` o `src/types`.
- Los módulos publican su API desde `src/modules/<módulo>/index.ts`. Otros módulos importan desde ese punto de entrada y no desde sus carpetas internas.
- En la página inicial, seleccionar una categoría filtra productos y promociones; agregar un producto/oferta actualiza el contador de carrito de la sesión.
- Empieza con módulos dentro de esta aplicación. Extrae un microservicio cuando tenga límites de dominio, propiedad de datos y necesidad de despliegue independientes.
- Los servicios e infraestructura existentes son scaffolds documentales; no incluyen runtimes, bases de datos ni despliegues ejecutables.
- No guardes secretos en Git. Documenta variables de entorno con nombres y descripciones, nunca con credenciales.

`@/*` apunta a `src/*`; `@app/*` apunta a `app/*`.

Antes de abrir una revisión, ejecuta `npm run lint` y `npm run build`. Consulta [CONTRIBUTING.md](CONTRIBUTING.md) para las pautas del equipo.
