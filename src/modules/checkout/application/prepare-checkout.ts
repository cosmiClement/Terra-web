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
      items,
      subtotal: items.reduce((total, item) => total + item.unitPrice * item.quantity, 0),
      savings: items.reduce(
        (total, item) => total + Math.max(0, item.originalUnitPrice - item.unitPrice) * item.quantity,
        0,
      ),
    },
  };
}
