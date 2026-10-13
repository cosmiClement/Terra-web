# Checkout

Dueño de la identificación y revisión previa del pedido. `domain/order.ts` contiene los tipos y validaciones; `application/prepare-checkout.ts` prepara una revisión local; `components/checkout-page.tsx` conecta el formulario con el carrito. `index.ts` es la API pública.

La ruta `/checkout` está conectada. La revisión no genera referencia ni confirma el pedido; el botón de pago queda deshabilitado hasta integrar un servicio real. La opción de invitado se controla mediante `src/config/storefront.ts` y está desactivada hasta que se confirme la política de la tienda.
