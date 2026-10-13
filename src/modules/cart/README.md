# Carrito

Dueño de los artículos y cantidades de la sesión. `domain/` maneja artículos, importes y operaciones; `application/cart-context.tsx` comparte el estado por medio de `CartProvider` y `useCart`; `components/cart-page.tsx` muestra y modifica el carrito; `index.ts` publica la API del módulo.

La ruta `/cart` permite revisar imagen, modelo, precio, descuentos promocionales disponibles, cantidades, subtotal y total provisional. El estado vive en memoria mientras se navega; almacenamiento persistente queda para integrar.
