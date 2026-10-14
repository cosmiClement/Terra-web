export type CartItemInput = {
  id: string;
  name: string;
  image: string;
  price: string;
  oldPrice?: string;
  reference?: string;
  variantId?: string;
  variantName?: string;
};

export type CartLine = {
  id: string;
  name: string;
  image: string;
  reference?: string;
  unitPrice: number;
  originalUnitPrice: number;
  quantity: number;
  variantId?: string;
  variantName?: string;
};

export function parsePrice(price: string) {
  const amount = Number(price.replace(/[^\d]/g, ""));

  if (!Number.isSafeInteger(amount) || amount <= 0) {
    throw new Error(`El precio "${price}" no es válido.`);
  }

  return amount;
}
