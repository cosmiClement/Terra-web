# Catalogo API para Frontend

Documentacion de los endpoints publicos para mostrar el catalogo de Terra.

## URL base

En desarrollo:

```text
http://localhost:3000/api
```

En produccion, reemplaza la URL por el dominio del backend.

Las rutas publicas no requieren token de autenticacion.

## Categorias

### Listar categorias

```http
GET /categories?active=true&page=1&limit=20&q=colchones
```

Query params opcionales:

| Parametro | Tipo | Descripcion |
|---|---|---|
| `active` | boolean | `true` muestra solo categorias activas |
| `page` | number | Pagina, por defecto `1` |
| `limit` | number | Registros por pagina, maximo `100` |
| `q` | string | Busca por nombre |

Respuesta:

```json
{
  "items": [
    {
      "id": "uuid",
      "name": "Colchones",
      "slug": "colchones",
      "description": "Descripcion de la categoria",
      "image_url": "https://storage.supabase.co/category.jpg",
      "is_active": true,
      "created_at": "2026-10-13T19:54:31.284Z",
      "updated_at": "2026-10-13T19:54:31.284Z",
      "_count": {
        "products": 4
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "pages": 1
  }
}
```

### Obtener una categoria

```http
GET /categories/:id
```

Incluye los productos activos relacionados:

```json
{
  "id": "uuid",
  "name": "Colchones",
  "slug": "colchones",
  "description": "Descripcion de la categoria",
  "image_url": null,
  "is_active": true,
  "created_at": "2026-10-13T19:54:31.284Z",
  "updated_at": "2026-10-13T19:54:31.284Z",
  "products": []
}
```

## Productos

### Listar productos

```http
GET /products?active=true&page=1&limit=20&q=terra&category_id=uuid
```

Query params opcionales:

| Parametro | Tipo | Descripcion |
|---|---|---|
| `active` | boolean | `true` muestra solo productos activos |
| `page` | number | Pagina, por defecto `1` |
| `limit` | number | Registros por pagina, maximo `100` |
| `q` | string | Busca por nombre, referencia o marca |
| `category_id` | UUID | Filtra por categoria |

Respuesta:

```json
{
  "items": [
    {
      "id": "uuid",
      "category_id": "uuid",
      "name": "Colchon Terra Ultra Confort",
      "slug": "colchon-terra-ultra-confort",
      "reference": "MAT-001",
      "description": "Descripcion del producto",
      "brand": "Terra",
      "is_active": true,
      "created_at": "2026-10-13T19:54:31.284Z",
      "updated_at": "2026-10-13T19:54:31.284Z",
      "categories": {
        "id": "uuid",
        "name": "Colchones",
        "slug": "colchones",
        "description": null,
        "image_url": null,
        "is_active": true,
        "created_at": "2026-10-13T19:54:31.284Z",
        "updated_at": "2026-10-13T19:54:31.284Z"
      },
      "product_images": [
        {
          "id": "uuid",
          "product_id": "uuid",
          "image_url": "https://storage.supabase.co/product.jpg",
          "alt_text": "Colchon Terra",
          "sort_order": 0,
          "is_primary": true,
          "created_at": "2026-10-13T19:54:31.284Z"
        }
      ],
      "product_variants": [
        {
          "id": "uuid",
          "product_id": "uuid",
          "name": "Queen",
          "sku": "MAT-001-QUEEN",
          "size": "Queen",
          "color": null,
          "price_minor": "129900",
          "currency": "BOB",
          "is_active": true,
          "created_at": "2026-10-13T19:54:31.284Z",
          "updated_at": "2026-10-13T19:54:31.284Z"
        }
      ],
      "_count": {
        "product_variants": 1
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "pages": 1
  }
}
```

### Obtener un producto

```http
GET /products/:id
```

Devuelve el mismo objeto completo de producto, incluyendo categoria, imagenes, variantes y cantidad de variantes.

## Promociones

### Listar promociones

```http
GET /promotions?active=true
```

Respuesta:

```json
[
  {
    "id": "uuid",
    "name": "Oferta de temporada",
    "description": "Promocion de ejemplo",
    "badge": "-20%",
    "discount_type": "percentage",
    "discount_value": "20.00",
    "starts_at": "2026-10-01T00:00:00.000Z",
    "ends_at": "2026-10-31T23:59:59.000Z",
    "is_active": true,
    "created_at": "2026-10-13T19:54:31.284Z",
    "updated_at": "2026-10-13T19:54:31.284Z",
    "promotion_products": [
      {
        "promotion_id": "uuid",
        "product_id": "uuid",
        "promotional_price_minor": "99900",
        "original_price_minor": "129900",
        "currency": "BOB",
        "products": {
          "id": "uuid",
          "name": "Colchon Terra Ultra Confort",
          "slug": "colchon-terra-ultra-confort",
          "reference": "MAT-001",
          "is_active": true
        }
      }
    ]
  }
]
```

`discount_type` puede ser `percentage` o `fixed`.

## Tiendas e inventario

### Listar tiendas activas

```http
GET /inventory/stores
```

Respuesta:

```json
[
  {
    "id": "uuid",
    "name": "Terra Centro",
    "address": "Av. Principal 123",
    "phone": "+59170000000",
    "is_active": true,
    "created_at": "2026-10-13T19:54:31.284Z",
    "updated_at": "2026-10-13T19:54:31.284Z"
  }
]
```

### Consultar inventario

```http
GET /inventory?store_id=uuid&product_variant_id=uuid
```

Respuesta:

```json
[
  {
    "id": "uuid",
    "store_id": "uuid",
    "product_variant_id": "uuid",
    "quantity_available": 10,
    "quantity_reserved": 2,
    "updated_at": "2026-10-13T19:54:31.284Z",
    "stores": {
      "id": "uuid",
      "name": "Terra Centro",
      "address": "Av. Principal 123",
      "phone": "+59170000000",
      "is_active": true
    },
    "product_variants": {
      "id": "uuid",
      "product_id": "uuid",
      "name": "Queen",
      "sku": "MAT-001-QUEEN",
      "size": "Queen",
      "color": null,
      "price_minor": "129900",
      "currency": "BOB",
      "is_active": true
    }
  }
]
```

## Reglas para el frontend

### Precios

Los precios terminados en `_minor` se envian como texto porque en la base de datos son `BigInt`.

Para mostrar `129900` como bolivianos:

```js
const formatPrice = (minor, currency = "BOB") =>
  new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency,
  }).format(Number(minor) / 100);
```

### Imagen principal

Usa primero la imagen con `is_primary: true`. Si no existe, usa la primera imagen ordenada por `sort_order`.

```js
const getProductImage = (product) =>
  product.product_images.find((image) => image.is_primary) ||
  product.product_images[0] ||
  null;
```

### Disponibilidad

El endpoint de productos no incluye inventario. Para mostrar stock, consulta `/inventory?product_variant_id=:id` y suma `quantity_available` por tienda.

### Ejemplo de consumo

```js
const API_URL = "http://localhost:3000/api";

const response = await fetch(
  `${API_URL}/products?active=true&page=1&limit=20`
);

if (!response.ok) {
  throw new Error("No se pudo cargar el catalogo");
}

const { items: products, meta } = await response.json();
```

## Errores

Todas las respuestas de error siguen este formato:

```json
{
  "error": "Descripcion del error"
}
```

Los errores de validacion incluyen detalles:

```json
{
  "error": "Datos de entrada invalidos",
  "details": {
    "id": ["Invalid UUID"]
  }
}
```

Codigos usados:

| Codigo | Significado |
|---|---|
| `200` | Operacion exitosa |
| `201` | Registro creado |
| `204` | Eliminacion exitosa |
| `400` | Datos invalidos |
| `401` | Autenticacion requerida |
| `403` | Sin permisos |
| `404` | Recurso no encontrado |
| `409` | Conflicto de datos o inventario |
| `500` | Error interno |
