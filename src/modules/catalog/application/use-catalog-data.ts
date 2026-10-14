"use client";

import { useEffect, useState } from "react";
import { categories as demoCategories, catalogItems as demoItems } from "../domain/catalog-data";
import { getCatalogApiData, isApiConfigured, type CatalogApiData } from "@/lib/api/catalog-api";

export function useCatalogData() {
  const [data, setData] = useState<CatalogApiData>(() => isApiConfigured
    ? { categories: [], items: [] }
    : { categories: [...demoCategories], items: [...demoItems] });
  const [isLoading, setIsLoading] = useState(isApiConfigured);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isApiConfigured) return;

    let active = true;
    getCatalogApiData()
      .then((nextData) => {
        if (active) {
          setData(nextData);
          try {
            window.sessionStorage.setItem("terra-catalog-items", JSON.stringify(nextData.items));
          } catch {
            // El catálogo sigue funcionando si el navegador bloquea sessionStorage.
          }
        }
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "No se pudo cargar el catálogo.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { ...data, isLoading, error, usingApi: isApiConfigured };
}
