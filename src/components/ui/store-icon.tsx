import Image from "next/image";

const icons = {
  "add-to-cart": { src: "/icons/cart.svg", width: 20, height: 20 },
  "arrow-right": { src: "/icons/arrow-right.svg", width: 20, height: 20 },
  brand: { src: "/icons/brand.svg", width: 23, height: 20 },
  cart: { src: "/icons/cart.svg", width: 20, height: 20 },
  "chevron-right": { src: "/icons/chevron-right.svg", width: 14, height: 16 },
  heart: { src: "/icons/heart.svg", width: 20, height: 20 },
  home: { src: "/icons/home.svg", width: 18, height: 16 },
  menu: { src: "/icons/menu.svg", width: 23, height: 20 },
  search: { src: "/icons/search.svg", width: 16, height: 14 },
  star: { src: "/icons/star.svg", width: 14, height: 14 },
  support: { src: "/icons/support.svg", width: 14, height: 16 },
  user: { src: "/icons/user.svg", width: 18, height: 15 },
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
