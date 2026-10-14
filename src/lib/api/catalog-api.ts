import type { CatalogItem, CategoryId, Product, Promotion } from "@/modules/catalog";

export type ApiCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  is_active: boolean;
};

export type ApiProductImage = {
  id: string;
  image_url: string;
  alt_text?: string | null;
  sort_order?: number;
  is_primary?: boolean;
};

export type ApiProductVariant = {
  id: string;
  name: string;
  sku: string;
  size?: string | null;
  color?: string | null;
  price_minor: number | string;
  currency: "BOB";
  is_active: boolean;
};

export type ApiProduct = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  reference: string;
  description?: string | null;
  brand?: string | null;
  is_active: boolean;
  categories?: ApiCategory | null;
  product_images?: ApiProductImage[];
  product_variants?: ApiProductVariant[];
};

export type ApiPromotionProduct = {
  promotion_id: string;
  product_id: string;
  promotional_price_minor: number | string;
  original_price_minor: number | string;
  currency: "BOB";
  products?: Pick<ApiProduct, "id" | "name" | "slug" | "reference" | "is_active"> | null;
};

export type ApiPromotion = {
  id: string;
  name: string;
  description?: string | null;
  badge: string;
  discount_type: "percentage" | "fixed" | "fixed_amount";
  discount_value: number | string;
  starts_at?: string | null;
  ends_at?: string | null;
  is_active: boolean;
  promotion_products?: ApiPromotionProduct[];
};

export type ApiStore = {
  id: string;
  name: string;
  address: string;
  phone?: string | null;
  is_active: boolean;
};

export type ApiInventory = {
  id: string;
  store_id: string;
  product_variant_id: string;
  quantity_available: number;
  quantity_reserved: number;
  stores?: ApiStore | null;
  product_variants?: ApiProductVariant | null;
};

export type ApiListResponse<T> = {
  items: T[];
  meta?: { page: number; limit: number; total: number; pages: number };
};

export function getApiHealth() {
  return request<{ status: string; service: string; timestamp: string }>("/health");
}

export type ProductQuery = {
  active?: boolean;
  page?: number;
  limit?: number;
  q?: string;
  category_id?: string;
};

export type InventoryQuery = {
  store_id?: string;
  product_variant_id?: string;
};

export class CatalogApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "CatalogApiError";
    this.status = status;
  }
}

export const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const isApiConfigured = Boolean((supabaseUrl && supabaseAnonKey) || apiBaseUrl);

function hasSupabaseRestConfig() {
  return !apiBaseUrl && Boolean(supabaseUrl && supabaseAnonKey);
}

function hasSupabaseAuthConfig() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>) {
  const baseUrl = hasSupabaseRestConfig() ? `${supabaseUrl}/rest/v1` : `${apiBaseUrl}/api`;
  const url = new URL(`${baseUrl}${path}`, "http://terra-api.local");

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  });

  if (apiBaseUrl.startsWith("http")) return url.toString();
  return `${url.pathname}${url.search}`;
}

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("supabase-access-token");
}

let refreshInFlight: Promise<string | null> | null = null;

function clearStoredSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("supabase-access-token");
  window.localStorage.removeItem("supabase-refresh-token");
  window.localStorage.removeItem("supabase-token-expires-at");
  window.dispatchEvent(new Event("terra-auth-changed"));
}

async function refreshSession(): Promise<string | null> {
  if (!hasSupabaseAuthConfig() || typeof window === "undefined") return null;
  const refreshToken = window.localStorage.getItem("supabase-refresh-token");
  if (!refreshToken) {
    clearStoredSession();
    return null;
  }

  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      try {
        const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
          method: "POST",
          headers: { "Content-Type": "application/json", apikey: supabaseAnonKey },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
        if (!response.ok) {
          clearStoredSession();
          return null;
        }
        const session = await response.json() as AuthSession;
        window.localStorage.setItem("supabase-access-token", session.access_token);
        if (session.refresh_token) window.localStorage.setItem("supabase-refresh-token", session.refresh_token);
        if (session.expires_in) {
          window.localStorage.setItem("supabase-token-expires-at", String(Date.now() + session.expires_in * 1000));
        }
        window.dispatchEvent(new Event("terra-auth-changed"));
        return session.access_token;
      } catch {
        clearStoredSession();
        return null;
      } finally {
        refreshInFlight = null;
      }
    })();
  }

  return refreshInFlight;
}

export async function apiRequest<T>(path: string, init?: RequestInit, authenticated = false): Promise<T> {
  if (!isApiConfigured) throw new CatalogApiError("La API no está configurada.", 0);

  const url = path.startsWith("http") || path.startsWith("/api") ? path : buildUrl(path);
  let token = authenticated ? getAccessToken() : null;
  if (authenticated && !token) token = await refreshSession();
  if (authenticated && !token) throw new CatalogApiError("Inicia sesión para continuar.", 401);
  const send = (accessToken: string | null) => fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(hasSupabaseRestConfig() ? { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseAnonKey}` } : {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...init?.headers,
    },
  });
  let response = await send(token);
  if (authenticated && response.status === 401) {
    token = await refreshSession();
    if (token) response = await send(token);
  }

  if (!response.ok) {
    let message = `La API respondió con ${response.status}.`;
    try {
      const body = await response.json() as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // Mantiene el error HTTP cuando la API no devuelve JSON.
    }
    throw new CatalogApiError(message, response.status);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  return apiRequest<T>(path, init);
}

function withQuery(path: string, params: Record<string, string | number | boolean | undefined>) {
  return request<ApiListResponse<never>>(buildUrl(path, params));
}

export function listCategories() {
  if (hasSupabaseRestConfig()) {
    return request<ApiCategory[]>(buildUrl("/categories", { select: "*", is_active: "eq.true" }))
      .then((items) => ({ items, meta: { page: 1, limit: items.length, total: items.length, pages: 1 } }));
  }
  return withQuery("/categories", { active: true }) as Promise<ApiListResponse<ApiCategory>>;
}

export function getCategory(id: string) {
  return request<ApiCategory>(`/categories/${encodeURIComponent(id)}`);
}

export function createCategory(input: Omit<ApiCategory, "id">) {
  return apiRequest<ApiCategory>("/categories", jsonRequest("POST", input), true);
}

export function updateCategory(id: string, input: Partial<Omit<ApiCategory, "id">>) {
  return apiRequest<ApiCategory>(`/categories/${encodeURIComponent(id)}`, jsonRequest("PATCH", input), true);
}

export function deleteCategory(id: string) {
  return apiRequest<void>(`/categories/${encodeURIComponent(id)}`, { method: "DELETE" }, true);
}

export function listProducts(query: ProductQuery = {}) {
  if (hasSupabaseRestConfig()) {
    return request<ApiProduct[]>(buildUrl("/products", {
      select: "*,categories(*),product_images(*),product_variants(*)",
      is_active: "eq.true",
      limit: query.limit ?? 100,
    })).then((items) => ({ items, meta: { page: 1, limit: items.length, total: items.length, pages: 1 } }));
  }
  return withQuery("/products", { active: true, page: 1, limit: 100, ...query }) as Promise<ApiListResponse<ApiProduct>>;
}

export function getProduct(id: string) {
  if (hasSupabaseRestConfig()) {
    return request<ApiProduct[]>(buildUrl(`/products`, {
      select: "*,categories(*),product_images(*),product_variants(*)",
      id: `eq.${id}`,
      limit: 1,
    })).then((items) => {
      if (!items[0]) throw new CatalogApiError("Producto no encontrado.", 404);
      return items[0];
    });
  }
  return request<ApiProduct>(`/products/${encodeURIComponent(id)}`);
}

export function createProduct(input: Partial<ApiProduct>) {
  return apiRequest<ApiProduct>("/products", jsonRequest("POST", input), true);
}

export function updateProduct(id: string, input: Partial<ApiProduct>) {
  return apiRequest<ApiProduct>(`/products/${encodeURIComponent(id)}`, jsonRequest("PATCH", input), true);
}

export function deleteProduct(id: string) {
  return apiRequest<void>(`/products/${encodeURIComponent(id)}`, { method: "DELETE" }, true);
}

export function addProductVariant(productId: string, input: Partial<ApiProductVariant>) {
  return apiRequest<ApiProductVariant>(`/products/${encodeURIComponent(productId)}/variants`, jsonRequest("POST", input), true);
}

export function updateProductVariant(variantId: string, input: Partial<ApiProductVariant>) {
  return apiRequest<ApiProductVariant>(`/products/variants/${encodeURIComponent(variantId)}`, jsonRequest("PATCH", input), true);
}

export function deleteProductVariant(variantId: string) {
  return apiRequest<void>(`/products/variants/${encodeURIComponent(variantId)}`, { method: "DELETE" }, true);
}

export function addProductImage(productId: string, input: Omit<ApiProductImage, "id">) {
  return apiRequest<ApiProductImage>(`/products/${encodeURIComponent(productId)}/images`, jsonRequest("POST", input), true);
}

export function deleteProductImage(imageId: string) {
  return apiRequest<void>(`/products/images/${encodeURIComponent(imageId)}`, { method: "DELETE" }, true);
}

export function listPromotions() {
  if (hasSupabaseRestConfig()) {
    return request<ApiPromotion[]>(buildUrl("/promotions", {
      select: "*,promotion_products(*,products(id,name,slug,reference,is_active))",
      is_active: "eq.true",
    }));
  }
  return request<ApiPromotion[]>(buildUrl("/promotions", { active: true }));
}

export function getPromotion(id: string) {
  return request<ApiPromotion>(`/promotions/${encodeURIComponent(id)}`);
}

export function createPromotion(input: Partial<ApiPromotion>) {
  return apiRequest<ApiPromotion>("/promotions", jsonRequest("POST", input), true);
}

export function updatePromotion(id: string, input: Partial<ApiPromotion>) {
  return apiRequest<ApiPromotion>(`/promotions/${encodeURIComponent(id)}`, jsonRequest("PATCH", input), true);
}

export function deletePromotion(id: string) {
  return apiRequest<void>(`/promotions/${encodeURIComponent(id)}`, { method: "DELETE" }, true);
}

export function setPromotionProduct(promotionId: string, productId: string, input: { promotional_price_minor: string; original_price_minor: string; currency: "BOB" }) {
  return apiRequest<void>(`/promotions/${encodeURIComponent(promotionId)}/products/${encodeURIComponent(productId)}`, jsonRequest("PUT", input), true);
}

export function removePromotionProduct(promotionId: string, productId: string) {
  return apiRequest<void>(`/promotions/${encodeURIComponent(promotionId)}/products/${encodeURIComponent(productId)}`, { method: "DELETE" }, true);
}

export function listStores() {
  if (hasSupabaseRestConfig()) {
    return request<ApiStore[]>(buildUrl("/stores", { select: "*", is_active: "eq.true" }));
  }
  return request<ApiStore[]>(buildUrl("/inventory/stores"));
}

export function createStore(input: Omit<ApiStore, "id">) {
  return apiRequest<ApiStore>("/inventory/stores", jsonRequest("POST", input), true);
}

export function updateStore(storeId: string, input: Partial<Omit<ApiStore, "id">>) {
  return apiRequest<ApiStore>(`/inventory/stores/${encodeURIComponent(storeId)}`, jsonRequest("PATCH", input), true);
}

export function listInventory(query: InventoryQuery = {}) {
  if (hasSupabaseRestConfig()) {
    return request<ApiInventory[]>(buildUrl("/inventory", {
      select: "*,stores(*),product_variants(*)",
      ...(query.store_id ? { store_id: `eq.${query.store_id}` } : {}),
      ...(query.product_variant_id ? { product_variant_id: `eq.${query.product_variant_id}` } : {}),
    }));
  }
  return request<ApiInventory[]>(buildUrl("/inventory", query));
}

export function upsertInventory(input: { store_id: string; product_variant_id: string; quantity_available: number; quantity_reserved: number }) {
  return apiRequest<ApiInventory>("/inventory", jsonRequest("PUT", input), true);
}

export function adjustInventory(inventoryId: string, delta: number) {
  return apiRequest<ApiInventory>(`/inventory/${encodeURIComponent(inventoryId)}/adjust`, jsonRequest("POST", { delta }), true);
}

export type AuthSession = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  user: { id: string; email?: string };
};

export async function signIn(email: string, password: string) {
  if (!hasSupabaseAuthConfig()) {
    throw new CatalogApiError("Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY para habilitar el inicio de sesión.", 0);
  }
  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: supabaseAnonKey },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json() as AuthSession & { msg?: string; message?: string };
  if (!response.ok) throw new CatalogApiError(data.msg ?? data.message ?? "No se pudo iniciar sesión.", response.status);
  window.localStorage.setItem("supabase-access-token", data.access_token);
  if (data.refresh_token) window.localStorage.setItem("supabase-refresh-token", data.refresh_token);
  if (data.expires_in) window.localStorage.setItem("supabase-token-expires-at", String(Date.now() + data.expires_in * 1000));
  window.dispatchEvent(new Event("terra-auth-changed"));
  return data;
}

export function signOut() {
  const token = getAccessToken();
  if (token && hasSupabaseAuthConfig()) {
    void fetch(`${supabaseUrl}/auth/v1/logout`, {
      method: "POST",
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${token}` },
    }).catch(() => undefined);
  }
  clearStoredSession();
}

export type CustomerProfile = { id?: string; name: string; email: string; phone?: string | null };
export type CustomerAddress = { id: string; label: string; address: string; city: string; reference?: string | null; is_default: boolean };

export function getCustomerProfile() {
  return apiRequest<CustomerProfile>("/customers/me", undefined, true);
}

export function updateCustomerProfile(profile: Partial<CustomerProfile>) {
  return apiRequest<CustomerProfile>("/customers/me", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  }, true);
}

export function listCustomerAddresses() {
  return apiRequest<CustomerAddress[]>("/customers/me/addresses", undefined, true);
}

export function createCustomerAddress(address: Omit<CustomerAddress, "id">) {
  return apiRequest<CustomerAddress>("/customers/me/addresses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(address),
  }, true);
}

export function updateCustomerAddress(addressId: string, address: Partial<Omit<CustomerAddress, "id">>) {
  return apiRequest<CustomerAddress>(`/customers/me/addresses/${encodeURIComponent(addressId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(address),
  }, true);
}

export function deleteCustomerAddress(addressId: string) {
  return apiRequest<void>(`/customers/me/addresses/${encodeURIComponent(addressId)}`, { method: "DELETE" }, true);
}

export function getCustomerAdminList() {
  return apiRequest<ApiListResponse<CustomerProfile>>("/customers", undefined, true);
}

export function getCustomerAdmin(customerId: string) {
  return apiRequest<CustomerProfile>(`/customers/${encodeURIComponent(customerId)}`, undefined, true);
}

export type ApiCart = {
  id: string;
  cart_items?: Array<{
    id: string;
    product_variant_id: string;
    quantity: number;
    unit_price_minor: number | string;
    product_variants?: ApiProductVariant & { products?: ApiProduct };
  }>;
  items?: ApiCart["cart_items"];
};

export function getCurrentCart() {
  return apiRequest<ApiCart>("/carts/current", undefined, true);
}

export function addCartVariant(cartId: string, productVariantId: string, quantity: number) {
  return apiRequest<ApiCart>(`/carts/${encodeURIComponent(cartId)}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_variant_id: productVariantId, quantity }),
  }, true);
}

export function updateCartItem(cartId: string, itemId: string, quantity: number) {
  return apiRequest<ApiCart>(`/carts/${encodeURIComponent(cartId)}/items/${encodeURIComponent(itemId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity }),
  }, true);
}

export function deleteCartItem(cartId: string, itemId: string) {
  return apiRequest<void>(`/carts/${encodeURIComponent(cartId)}/items/${encodeURIComponent(itemId)}`, { method: "DELETE" }, true);
}

export type ApiOrder = {
  id: string;
  ticket_number?: string;
  status: string;
  subtotal_minor: number | string;
  discount_minor: number | string;
  delivery_fee_minor: number | string;
  total_minor: number | string;
  currency: "BOB";
  created_at: string;
  fulfillment_type: "delivery" | "pickup";
  delivery_address?: string | null;
  order_items?: Array<{ id: string; product_name: string; sku: string; quantity: number; unit_price_minor: number | string; total_minor: number | string }>;
};

export function createOrder(input: { cart_id: string; store_id?: string; fulfillment_type: "delivery" | "pickup"; delivery_address?: string; notes?: string }) {
  return apiRequest<ApiOrder>("/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  }, true);
}

export function listMyOrders() {
  return apiRequest<ApiOrder[]>("/orders/mine", undefined, true);
}

export function listOrders(query?: Record<string, string | number | undefined>) {
  return apiRequest<ApiListResponse<ApiOrder>>(buildUrl("/orders", query), undefined, true);
}

export function getOrder(orderId: string) {
  return apiRequest<ApiOrder>(`/orders/${encodeURIComponent(orderId)}`, undefined, true);
}

export function updateOrderStatus(orderId: string, status: string, note?: string) {
  return apiRequest<ApiOrder>(`/orders/${encodeURIComponent(orderId)}/status`, jsonRequest("PATCH", { status, note }), true);
}

export function listOrderPayments(orderId: string) {
  return apiRequest<unknown[]>(`/payments/orders/${encodeURIComponent(orderId)}`, undefined, true);
}

export function createPayment(orderId: string, input: { provider: string; provider_transaction_id: string; status: string; amount_minor: string; currency: "BOB" }) {
  return apiRequest<unknown>(`/payments/orders/${encodeURIComponent(orderId)}`, jsonRequest("POST", input), true);
}

export function updatePaymentStatus(paymentId: string, status: string) {
  return apiRequest<unknown>(`/payments/${encodeURIComponent(paymentId)}/status`, jsonRequest("PATCH", { status }), true);
}

function jsonRequest(method: string, body: unknown): RequestInit {
  return { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}

export function toPrice(minor: number | string) {
  return Number(minor) / 100;
}

function formatPrice(minor: number | string) {
  return new Intl.NumberFormat("es-BO", { style: "currency", currency: "BOB", maximumFractionDigits: 0 }).format(toPrice(minor));
}

function categoryId(category?: ApiCategory | null, fallback = "other"): CategoryId {
  return category?.slug ?? category?.id ?? fallback;
}

export function mapApiProduct(product: ApiProduct): Product {
  const variants = (product.product_variants ?? []).filter((item) => item.is_active).sort((a, b) => Number(a.price_minor) - Number(b.price_minor));
  const variant = variants[0] ?? product.product_variants?.[0];
  const image = product.product_images?.find((item) => item.is_primary) ?? product.product_images?.[0];

  return {
    id: product.id,
    name: product.name,
    reference: product.reference,
    image: image?.image_url ?? "/images/product-mattress.png",
    price: variant ? formatPrice(variant.price_minor) : "Consultar precio",
    category: categoryId(product.categories, product.category_id),
    description: product.description ?? "Consulta las características de este producto con la tienda.",
    variantId: variant?.id,
    variantName: variant?.name,
    variants: variants.map((entry) => ({
      id: entry.id,
      name: entry.name,
      value: entry.size ?? entry.color ?? entry.sku,
      price: formatPrice(entry.price_minor),
    })),
  };
}

export function mapApiPromotion(promotion: ApiPromotion, products: ApiProduct[]): Promotion[] {
  return (promotion.promotion_products ?? []).flatMap((promotionProduct) => {
    const product = products.find((item) => item.id === promotionProduct.product_id);
    if (!product) return [];

    const mapped = mapApiProduct(product);
    return [{
      ...mapped,
      price: formatPrice(promotionProduct.promotional_price_minor),
      oldPrice: formatPrice(promotionProduct.original_price_minor),
      badge: promotion.badge,
      badgeType: promotion.badge.toLowerCase().includes("hot") ? "hot" as const : "discount" as const,
    }];
  });
}

export type CatalogApiData = {
  categories: { id: CategoryId; label: string; image: string }[];
  items: CatalogItem[];
};

export async function getCatalogApiData(): Promise<CatalogApiData> {
  const [categoryResponse, productResponse, promotionResponse] = await Promise.all([
    listCategories(),
    listProducts(),
    listPromotions().catch(() => []),
  ]);
  const products = productResponse.items;
  const mappedProducts = products.map(mapApiProduct);
  const mappedPromotions = promotionResponse.flatMap((promotion) => mapApiPromotion(promotion, products));

  return {
    categories: categoryResponse.items.map((category) => ({
      id: category.slug || category.id,
      label: category.name,
      image: category.image_url ?? "/images/category-mattress.png",
    })),
    items: [...mappedProducts, ...mappedPromotions],
  };
}
