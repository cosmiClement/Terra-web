export const categories = [
  { id: "mattresses", label: "Colchones", image: "/images/category-mattress.png" },
  { id: "box-springs", label: "Sommiers", image: "/images/category-sommier.png" },
  { id: "beds", label: "Camas", image: "/images/category-bed.png" },
  { id: "furniture", label: "Muebles", image: "/images/category-furniture.png" },
  { id: "accessories", label: "Accesorios", image: "/images/category-bedding.png" },
] as const;

export type CategoryId = (typeof categories)[number]["id"];

export type Product = {
  id: string;
  name: string;
  reference: string;
  image: string;
  price: string;
  category: CategoryId;
  description: string;
};

export const featuredProducts: Product[] = [
  {
    id: "terra-ultra-confort",
    name: "Colchón Terra Ultra Confort",
    reference: "DEMO-MAT-01",
    image: "/images/product-mattress.png",
    price: "$85.900",
    category: "mattresses",
    description: "Ficha de demostración. Las medidas y características deben confirmarse con la tienda.",
  },
  {
    id: "cama-nordik-queen",
    name: "Cama Nordik Queen",
    reference: "DEMO-CAM-02",
    image: "/images/product-bed.png",
    price: "$120.500",
    category: "beds",
    description: "Ficha de demostración. Las medidas y características deben confirmarse con la tienda.",
  },
];

export type Promotion = Product & {
  oldPrice: string;
  badge: string;
  badgeType: "discount" | "hot";
};

export const promotions: Promotion[] = [
  {
    id: "pack-almohadas-gel",
    name: "Pack x2 Almohadas Gel",
    reference: "DEMO-ACC-03",
    image: "/images/offer-pillows.png",
    price: "$12.400",
    oldPrice: "$17.800",
    badge: "-30% OFF",
    badgeType: "discount",
    category: "accessories",
    description: "Promoción de demostración. Consultar condiciones y disponibilidad en tienda.",
  },
  {
    id: "mesa-luz-minimal",
    name: "Mesa de Luz Minimal",
    reference: "DEMO-MUE-04",
    image: "/images/offer-nightstand.png",
    price: "$22.900",
    oldPrice: "$31.000",
    badge: "HOT DEAL",
    badgeType: "hot",
    category: "furniture",
    description: "Promoción de demostración. Consultar condiciones y disponibilidad en tienda.",
  },
];

export type CatalogItem = Product | Promotion;

export const catalogItems: CatalogItem[] = [...featuredProducts, ...promotions];

export function getCatalogItem(id: string) {
  return catalogItems.find((item) => item.id === id);
}

export function isPromotion(item: CatalogItem): item is Promotion {
  return "oldPrice" in item;
}
