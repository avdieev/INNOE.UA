import { products } from "@/data/products";
import type { CatalogSegment, CategoryId, Product, SortKey } from "@/lib/types";

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function productsForSegment(segment: CatalogSegment | null) {
  if (!segment) return products;
  if (segment === "novynky") return products.filter((product) => product.isNew);
  if (segment === "znizhky") return products.filter((product) => product.compareAtPrice);
  return products.filter((product) => product.category === segment);
}

export function relatedProducts(product: Product, count = 4) {
  const sameCategory = products.filter(
    (item) => item.category === product.category && item.id !== product.id,
  );
  const rest = products.filter(
    (item) => item.id !== product.id && item.category !== product.category && item.isPopular,
  );
  return [...sameCategory, ...rest].slice(0, count);
}

export function searchProducts(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];
  return products.filter((product) => {
    const haystack = [
      product.name,
      product.sku,
      product.categoryLabel,
      product.short,
      product.description,
      ...product.colors.map((color) => color.name),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalized);
  });
}

export function sortProducts(list: Product[], sort: SortKey) {
  const discount = (product: Product) =>
    product.compareAtPrice ? (product.compareAtPrice - product.price) / product.compareAtPrice : 0;

  return [...list].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price || a.name.localeCompare(b.name, "uk");
    if (sort === "price-desc") return b.price - a.price || a.name.localeCompare(b.name, "uk");
    if (sort === "discount") return discount(b) - discount(a) || a.price - b.price;
    if (sort === "new") return Number(b.isNew) - Number(a.isNew) || a.name.localeCompare(b.name, "uk");
    return (
      Number(b.isPopular) - Number(a.isPopular) ||
      Number(b.isNew) - Number(a.isNew) ||
      a.name.localeCompare(b.name, "uk")
    );
  });
}

export function collectFilters(list: Product[]) {
  const sizes = new Set<string>();
  const colors = new Map<string, { id: string; name: string; hex: string }>();
  let min = Infinity;
  let max = 0;

  for (const product of list) {
    product.sizes.forEach((size) => sizes.add(size));
    product.colors.forEach((color) => colors.set(color.id, color));
    min = Math.min(min, product.price);
    max = Math.max(max, product.price);
  }

  return {
    sizes: [...sizes],
    colors: [...colors.values()],
    min: Number.isFinite(min) ? min : 0,
    max,
  };
}

export function isCategoryId(value: string): value is CategoryId {
  return value === "zhinkam" || value === "cholovikam" || value === "vzuttya" || value === "aksesuary";
}
