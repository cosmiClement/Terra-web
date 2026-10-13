import type { CartLine } from "@/modules/cart";
import type { Result } from "@/modules/shared";
import { validateCheckoutDetails, type CheckoutDetails, type CheckoutReview } from "../domain/order";

export function prepareCheckout(
  details: CheckoutDetails,
  items: CartLine[],
  guestCheckoutAllowed: boolean,
): Result<CheckoutReview> {
  const validation = validateCheckoutDetails(details, guestCheckoutAllowed);

  if (!validation.ok) {
    return validation;
  }

  if (items.length === 0) {
    return { ok: false, error: "Agrega al menos un producto antes de revisar el pedido." };
  }

  return {
    ok: true,
    value: {
      details: validation.value,
      items: items.map((item) => ({ ...item })),
      subtotal: items.reduce((total, item) => total + item.originalUnitPrice * item.quantity, 0),
      savings: items.reduce(
        (total, item) => total + Math.max(0, item.originalUnitPrice - item.unitPrice) * item.quantity,
        0,
      ),
      total: items.reduce((total, item) => total + item.unitPrice * item.quantity, 0),
    },
  };
}

export function createOrderTicket(review: CheckoutReview) {
  const createdAt = new Date();
  const datePart = createdAt.toISOString().slice(0, 10).replaceAll("-", "");
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();

  return {
    ...review,
    folio: `SOL-${datePart}-${randomPart}`,
    createdAt: createdAt.toISOString(),
  };
}
