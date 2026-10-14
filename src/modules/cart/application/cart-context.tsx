"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from "react";
import {
  addCartItem,
  getCartCount,
  getCartSavings,
  getCartSubtotal,
  getCartTotal,
  setCartItemQuantity,
} from "../domain/cart-state";
import type { CartItemInput, CartLine } from "../domain/cart-item";
import { addCartVariant, deleteCartItem, getAccessToken, getCurrentCart, updateCartItem, type ApiCart } from "@/lib/api/catalog-api";

type CartContextValue = {
  items: CartLine[];
  count: number;
  subtotal: number;
  savings: number;
  total: number;
  isRemote: boolean;
  isSyncing: boolean;
  syncError: string;
  addItem: (item: CartItemInput, quantity?: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  setQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
};

type CartAction =
  | { type: "add"; item: CartItemInput; quantity: number }
  | { type: "set-quantity"; itemId: string; quantity: number }
  | { type: "remove"; itemId: string }
  | { type: "replace"; items: CartLine[] }
  | { type: "clear" };

function cartReducer(items: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case "add":
      return addCartItem(items, action.item, action.quantity);
    case "set-quantity":
      return setCartItemQuantity(items, action.itemId, action.quantity);
    case "remove":
      return items.filter((item) => item.id !== action.itemId);
    case "replace":
      return action.items;
    case "clear":
      return [];
  }
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const [remoteCartId, setRemoteCartId] = useState("");
  const [isRemote, setIsRemote] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState("");

  const applyRemoteCart = useCallback((cart: ApiCart) => {
    setRemoteCartId(cart.id);
    setIsRemote(true);
    dispatch({
      type: "replace",
      items: (cart.cart_items ?? cart.items ?? []).map((line) => {
        const variant = line.product_variants;
        const product = variant?.products;
        return {
          id: line.id,
          name: product?.name ?? variant?.name ?? "Producto",
          image: product?.product_images?.[0]?.image_url ?? "/images/product-mattress.png",
          reference: product?.reference ?? variant?.sku,
          unitPrice: Number(line.unit_price_minor) / 100,
          originalUnitPrice: Number(line.unit_price_minor) / 100,
          quantity: line.quantity,
          variantId: line.product_variant_id,
          variantName: variant?.name,
        };
      }),
    });
  }, []);

  const syncRemoteCart = useCallback(async () => {
    if (!getAccessToken()) {
      setIsRemote(false);
      setRemoteCartId("");
      setSyncError("");
      dispatch({ type: "clear" });
      return;
    }
    setIsSyncing(true);
    setSyncError("");
    try {
      applyRemoteCart(await getCurrentCart());
    } catch (reason) {
      setIsRemote(false);
      setSyncError(reason instanceof Error ? reason.message : "No se pudo sincronizar el carrito.");
    } finally {
      setIsSyncing(false);
    }
  }, [applyRemoteCart]);

  useEffect(() => {
    const timer = window.setTimeout(() => void syncRemoteCart(), 0);
    window.addEventListener("terra-auth-changed", syncRemoteCart);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("terra-auth-changed", syncRemoteCart);
    };
  }, [syncRemoteCart]);

  const addItem = useCallback(async (item: CartItemInput, quantity = 1) => {
    if (getAccessToken()) {
      setSyncError("");
      if (!item.variantId) {
        const error = "Este artículo no tiene una variante válida para guardarse en el carrito.";
        setSyncError(error);
        throw new Error(error);
      }
      try {
        const cart = remoteCartId ? null : await getCurrentCart();
        const cartId = remoteCartId || cart?.id;
        if (!cartId) throw new Error("El backend no devolvió un carrito activo.");
        applyRemoteCart(await addCartVariant(cartId, item.variantId, quantity));
      } catch (reason) {
        const message = reason instanceof Error ? reason.message : "No se pudo guardar el producto en el carrito.";
        setSyncError(message);
        throw new Error(message);
      }
      return;
    }
    dispatch({ type: "add", item, quantity });
  }, [applyRemoteCart, remoteCartId]);

  const removeItem = useCallback(async (itemId: string) => {
    if (getAccessToken()) {
      setSyncError("");
      if (!isRemote || !remoteCartId) {
        setSyncError("El carrito todavía no está sincronizado; vuelve a intentarlo.");
        return;
      }
      try {
        await deleteCartItem(remoteCartId, itemId);
        await syncRemoteCart();
      } catch (reason) {
        setSyncError(reason instanceof Error ? reason.message : "No se pudo quitar el producto del carrito.");
      }
      return;
    }
    dispatch({ type: "remove", itemId });
  }, [isRemote, remoteCartId, syncRemoteCart]);

  const setQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (getAccessToken()) {
      setSyncError("");
      if (!isRemote || !remoteCartId) {
        setSyncError("El carrito todavía no está sincronizado; vuelve a intentarlo.");
        return;
      }
      try {
        await updateCartItem(remoteCartId, itemId, quantity);
        await syncRemoteCart();
      } catch (reason) {
        setSyncError(reason instanceof Error ? reason.message : "No se pudo actualizar la cantidad.");
      }
      return;
    }
    dispatch({ type: "set-quantity", itemId, quantity });
  }, [isRemote, remoteCartId, syncRemoteCart]);

  const clearCart = useCallback(() => {
    dispatch({ type: "clear" });
    setRemoteCartId("");
    setIsRemote(false);
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: getCartCount(items),
      subtotal: getCartSubtotal(items),
      savings: getCartSavings(items),
      total: getCartTotal(items),
      isRemote,
      isSyncing,
      syncError,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
    }),
    [addItem, clearCart, isRemote, isSyncing, items, removeItem, setQuantity, syncError],
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
