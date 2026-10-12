"use client";

import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import Link from "next/link";
import { categories, segments } from "@/data/products";
import { collectFilters, isCategoryId, sortProducts } from "@/lib/catalog";
import { formatPrice, itemCountLabel, sizeName } from "@/lib/format";
import type { CatalogSegment, CategoryId, Product, SortKey } from "@/lib/types";
import { ProductCard } from "@/components/product-card";
import { IconClose } from "@/components/icons";

const sortOptions: { id: SortKey; label: string }[] = [
  { id: "recommended", label: "Рекомендовані" },
  { id: "new", label: "Спочатку новинки" },
  { id: "price-asc", label: "Ціна: зростання" },
  { id: "price-desc", label: "Ціна: спадання" },
  { id: "discount", label: "Розмір знижки" },
];

export function CatalogBrowser({
  products,
  segment,
}: {
  products: Product[];
  segment: CatalogSegment | null;
}) {
  const base = useMemo(() => {
    if (!segment) return products;
    if (segment === "novynky") return products.filter((product) => product.isNew);
    if (segment === "znizhky") return products.filter((product) => product.compareAtPrice);
    return products.filter((product) => product.category === segment);
  }, [products, segment]);

  const available = useMemo(() => collectFilters(base), [base]);
  const lockedCategory = segment && isCategoryId(segment) ? segment : null;

  const [pickedSizes, setPickedSizes] = useState<string[]>([]);
  const [pickedColors, setPickedColors] = useState<string[]>([]);
  const [pickedCategories, setPickedCategories] = useState<CategoryId[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState<SortKey>("recommended");
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("lock-scroll", sheetOpen);
    return () => document.body.classList.remove("lock-scroll");
  }, [sheetOpen]);

  const filtered = useMemo(() => {
    const min = minPrice === "" ? null : Number(minPrice);
    const max = maxPrice === "" ? null : Number(maxPrice);
    const next = base.filter((product) => {
      if (!lockedCategory && pickedCategories.length && !pickedCategories.includes(product.category)) {
        return false;
      }
      if (pickedSizes.length && !pickedSizes.some((size) => product.sizes.includes(size))) return false;
      if (pickedColors.length && !pickedColors.some((color) => product.colors.some((item) => item.id === color))) {
        return false;
      }
      if (min !== null && !Number.isNaN(min) && product.price < min) return false;
      if (max !== null && !Number.isNaN(max) && product.price > max) return false;
      return true;
    });
    return sortProducts(next, sort);
  }, [base, lockedCategory, maxPrice, minPrice, pickedCategories, pickedColors, pickedSizes, sort]);

  const chips = [
    ...pickedSizes.map((size) => ({ key: `size-${size}`, label: sizeName(size), clear: () => toggle(setPickedSizes, size) })),
    ...pickedColors.map((colorId) => ({
      key: `color-${colorId}`,
      label: available.colors.find((color) => color.id === colorId)?.name ?? colorId,
      clear: () => toggle(setPickedColors, colorId),
    })),
    ...(!lockedCategory
      ? pickedCategories.map((categoryId) => ({
          key: `cat-${categoryId}`,
          label: categories.find((category) => category.id === categoryId)?.label ?? categoryId,
          clear: () => toggle(setPickedCategories, categoryId),
        }))
      : []),
    ...(minPrice || maxPrice
      ? [
          {
            key: "price",
            label: `${minPrice || "0"}–${maxPrice || "∞"} ₴`,
            clear: () => {
              setMinPrice("");
              setMaxPrice("");
            },
          },
        ]
      : []),
  ];

  function clearAll() {
    setPickedSizes([]);
    setPickedColors([]);
    setPickedCategories([]);
    setMinPrice("");
    setMaxPrice("");
  }

  const title = segment ? segments[segment].title : "Каталог";
  const text = segment
    ? segments[segment].text
    : "Уся демонстраційна добірка INNOE. Фільтри працюють лише всередині цього прототипу.";

  return (
    <div className="catalog-page">
      <header className="page-intro">
        <p className="eyebrow">INNOE · добірка</p>
        <div className="page-intro-row">
          <h1>{title}</h1>
          <p>{text}</p>
        </div>
      </header>

      <div className="catalog-layout">
        <aside
          className={sheetOpen ? "filters-panel is-open" : "filters-panel"}
          role={sheetOpen ? "dialog" : undefined}
          aria-modal={sheetOpen ? true : undefined}
          aria-label="Фільтри"
        >
          <div className="sheet-top">
            <p>Фільтри</p>
            <button type="button" className="icon-btn" onClick={() => setSheetOpen(false)}>
              <IconClose />
              <span className="sr-only">Закрити фільтри</span>
            </button>
          </div>
    <form
      className="filters"
      onSubmit={(event) => {
        event.preventDefault();
        setSheetOpen(false);
      }}
    >
      <div className="filters-head">
        <p>Фільтри</p>
        {chips.length ? (
          <button type="button" className="text-link" onClick={clearAll}>
            Очистити
          </button>
        ) : null}
      </div>

      <fieldset>
        <legend>Категорія</legend>
        <div className="filter-list">
          <Link href="/catalog" aria-current={segment === null ? "page" : undefined}>
            Усі
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              aria-current={segment === category.id ? "page" : undefined}
            >
              {category.label}
            </Link>
          ))}
          <Link href="/catalog/novynky" aria-current={segment === "novynky" ? "page" : undefined}>
            Новинки
          </Link>
          <Link href="/catalog/znizhky" aria-current={segment === "znizhky" ? "page" : undefined}>
            Знижки
          </Link>
        </div>
        {!lockedCategory ? (
          <div className="check-list">
            {categories.map((category) => (
              <label key={category.id}>
                <input
                  type="checkbox"
                  checked={pickedCategories.includes(category.id)}
                  onChange={() => toggle(setPickedCategories, category.id)}
                />
                {category.label}
              </label>
            ))}
          </div>
        ) : null}
      </fieldset>

      <fieldset>
        <legend>Розмір</legend>
        <div className="size-grid">
          {available.sizes.map((size) => (
            <button
              key={size}
              type="button"
              aria-pressed={pickedSizes.includes(size)}
              onClick={() => toggle(setPickedSizes, size)}
            >
              {sizeName(size)}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Колір</legend>
        <div className="color-list">
          {available.colors.map((color) => (
            <button
              key={color.id}
              type="button"
              aria-pressed={pickedColors.includes(color.id)}
              onClick={() => toggle(setPickedColors, color.id)}
            >
              <span className="swatch" style={{ background: color.hex }} />
              {color.name}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Ціна, ₴</legend>
        <div className="price-fields">
          <label>
            Від
            <input
              inputMode="numeric"
              value={minPrice}
              placeholder={String(available.min)}
              onChange={(event) => setMinPrice(event.target.value.replace(/[^\d]/g, ""))}
            />
          </label>
          <label>
            До
            <input
              inputMode="numeric"
              value={maxPrice}
              placeholder={String(available.max)}
              onChange={(event) => setMaxPrice(event.target.value.replace(/[^\d]/g, ""))}
            />
          </label>
        </div>
        <p className="filter-note">
          Діапазон добірки: {formatPrice(available.min)} — {formatPrice(available.max)}
        </p>
      </fieldset>

      <button type="submit" className="btn sheet-apply">
        Показати {itemCountLabel(filtered.length)}
      </button>
    </form>
        </aside>
        <div>
          <div className="catalog-toolbar">
            <p>{itemCountLabel(filtered.length)}</p>
            <button type="button" className="btn btn-ghost filter-open" onClick={() => setSheetOpen(true)}>
              Фільтри{chips.length ? ` · ${chips.length}` : ""}
            </button>
            <label className="sort-label">
              <span>Сортування</span>
              <select value={sort} onChange={(event) => setSort(event.target.value as SortKey)}>
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {chips.length ? (
            <ul className="chips">
              {chips.map((chip) => (
                <li key={chip.key}>
                  <button type="button" onClick={chip.clear}>
                    {chip.label}
                    <IconClose />
                    <span className="sr-only">Прибрати фільтр</span>
                  </button>
                </li>
              ))}
              <li>
                <button type="button" className="text-link" onClick={clearAll}>
                  Очистити все
                </button>
              </li>
            </ul>
          ) : null}

          {filtered.length === 0 ? (
            <div className="empty-state">
              <p className="eyebrow">Порожньо</p>
              <h2>За цими фільтрами речей немає</h2>
              <p>Зніміть частину умов або поверніться до всієї добірки.</p>
              <button type="button" className="btn" onClick={clearAll}>
                Очистити фільтри
              </button>
            </div>
          ) : (
            <div className="product-grid">
              {filtered.map((product, index) => (
                <ProductCard key={product.id} product={product} priority={index < 2} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function toggle<T>(setter: Dispatch<SetStateAction<T[]>>, value: T) {
  setter((current) => (current.includes(value) ? current.filter((item) => item !== value) : [...current, value]));
}
