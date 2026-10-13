# Código de aplicación

Las rutas y convenciones de Next.js permanecen en `app/`. El código de producto vive aquí, organizado por dominio en `modules/`.

## Organización

- `components/ui/`: primitivas visuales reutilizables y sin lógica de dominio.
- `components/layout/`: piezas de estructura global que no pertenecen a una página concreta.
- `config/`: configuración de la aplicación.
- `lib/`: utilidades técnicas transversales, no reglas de negocio.
- `modules/`: áreas funcionales independientes con API pública en `index.ts`.
- `types/`: tipos realmente globales; prefiere tipos privados dentro del módulo dueño.
