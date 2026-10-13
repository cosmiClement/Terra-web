# Catálogo

Dueño de las categorías, productos destacados, precios y promociones. La selección de categoría filtra tanto los productos como las promociones de la página de inicio.

- `domain/catalog-data.ts`: datos iniciales y tipos del catálogo.
- `application/filter-catalog.ts`: filtros por texto, referencia y categoría.
- `components/`: secciones y controles de presentación.
- `index.ts`: API pública para consumir el catálogo desde otros módulos.

Las rutas `/catalog` y `/products/[id]` están conectadas. Se pueden ordenar por precio porque existe un precio de demostración; no se ofrecen filtros de inventario, tamaño o popularidad ya que esos datos no están conectados.

Cuando se conecte una API, sustituye el origen estático dentro de este módulo sin trasladar su lógica a la tienda o al carrito.
