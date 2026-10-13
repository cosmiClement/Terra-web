# Checkout

Dueño de la identificación y revisión previa del pedido. `domain/order.ts` contiene los tipos y validaciones; `application/prepare-checkout.ts` prepara una revisión local; `components/checkout-page.tsx` conecta el formulario con el carrito. `index.ts` es la API pública.

La ruta `/checkout` recopila datos de contacto y modalidad solicitada, permite revisar la selección y genera un ticket local imprimible con folio local. El ticket es un comprobante de solicitud pendiente, no registra una venta ni un pago. Se pierde al cerrar o recargar la pantalla; el pago queda fuera de la app hasta integrar un servicio real. La opción de invitado se controla mediante `src/config/storefront.ts` y está desactivada hasta que se confirme la política de la tienda.
