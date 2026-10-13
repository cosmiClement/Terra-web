"use client";

import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react";
import {
  addCartItem,
  getCartCount,
  getCartSavings,
  getCartSubtotal,
  getCartTotal,
  setCartItemQuantity,
} from "../domain/cart-state";
import type { CartItemInput, CartLine } from "../domain/cart-item";

type CartContextValue = {
  items: CartLine[];
  count: number;
  subtotal: number;
  savings: number;
  total: number;
  addItem: (item: CartItemInput, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  setQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
};

type CartAction =
  | { type: "add"; item: CartItemInput; quantity: number }
  | { type: "set-quantity"; itemId: string; quantity: number }
  | { type: "remove"; itemId: string }
  | { type: "clear" };

function cartReducer(items: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case "add":
      return addCartItem(items, action.item, action.quantity);
    case "set-quantity":
      return setCartItemQuantity(items, action.itemId, action.quantity);
    case "remove":
      return items.filter((item) => item.id !== action.itemId);
    case "clear":
      return [];
  }
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: getCartCount(items),
      subtotal: getCartSubtotal(items),
      savings: getCartSavings(items),
      total: getCartTotal(items),
      addItem: (item, quantity = 1) => dispatch({ type: "add", item, quantity }),
      removeItem: (itemId) => dispatch({ type: "remove", itemId }),
      setQuantity: (itemId, quantity) => dispatch({ type: "set-quantity", itemId, quantity }),
      clearCart: () => dispatch({ type: "clear" }),
    }),
    [items],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const cart = useContext(CartContext);

  if (!cart) {
    throw new Error("useCart debe usarse dentro de CartProvider.");
  }

  return cart;
}
