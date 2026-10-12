import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogBrowser } from "@/components/catalog-browser";
import { isCatalogSegment, products, segments } from "@/data/products";

export function generateStaticParams() {
  return Object.keys(segments).map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  if (!isCatalogSegment(category)) return { title: "Каталог" };
  return { title: segments[category].title, description: segments[category].text };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!isCatalogSegment(category)) notFound();
  return <CatalogBrowser products={products} segment={category} />;
}
