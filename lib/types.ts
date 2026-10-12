export type CategoryId = "zhinkam" | "cholovikam" | "vzuttya" | "aksesuary";

export type CatalogSegment = CategoryId | "novynky" | "znizhky";

export type ProductColor = {
  id: string;
  name: string;
  hex: string;
};

export type ProductImage = {
  src: string;
  alt: string;
};

export type ProductSpec = {
  label: string;
  value: string;
};

export type Product = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  category: CategoryId;
  categoryLabel: string;
  price: number;
  compareAtPrice?: number;
  images: ProductImage[];
  colors: ProductColor[];
  sizes: string[];
  sizeLabel: string;
  /** color id → sizes currently marked available in this demo */
  stock: Record<string, string[]>;
  description: string;
  short: string;
  specs: ProductSpec[];
  isNew: boolean;
  isPopular: boolean;
  /** Which color the photograph actually shows */
  photoColorId: string;
};

export type CartLine = {
  id: string;
  productId: string;
  colorId: string;
  size: string;
  qty: number;
};

export type SortKey = "recommended" | "new" | "price-asc" | "price-desc" | "discount";
