"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/modules/cart";
import { StoreHeader } from "@/components/layout";
import { categories, type CategoryId } from "../domain/catalog-data";
import { filterCatalog } from "../application/filter-catalog";
import { ProductCard } from "./product-card";

type CatalogPageProps = {
  initialQuery?: string;
  initialCategory?: string;
};

export function CatalogPage({ initialQuery = "", initialCategory = "" }: CatalogPageProps) {
  const categoryExists = categories.some((category) => category.id === initialCategory);
  const [category, setCategory] = useState<CategoryId | null>(categoryExists ? initialCategory as CategoryId : null);
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState("relevance");
  const { addItem } = useCart();

  const results = useMemo(() => {
    const items = filterCatalog(category, query);

    if (sort === "price-asc" || sort === "price-desc") {
      const direction = sort === "price-asc" ? 1 : -1;
      return [...items].sort((first, second) => {
        const firstPrice = Number(first.price.replace(/[^\d]/g, ""));
        const secondPrice = Number(second.price.replace(/[^\d]/g, ""));
        return (firstPrice - secondPrice) * direction;
      });
    }

    return items;
  }, [category, query, sort]);

  return (
    <>
      <StoreHeader />
      <main className="catalog-page">
        <div className="catalog-page-heading">
          <div>
            <p className="eyebrow">TERRA AUTOSERVICIO · CATÁLOGO DE DEMOSTRACIÓN</p>
            <h1>Encuentra lo que necesitas para descansar mejor</h1>
            <p className="catalog-disclaimer">Productos y precios ilustrativos. Consulta características y disponibilidad en tienda.</p>
          </div>
          <label className="sort-control">
            Ordenar por
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="relevance">Relevancia</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
            </select>
          </label>
        </div>

        <label className="catalog-search-control">
          <span>Buscar por nombre o modelo</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ej. colchón, TER-MAT-001" />
        </label>

        <nav className="catalog-category-filter" aria-label="Filtrar por categoría">
          <button aria-pressed={category === null} className={category === null ? "is-selected" : ""} onClick={() => setCategory(null)} type="button">
            Todas las categorías
          </button>
          {categories.map((item) => (
            <button
              aria-pressed={category === item.id}
              className={category === item.id ? "is-selected" : ""}
              key={item.id}
              onClick={() => setCategory(item.id)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="catalog-results-heading">
          <h2>Productos y promociones</h2>
          <span>{results.length} resultados</span>
        </div>
        {results.length > 0 ? (
          <div className="catalog-product-grid">
            {results.map((item) => <ProductCard item={item} key={item.id} onAdd={addItem} />)}
          </div>
        ) : (
          <section className="catalog-no-results">
            <h2>No encontramos resultados</h2>
            <p>Prueba otra búsqueda o selecciona una categoría diferente.</p>
            <button className="touch-action" type="button" onClick={() => { setQuery(""); setCategory(null); }}>
              Limpiar filtros
            </button>
          </section>
        )}
      </main>
    </>
  );
}
