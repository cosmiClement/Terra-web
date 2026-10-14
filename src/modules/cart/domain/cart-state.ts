import { parsePrice, type CartItemInput, type CartLine } from "./cart-item";

export function addCartItem(lines: CartLine[], item: CartItemInput, quantity = 1): CartLine[] {
  const amount = Math.min(99, Math.max(1, Math.floor(quantity)));
  const lineId = item.variantId ?? item.id;
  const existingLine = lines.find((line) => (line.variantId ?? line.id) === lineId);

  if (existingLine) {
    return lines.map((line) =>
      line.id === existingLine.id ? { ...line, quantity: Math.min(99, line.quantity + amount) } : line,
    );
  }

  return [
    ...lines,
    {
      id: lineId,
      name: item.name,
      image: item.image,
      reference: item.reference,
      unitPrice: parsePrice(item.price),
      originalUnitPrice: parsePrice(item.oldPrice ?? item.price),
      quantity: amount,
      variantId: item.variantId,
      variantName: item.variantName,
    },
  ];
}

export function setCartItemQuantity(lines: CartLine[], itemId: string, quantity: number): CartLine[] {
  if (quantity <= 0) {
    return lines.filter((line) => line.id !== itemId);
  }

  return lines.map((line) =>
    line.id === itemId ? { ...line, quantity: Math.min(99, Math.floor(quantity)) } : line,
  );
}

export function getCartCount(lines: CartLine[]) {
  return lines.reduce((total, line) => total + line.quantity, 0);
}

export function getCartSubtotal(lines: CartLine[]) {
  return lines.reduce((total, line) => total + line.originalUnitPrice * line.quantity, 0);
}

export function getCartSavings(lines: CartLine[]) {
  return lines.reduce(
    (total, line) => total + Math.max(0, line.originalUnitPrice - line.unitPrice) * line.quantity,
    0,
  );
}

export function getCartTotal(lines: CartLine[]) {
  return lines.reduce((total, line) => total + line.unitPrice * line.quantity, 0);
}
