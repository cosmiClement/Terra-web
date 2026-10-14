# Prompt para crear la base de datos en Supabase

Actúa como arquitecto de bases de datos especializado en PostgreSQL y Supabase.

Necesito crear la base de datos para una tienda online de colchones y muebles llamada Terra Autoservicio.

Genera un único script SQL compatible con Supabase y PostgreSQL. El script debe poder ejecutarse desde cero en el SQL Editor de Supabase sin errores.

## Requisitos generales

1. Usar UUID como identificador principal en todas las tablas.
2. Usar `gen_random_uuid()` como valor por defecto.
3. Incluir `created_at` y `updated_at` en las tablas correspondientes.
4. Crear una función y triggers para actualizar automáticamente `updated_at`.
5. Usar claves foráneas con restricciones apropiadas.
6. Crear índices para búsquedas frecuentes.
7. Usar valores monetarios enteros en centavos:
   - `price_minor BIGINT`
   - `currency VARCHAR(3) DEFAULT 'BOB'`
   - Nunca usar `FLOAT` para precios.
8. Todos los precios deben estar expresados en bolivianos BOB.
9. Usar nombres de tablas y columnas en inglés y snake_case.
10. Incluir comentarios SQL explicando las partes importantes.
11. Usar `CREATE TABLE IF NOT EXISTS` cuando sea posible.
12. No eliminar datos existentes.
13. No incluir datos reales, tarjetas bancarias ni contraseñas en texto plano.

## Tablas

### `categories`

- `id`
- `name`
- `slug`
- `description`
- `image_url`
- `is_active`
- `created_at`
- `updated_at`

Ejemplos: Colchones, Sommiers, Camas, Muebles y Accesorios.

### `products`

- `id`
- `category_id`
- `name`
- `slug`
- `reference`
- `description`
- `brand`
- `is_active`
- `created_at`
- `updated_at`

### `product_images`

- `id`
- `product_id`
- `image_url`
- `alt_text`
- `sort_order`
- `is_primary`
- `created_at`

### `product_variants`

- `id`
- `product_id`
- `name`
- `sku`
- `size`
- `color`
- `price_minor`
- `currency`
- `is_active`
- `created_at`
- `updated_at`

### `promotions`

- `id`
- `name`
- `description`
- `badge`
- `discount_type`
- `discount_value`
- `starts_at`
- `ends_at`
- `is_active`
- `created_at`
- `updated_at`

`discount_type` debe permitir:

- `percentage`
- `fixed_amount`

### `promotion_products`

- `promotion_id`
- `product_id`
- `promotional_price_minor`
- `original_price_minor`
- `currency`

### `stores`

- `id`
- `name`
- `address`
- `phone`
- `is_active`
- `created_at`
- `updated_at`

### `inventory`

- `id`
- `store_id`
- `product_variant_id`
- `quantity_available`
- `quantity_reserved`
- `updated_at`

Agregar restricciones para evitar cantidades negativas.

### `customers`

- `id`
- `auth_user_id`
- `name`
- `email`
- `phone`
- `created_at`
- `updated_at`

Relacionar `auth_user_id` con `auth.users(id)` de Supabase cuando sea apropiado.

### `customer_addresses`

- `id`
- `customer_id`
- `label`
- `address`
- `city`
- `reference`
- `is_default`
- `created_at`
- `updated_at`

### `carts`

- `id`
- `customer_id`
- `session_id`
- `status`
- `created_at`
- `updated_at`

`status` debe permitir:

- `active`
- `abandoned`
- `converted`

### `cart_items`

- `id`
- `cart_id`
- `product_variant_id`
- `quantity`
- `unit_price_minor`
- `currency`
- `created_at`
- `updated_at`

### `orders`

- `id`
- `customer_id`
- `store_id`
- `status`
- `fulfillment_type`
- `delivery_address`
- `subtotal_minor`
- `discount_minor`
- `delivery_fee_minor`
- `total_minor`
- `currency`
- `ticket_number`
- `notes`
- `created_at`
- `updated_at`

`status` debe permitir:

- `pending`
- `confirmed`
- `preparing`
- `ready_for_pickup`
- `out_for_delivery`
- `completed`
- `cancelled`

`fulfillment_type` debe permitir:

- `store_pickup`
- `home_delivery`

### `order_items`

- `id`
- `order_id`
- `product_variant_id`
- `product_name`
- `sku`
- `quantity`
- `unit_price_minor`
- `discount_minor`
- `total_minor`
- `currency`
- `created_at`

Guardar `product_name`, `sku` y `unit_price` como copia histórica por si el producto cambia posteriormente.

### `order_status_history`

- `id`
- `order_id`
- `previous_status`
- `new_status`
- `changed_by`
- `note`
- `created_at`

### `payments`

- `id`
- `order_id`
- `provider`
- `provider_transaction_id`
- `status`
- `amount_minor`
- `currency`
- `paid_at`
- `created_at`

`status` debe permitir:

- `pending`
- `approved`
- `rejected`
- `refunded`

Nunca almacenar números completos de tarjetas, CVV ni contraseñas.

### `users`

- `id`
- `auth_user_id`
- `name`
- `email`
- `role`
- `is_active`
- `created_at`
- `updated_at`

`role` debe permitir:

- `admin`
- `seller`
- `warehouse`
- `support`

## Configuración requerida

Configurar también lo siguiente:

1. Primary keys y foreign keys.
2. Unique constraints para:
   - `categories.slug`
   - `products.slug`
   - `products.reference`
   - `product_variants.sku`
   - `customers.email`
   - `ticket_number`
3. Índices para:
   - `products.category_id`
   - `products.slug`
   - `products.is_active`
   - `product_variants.product_id`
   - `product_variants.sku`
   - `inventory.store_id`
   - `inventory.product_variant_id`
   - `orders.customer_id`
   - `orders.status`
   - `orders.created_at`
   - `promotion_products.product_id`
4. Restricciones `CHECK`:
   - Los precios no pueden ser negativos.
   - Las cantidades no pueden ser negativas.
   - `currency` debe ser `BOB`.
   - `discount_value` no puede ser negativo.
5. Relaciones:
   - `categories` tiene muchos `products`.
   - `products` tiene muchas `product_variants`.
   - `products` tiene muchas `product_images`.
   - `products` puede pertenecer a muchas `promotions`.
   - `stores` tiene muchos registros de `inventory`.
   - `customers` tiene muchos `carts`, `addresses` y `orders`.
   - `orders` tiene muchos `order_items`, `payments` y `order_status_history`.
6. Crear una función para generar `ticket_number` con formato:

```text
TERRA-YYYY-000001
```

7. Crear triggers para `updated_at`.

## Seguridad y RLS de Supabase

Crear Row Level Security compatible con Supabase:

- El catálogo activo puede ser leído públicamente.
- Los clientes solo pueden consultar y modificar sus propios datos.
- Los clientes solo pueden ver sus propios carritos y órdenes.
- Los usuarios con rol `admin`, `seller`, `warehouse` o `support` pueden gestionar datos según corresponda.
- El inventario solo puede ser modificado por `admin` o `warehouse`.
- Las órdenes pueden ser revisadas por `admin`, `seller` y `support`.
- Crear todas las políticas RLS necesarias.

## Datos de prueba

Crear datos de ejemplo únicamente para:

- 5 categorías.
- 2 productos.
- 3 variantes.
- 2 tiendas.
- Inventario demostrativo.

No crear usuarios falsos en `auth.users`.

## Consultas de verificación

Al final del script incluir consultas para:

- Listar categorías.
- Listar productos con sus categorías.
- Listar variantes y precios en BOB.
- Consultar inventario.
- Consultar órdenes.

## Formato de respuesta

Entrega la respuesta dividida en estas secciones:

1. Explicación breve del diseño.
2. Script SQL completo.
3. Orden recomendado para ejecutarlo en Supabase.
4. Cómo conectar estas tablas desde una aplicación Next.js.
5. Recomendaciones de seguridad.
6. Consultas de prueba.

Antes de entregar el script, revisa que sea válido para PostgreSQL/Supabase, que las dependencias entre tablas estén en el orden correcto y que las políticas RLS no permitan acceder a los datos privados de otros usuarios.
