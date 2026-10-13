import { catalogItems, type CategoryId } from "../domain/catalog-data";

export function filterCatalog(category: CategoryId | null, query = "") {
  const normalizedQuery = query.trim().toLocaleLowerCase("es");

  return catalogItems.filter((item) => {
    const matchesCategory = !category || item.category === category;
    const matchesQuery =
      !normalizedQuery ||
      `${item.name} ${item.reference}`.toLocaleLowerCase("es").includes(normalizedQuery);

    return matchesCategory && matchesQuery;
  });
}
