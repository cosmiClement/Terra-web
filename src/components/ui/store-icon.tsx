import Image from "next/image";

const icons = {
  "add-to-cart": { src: "/icons/cart-proper.svg", width: 20, height: 20 },
  "arrow-right": { src: "/icons/arrow-right-proper.svg", width: 20, height: 20 },
  brand: { src: "/icons/brand.svg", width: 23, height: 20 },
  cart: { src: "/icons/cart-proper.svg", width: 20, height: 20 },
  "chevron-right": { src: "/icons/chevron-right.svg", width: 14, height: 16 },
  heart: { src: "/icons/heart.svg", width: 20, height: 20 },
  home: { src: "/icons/home-proper.svg", width: 20, height: 20 },
  menu: { src: "/icons/menu.svg", width: 23, height: 20 },
  search: { src: "/icons/search-proper.svg", width: 20, height: 20 },
  star: { src: "/icons/star.svg", width: 14, height: 14 },
  support: { src: "/icons/support-proper.svg", width: 20, height: 20 },
  user: { src: "/icons/user-proper.svg", width: 20, height: 20 },
} as const;

export type StoreIconName = keyof typeof icons;

type StoreIconProps = {
  name: StoreIconName;
  className?: string;
};

export function StoreIcon({ name, className }: StoreIconProps) {
  const icon = icons[name];

  return (
    <Image
      src={icon.src}
      width={icon.width}
      height={icon.height}
      alt=""
      aria-hidden="true"
      className={className}
    />
  );
}
