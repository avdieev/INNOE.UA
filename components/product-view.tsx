"use client";

import { useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { ProductCard } from "@/components/product-card";
import { discountPercent, formatPrice, sizeName } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductView({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const { addItem } = useCart();
  const [colorId, setColorId] = useState(product.colors[0]?.id ?? "");
  const [size, setSize] = useState(product.sizes.length === 1 ? product.sizes[0] : "");
  const [imageIndex, setImageIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [openPanel, setOpenPanel] = useState<"about" | "specs" | "delivery">("about");

  const availableSizes = product.stock[colorId] ?? [];
  const inStock = Boolean(size) && availableSizes.includes(size);
  const discount = discountPercent(product.price, product.compareAtPrice);
  const photoColor = product.colors.find((item) => item.id === product.photoColorId);

  const status = useMemo(() => {
    if (!size) return "Оберіть розмір, щоб побачити наявність.";
    if (!inStock) return "Цього поєднання кольору й розміру зараз немає.";
    return "Варіант позначено як доступний у демонстрації.";
  }, [inStock, size]);

  function addToCart() {
    if (!colorId || !size) {
      setError("Оберіть колір і розмір перед додаванням.");
      return;
    }
    if (!inStock) {
      setError("Цей варіант недоступний. Оберіть інший розмір або колір.");
      return;
    }
    setError("");
    addItem({ productId: product.id, colorId, size, qty });
  }

  return (
    <article className="product-page">
      <p className="breadcrumb">
        <Link href="/catalog">Каталог</Link>
        <span aria-hidden="true">/</span>
        <Link href={`/catalog/${product.category}`}>{product.categoryLabel}</Link>
      </p>

      <div className="product-layout">
        <div className="gallery">
          <div className="gallery-main">
            <Image
              src={product.images[imageIndex].src}
              alt={product.images[imageIndex].alt}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 58vw"
              className="cover"
            />
          </div>
          {product.images.length > 1 ? (
            <div className="thumbs" role="tablist" aria-label="Фотографії товару">
              {product.images.map((image, index) => (
                <button
                  key={image.src}
                  type="button"
                  role="tab"
                  aria-selected={index === imageIndex}
                  onClick={() => setImageIndex(index)}
                >
                  <Image src={image.src} alt="" fill sizes="88px" className="cover" />
                  <span className="sr-only">{image.alt}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="product-buy">
          <p className="eyebrow">{product.categoryLabel}</p>
          <h1>{product.name}</h1>
          <p className="sku">Артикул {product.sku}</p>
          <p className="price-row price-large">
            <span>{formatPrice(product.price)}</span>
            {product.compareAtPrice ? (
              <>
                <s>{formatPrice(product.compareAtPrice)}</s>
                {discount ? <span className="discount">−{discount}%</span> : null}
              </>
            ) : null}
          </p>
          <p className="demo-note">Демонстраційна ціна. Оплата в прототипі не виконується.</p>

          <fieldset className="buy-group">
            <legend>Колір</legend>
            <div className="color-list">
              {product.colors.map((item) => {
                const colorHasStock = (product.stock[item.id] ?? []).length > 0;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={item.id === colorId}
                    onClick={() => {
                      setColorId(item.id);
                      setError("");
                    }}
                  >
                    <span className="swatch" style={{ background: item.hex }} />
                    {item.name}
                    {colorHasStock ? "" : " · немає"}
                  </button>
                );
              })}
            </div>
            {photoColor ? <p className="filter-note">На фото — колір «{photoColor.name}».</p> : null}
          </fieldset>

          <fieldset className="buy-group">
            <legend>{product.sizeLabel}</legend>
            <div className="size-grid">
              {product.sizes.map((item) => {
                const available = availableSizes.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={item === size}
                    disabled={!available}
                    onClick={() => {
                      setSize(item);
                      setError("");
                    }}
                  >
                    {sizeName(item)}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <p className={inStock || !size ? "stock-line" : "stock-line is-out"} role="status">
            {status}
          </p>

          <div className="buy-row">
            <div className="qty" aria-label="Кількість">
              <button type="button" onClick={() => setQty((value) => Math.max(1, value - 1))} aria-label="Зменшити кількість">
                −
              </button>
              <span>{qty}</span>
              <button type="button" onClick={() => setQty((value) => Math.min(8, value + 1))} aria-label="Збільшити кількість">
                +
              </button>
            </div>
            <button type="button" className="btn" onClick={addToCart}>
              Додати до кошика
            </button>
          </div>
          {error ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="panels">
            <Panel
              title="Опис"
              open={openPanel === "about"}
              onToggle={() => setOpenPanel("about")}
            >
              <p>{product.description}</p>
              <p>{product.short}.</p>
            </Panel>
            <Panel
              title="Характеристики"
              open={openPanel === "specs"}
              onToggle={() => setOpenPanel("specs")}
            >
              <dl className="specs">
                {product.specs.map((spec) => (
                  <div key={spec.label}>
                    <dt>{spec.label}</dt>
                    <dd>{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </Panel>
            <Panel
              title="Доставка і повернення"
              open={openPanel === "delivery"}
              onToggle={() => setOpenPanel("delivery")}
            >
              <p>
                У прототипі доставка лише імітується на кроці оформлення: відділення, кур’єр або самовивіз.
                Реальні відправлення не створюються.
              </p>
              <p>
                Повернення в сценарії магазину — 14 днів для речей без слідів носіння. Деталі на сторінках{" "}
                <Link href="/delivery">доставки</Link> та <Link href="/returns">повернення</Link>.
              </p>
            </Panel>
          </div>
        </div>
      </div>

      {related.length ? (
        <section className="related">
          <div className="section-head">
            <p className="eyebrow">Поруч</p>
            <h2>Інші речі добірки</h2>
          </div>
          <div className="product-grid">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}

function Panel({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className={open ? "panel is-open" : "panel"}>
      <button type="button" aria-expanded={open} onClick={onToggle}>
        {title}
      </button>
      {open ? <div>{children}</div> : null}
    </div>
  );
}
