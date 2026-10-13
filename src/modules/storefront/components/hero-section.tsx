import Image from "next/image";
import Link from "next/link";
import { StoreIcon } from "@/components/ui/store-icon";

export function HeroSection() {
  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <Image
        src="/images/hero-bedroom.png"
        alt="Dormitorio cálido con cama y colchón Terra"
        fill
        priority
        sizes="(max-width: 700px) 100vw, 1200px"
        className="hero-image"
      />
      <div className="hero-content">
        <h1 id="hero-title">
          Renueva tu <span>descanso</span> hoy
        </h1>
        <p>Explora nuestra selección de colchones, camas, muebles y accesorios para tu descanso.</p>
        <Link className="primary-cta" href="/catalog">
          Comenzar a comprar
          <StoreIcon name="arrow-right" />
        </Link>
      </div>
    </section>
  );
}
