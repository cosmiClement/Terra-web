# Integracion Backend - Frontend

Guia completa para consumir la API de Terra desde el frontend.

## 1. Configuracion

### Desarrollo

```js
const API_URL = "http://localhost:5000/api";
```

### Produccion

Reemplaza `API_URL` por el dominio publico del backend.

Todas las rutas usan JSON:

```http
Content-Type: application/json
```

## 2. Cliente HTTP recomendado

```js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("supabase-access-token");

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new Error(body?.error || "Error inesperado del servidor");
  }

  return body;
}
```

No guardes el `service_role` de Supabase en el frontend. El frontend solo debe usar la sesion y el access token entregado por Supabase Auth.

## 3. Autenticacion

Las rutas privadas requieren:

```http
Authorization: Bearer <supabase-access-token>
```

El token se obtiene con el cliente de Supabase en el frontend:

```js
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});

if (error) throw error;

localStorage.setItem(
  "supabase-access-token",
  data.session.access_token
);
```

El backend valida el token contra Supabase y obtiene el usuario autenticado.

### Roles administrativos

Las operaciones administrativas consultan `public.users.role`.

Roles permitidos por defecto:

```text
admin
manager
```

El backend devuelve `403` si el usuario autenticado no tiene permisos.

## 4. Health check

```http
GET /api/health
```

Respuesta:

```json
{
  "status": "ok",
  "service": "terra-backend",
  "timestamp": "2026-10-13T20:00:00.000Z"
}
```

## 5. Categorias

### Publico

```http
GET    /api/categories
GET    /api/categories/:id
```

Filtros disponibles en `GET /api/categories`:

```text
?active=true&page=1&limit=20&q=colchones
```

### Administrador

```http
POST   /api/categories
PATCH  /api/categories/:id
DELETE /api/categories/:id
```

Crear categoria:

```json
{
  "name": "Colchones",
  "slug": "colchones",
  "description": "Categoria de colchones",
  "image_url": "https://example.com/colchones.jpg",
  "is_active": true
}
```

## 6. Productos

### Publico

```http
GET /api/products
GET /api/products/:id
```

Filtros:

```text
?active=true&page=1&limit=20&q=terra&category_id=<uuid>
```

Cada producto puede incluir:

- `categories`
- `product_images`
- `product_variants`
- `_count.product_variants`

### Administrador

```http
POST   /api/products
PATCH  /api/products/:id
DELETE /api/products/:id
POST   /api/products/:productId/variants
PATCH  /api/products/variants/:variantId
DELETE /api/products/variants/:variantId
POST   /api/products/:productId/images
DELETE /api/products/images/:imageId
```

Crear producto:

```json
{
  "category_id": "uuid",
  "name": "Colchon Terra Ultra",
  "slug": "colchon-terra-ultra",
  "reference": "MAT-001",
  "description": "Colchon de alta calidad",
  "brand": "Terra",
  "is_active": true
}
```

Crear variante:

```json
{
  "name": "Queen",
  "sku": "MAT-001-QUEEN",
  "size": "Queen",
  "color": null,
  "price_minor": "129900",
  "currency": "BOB",
  "is_active": true
}
```

Crear imagen:

```json
{
  "image_url": "https://example.com/producto.jpg",
  "alt_text": "Colchon Terra Ultra",
  "sort_order": 0,
  "is_primary": true
}
```

## 7. Promociones

### Publico

```http
GET /api/promotions
GET /api/promotions/:id
```

Filtro:

```text
?active=true
```

### Administrador

```http
POST   /api/promotions
PATCH  /api/promotions/:id
DELETE /api/promotions/:id
PUT    /api/promotions/:id/products/:productId
DELETE /api/promotions/:id/products/:productId
```

Crear promocion:

```json
{
  "name": "Oferta de temporada",
  "description": "Descuento especial",
  "badge": "-20%",
  "discount_type": "percentage",
  "discount_value": 20,
  "starts_at": "2026-10-01T00:00:00.000Z",
  "ends_at": "2026-10-31T23:59:59.000Z",
  "is_active": true
}
```

`discount_type` acepta `percentage` o `fixed`.

Asociar un producto:

```json
{
  "promotional_price_minor": "99900",
  "original_price_minor": "129900",
  "currency": "BOB"
}
```

## 8. Tiendas e inventario

### Publico

```http
GET /api/inventory/stores
GET /api/inventory
```

Filtros de inventario:

```text
?store_id=<uuid>&product_variant_id=<uuid>
```

### Administrador

```http
POST  /api/inventory/stores
PATCH /api/inventory/stores/:storeId
PUT   /api/inventory
POST  /api/inventory/:id/adjust
```

Crear tienda:

```json
{
  "name": "Terra Centro",
  "address": "Av. Principal 123",
  "phone": "+59170000000",
  "is_active": true
}
```

Crear o actualizar inventario:

```json
{
  "store_id": "uuid",
  "product_variant_id": "uuid",
  "quantity_available": 10,
  "quantity_reserved": 0
}
```

Ajustar inventario:

```json
{
  "delta": 5
}
```

## 9. Clientes

Todas las rutas de clientes requieren autenticacion.

### Perfil del cliente

```http
GET   /api/customers/me
PATCH /api/customers/me
```

El primer `GET /me` crea automaticamente el perfil si el usuario de Supabase todavia no tiene un registro en `public.customers`.

Actualizar perfil:

```json
{
  "name": "Juan Perez",
  "email": "juan@example.com",
  "phone": "+59170000000"
}
```

### Direcciones

```http
GET    /api/customers/me/addresses
POST   /api/customers/me/addresses
PATCH  /api/customers/me/addresses/:addressId
DELETE /api/customers/me/addresses/:addressId
```

Crear direccion:

```json
{
  "label": "Casa",
  "address": "Av. Principal 123",
  "city": "Santa Cruz",
  "reference": "Frente a la plaza",
  "is_default": true
}
```

### Administrador

```http
GET /api/customers
GET /api/customers/:id
```

## 10. Carritos

Todas las rutas requieren autenticacion.

```http
GET    /api/carts/current
GET    /api/carts/:id
POST   /api/carts/:id/items
PATCH  /api/carts/:id/items/:itemId
DELETE /api/carts/:id/items/:itemId
```

Agregar variante al carrito:

```json
{
  "product_variant_id": "uuid",
  "quantity": 2
}
```

Actualizar cantidad:

```json
{
  "quantity": 3
}
```

El backend toma el precio vigente de la variante. No envies el precio desde el frontend como fuente confiable.

## 11. Pedidos

### Cliente autenticado

```http
POST /api/orders
GET  /api/orders/mine
```

Crear pedido desde un carrito:

```json
{
  "cart_id": "uuid",
  "store_id": "uuid",
  "fulfillment_type": "delivery",
  "delivery_address": "Av. Principal 123, Santa Cruz",
  "notes": "Llamar antes de entregar"
}
```

`fulfillment_type` acepta `delivery` o `pickup`.

La creacion del pedido realiza en una transaccion:

1. Verifica que el carrito pertenezca al cliente.
2. Verifica que tenga productos.
3. Reserva el inventario de la tienda.
4. Calcula el subtotal.
5. Crea las lineas con snapshots del producto.
6. Crea el historial inicial.
7. Marca el carrito como `converted`.

### Administrador

```http
GET   /api/orders
GET   /api/orders/:id
PATCH /api/orders/:id/status
```

Cambiar estado:

```json
{
  "status": "confirmed",
  "note": "Pedido confirmado por tienda"
}
```

Estados permitidos:

```text
pending -> confirmed -> preparing -> ready -> completed
pending -> cancelled
confirmed -> cancelled
preparing -> cancelled
```

Al cancelar se libera el inventario reservado.

## 12. Pagos

Las rutas de pagos requieren rol administrativo.

```http
GET   /api/payments/orders/:orderId
POST  /api/payments/orders/:orderId
PATCH /api/payments/:id/status
```

Registrar pago:

```json
{
  "provider": "manual",
  "provider_transaction_id": "TX-123456",
  "status": "paid",
  "amount_minor": "129900",
  "currency": "BOB"
}
```

Estados de pago:

```text
pending
paid
failed
refunded
```

Si se vuelve a enviar el mismo `provider_transaction_id`, el backend devuelve el pago existente y evita duplicarlo.

## 13. Formato de respuestas

### Listas paginadas

```json
{
  "items": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "pages": 0
  }
}
```

### Precios

Los campos terminados en `_minor` son precios en centavos y se envian como texto:

```json
{
  "price_minor": "129900",
  "currency": "BOB"
}
```

Para mostrar el precio:

```js
const formatPrice = (value, currency = "BOB") =>
  new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency,
  }).format(Number(value) / 100);
```

## 14. Errores

Respuesta normal:

```json
{
  "error": "Descripcion del error"
}
```

Error de validacion:

```json
{
  "error": "Datos de entrada invalidos",
  "details": {
    "quantity": ["Too small: expected number to be >0"]
  }
}
```

Codigos:

| Codigo | Uso |
|---:|---|
| `200` | Consulta o actualizacion exitosa |
| `201` | Recurso creado |
| `204` | Eliminacion exitosa sin contenido |
| `400` | Datos invalidos |
| `401` | Token faltante o invalido |
| `403` | Usuario sin permisos |
| `404` | Recurso inexistente |
| `409` | Conflicto, duplicado o inventario insuficiente |
| `503` | Servicio de autenticacion no configurado |
| `500` | Error interno |

## 15. Flujo recomendado de compra

```text
1. GET /categories
2. GET /products?active=true
3. GET /products/:id
4. Usuario inicia sesion con Supabase
5. GET /customers/me
6. GET /carts/current
7. POST /carts/:id/items
8. GET /carts/:id
9. POST /orders
10. Esperar confirmacion del pedido
11. Consultar GET /orders/mine
```

## 16. Checklist de configuracion

Backend `.env`:

```env
DATABASE_URL=postgresql://...
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-anon-key
ADMIN_ROLES=admin,manager
```

Frontend:

```env
VITE_API_URL=http://localhost:5000/api
```

No publiques nunca:

- `DATABASE_URL` en el frontend.
- `SUPABASE_SERVICE_ROLE_KEY` en el frontend.
- Contraseñas de Supabase.
- Tokens de usuarios en URLs.
