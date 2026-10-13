import Link from "next/link";
import { StoreIcon, type StoreIconName } from "@/components/ui/store-icon";

const navigation: { label: string; href: string; icon: StoreIconName }[] = [
  { label: "Inicio", href: "#inicio", icon: "home" },
  { label: "Categorías", href: "#categorias", icon: "search" },
  { label: "Productos", href: "#productos", icon: "cart" },
  { label: "Promociones", href: "#promociones", icon: "star" },
  { label: "Cuenta", href: "/account", icon: "user" },
];

export function StorefrontNavigation() {
  return (
    <nav className="bottom-navigation" aria-label="Navegación principal" id="bottom-nav">
      {navigation.map((item, index) => (
        <Link
          aria-current={index === 0 ? "page" : undefined}
          className={`bottom-navigation-link${index === 0 ? " is-active" : ""}`}
          href={item.href}
          key={item.label}
        >
          <StoreIcon name={item.icon} />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
