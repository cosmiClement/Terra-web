"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type TouchEvent } from "react";
import { promotions } from "@/modules/catalog";
import { StoreIcon } from "@/components/ui/store-icon";

const slides = [
  {
    id: "welcome",
    image: "/images/hero-bedroom.png",
    eyebrow: "TERRA AUTOSERVICIO · COMPRA A TU RITMO",
    title: <>Renueva tu <span>descanso</span> hoy</>,
    description: "Explora nuestra selección de colchones, camas, muebles y accesorios para tu descanso.",
    action: "Comenzar a comprar",
    href: "/catalog",
    note: "Datos de demostración · Confirma disponibilidad en tienda",
  },
  ...promotions.map((promotion) => ({
    id: promotion.id,
    image: promotion.image,
    eyebrow: <><strong>PROMOCIÓN</strong> <span>{promotion.badge}</span></>,
    title: <>{promotion.name} <span>a un precio especial</span></>,
    description: promotion.description,
    action: "Ver promoción",
    href: `/products/${promotion.id}`,
    note: "Promoción de demostración · Consulta condiciones en tienda",
  })),
];

export function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const activeSlide = slides[activeIndex];

  useEffect(() => {
    if (isPaused) return;

    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  function changeSlide(index: number) {
    setActiveIndex((index + slides.length) % slides.length);
  }

  function handleTouchStart(event: TouchEvent<HTMLElement>) {
    setIsPaused(true);
    setTouchStart(event.touches[0]?.clientX ?? null);
  }

  function handleTouchEnd(event: TouchEvent<HTMLElement>) {
    if (touchStart === null) return;
    const distance = (event.changedTouches[0]?.clientX ?? touchStart) - touchStart;

    if (Math.abs(distance) > 45) {
      changeSlide(activeIndex + (distance < 0 ? 1 : -1));
    }

    setTouchStart(null);
  }

  return (
    <section
      aria-labelledby="hero-title"
      className="hero-section"
      id="promociones"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onTouchEnd={handleTouchEnd}
      onTouchStart={handleTouchStart}
    >
      {slides.map((slide, index) => (
        <Image
          alt={index === activeIndex ? "Dormitorio y productos de la campaña Terra" : ""}
          className={`hero-image${index === activeIndex ? " is-active" : ""}`}
          fill
          key={slide.id}
          priority={index === 0}
          sizes="(max-width: 700px) 100vw, 1200px"
          src={slide.image}
        />
      ))}
      <div className="hero-content" key={activeSlide.id}>
        <span className="hero-eyebrow">{activeSlide.eyebrow}</span>
        <h1 id="hero-title">{activeSlide.title}</h1>
        <p>{activeSlide.description}</p>
        <div className="hero-actions">
          <Link className="primary-cta" href={activeSlide.href}>
            {activeSlide.action}
            <StoreIcon name="arrow-right" />
          </Link>
          <button className="hero-secondary-cta" onClick={() => changeSlide(1)} type="button">
            Ver promociones
          </button>
        </div>
        <span className="hero-note">{activeSlide.note}</span>
      </div>
      <div className="hero-controls" aria-label="Controles de promociones">
        <button aria-label="Promoción anterior" className="hero-arrow" onClick={() => changeSlide(activeIndex - 1)} type="button">‹</button>
        <div className="hero-dots">
          {slides.map((slide, index) => (
            <button
              aria-label={`Ver diapositiva ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
              className={`hero-dot${index === activeIndex ? " is-active" : ""}`}
              key={slide.id}
              onClick={() => changeSlide(index)}
              type="button"
            />
          ))}
        </div>
        <button aria-label="Siguiente promoción" className="hero-arrow" onClick={() => changeSlide(activeIndex + 1)} type="button">›</button>
      </div>
    </section>
  );
}
