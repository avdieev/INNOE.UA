import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/catalog-browser";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Каталог",
  description: "Демонстраційний каталог INNOE: одяг, взуття та аксесуари.",
};

export default function CatalogPage() {
  return <CatalogBrowser products={products} segment={null} />;
}
