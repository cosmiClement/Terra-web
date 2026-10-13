# Guía de contribución

## Límites de trabajo por equipo

| Equipo/área | Propiedad | Punto de entrada público |
| --- | --- | --- |
| Catálogo | Categorías, productos, precios promocionales y filtros | `src/modules/catalog/index.ts` |
| Carrito | Artículos, cantidades, subtotal y navegación al checkout | `src/modules/cart/index.ts` |
| Tienda | Composición de la página de inicio y cabecera | `src/modules/storefront/index.ts` |
| Cuenta | Perfil y validación de datos del cliente | `src/modules/account/index.ts` |
| Checkout | Validación de entrega y preparación del pedido | `src/modules/checkout/index.ts` |
| Soporte | Navegación compartida de la tienda | `src/modules/support/index.ts` |
| Compartido | Tipos técnicos transversales como `Result` | `src/modules/shared/index.ts` |
| Plataforma web | Rutas, layout, estilos globales y configuración | `app/`, `src/config/`, `src/components/` |

## Reglas para colaborar

- Mantén rutas y archivos especiales de Next.js en `app/`; organiza lógica y componentes en `src/`.
- Trabaja dentro del módulo propietario. Los módulos pueden importar otro módulo solo desde su `index.ts`, nunca desde sus carpetas internas.
- Dentro de un módulo, separa `domain/` (reglas y datos), `application/` (casos de uso), `components/` (interfaz) e `infrastructure/` (adaptadores) cuando esas responsabilidades existan.
- Usa Server Components por defecto y limita `"use client"` a las partes que necesitan estado o eventos.
- El catálogo es dueño de categorías/productos/promociones; el carrito es dueño de la selección y expone operaciones mediante su API pública.
- Las rutas públicas solo conectan páginas del App Router con la API pública de su módulo. Mantén reglas de dominio y casos de uso dentro de `src/modules/`.
- Cada microservicio futuro será dueño de sus datos. Publica contratos entre servicios en `packages/contracts/`.
- Registra decisiones duraderas en `docs/architecture/decisions/`.
- Si trabajas en paralelo, coordina cambios a la API pública antes de modificarla y evita editar archivos de otro módulo.

Antes de abrir una revisión, ejecuta `npm run lint` y `npm run build`. Describe alcance, decisiones y pasos de comprobación en la revisión.
