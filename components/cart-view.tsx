"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { products } from "@/data/products";
import { formatPrice, sizeName } from "@/lib/format";

export function CartView() {
  const { lines, ready, setQty, removeLine } = useCart();

  if (!ready) {
    return (
      <div className="page-narrow">
        <p className="eyebrow">Кошик</p>
        <h1>Відкриваємо кошик</h1>
      </div>
    );
  }

  const detailed = lines
    .map((line) => {
      const product = products.find((item) => item.id === line.productId);
      if (!product) return null;
      const color = product.colors.find((item) => item.id === line.colorId);
      return { line, product, color };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const subtotal = detailed.reduce((sum, item) => sum + item.product.price * item.line.qty, 0);

  if (detailed.length === 0) {
    return (
      <div className="empty-state page-empty">
        <p className="eyebrow">Кошик</p>
        <h1>Поки порожньо</h1>
        <p>Додайте річ із каталогу — розмір і колір збережуться в цьому браузері.</p>
        <Link href="/catalog" className="btn">
          До каталогу
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <header className="page-intro">
        <p className="eyebrow">Кошик</p>
        <div className="page-intro-row">
          <h1>Ваші речі</h1>
          <p>Кількість можна змінити. Сума перераховується одразу. Дані лишаються в браузері.</p>
        </div>
      </header>
      <div className="cart-layout">
        <ul className="cart-lines">
          {detailed.map(({ line, product, color }) => (
            <li key={line.id}>
              <Link href={`/product/${product.slug}`} className="cart-thumb">
                <Image
                  src={product.images[0].src}
                  alt=""
                  fill
                  sizes="120px"
                  className="cover"
                />
              </Link>
              <div className="cart-info">
                <Link href={`/product/${product.slug}`}>{product.name}</Link>
                <p>
                  {color?.name ?? "Колір"} · {sizeName(line.size)}
                </p>
                <p className="sku">{product.sku}</p>
                <button type="button" className="text-link" onClick={() => removeLine(line.id)}>
                  Видалити
                </button>
              </div>
              <div className="qty">
                <button
                  type="button"
                  aria-label={`Зменшити кількість: ${product.name}`}
                  onClick={() => setQty(line.id, line.qty - 1)}
                >
                  −
                </button>
                <span>{line.qty}</span>
                <button
                  type="button"
                  aria-label={`Збільшити кількість: ${product.name}`}
                  onClick={() => setQty(line.id, line.qty + 1)}
                >
                  +
                </button>
              </div>
              <p className="cart-line-price">{formatPrice(product.price * line.qty)}</p>
            </li>
          ))}
        </ul>
        <aside className="summary">
          <p className="footer-label">Разом</p>
          <p className="summary-total">{formatPrice(subtotal)}</p>
          <p>Доставка розрахується на наступному кроці як демонстрація.</p>
          <Link href="/checkout" className="btn">
            Оформити замовлення
          </Link>
          <Link href="/catalog" className="btn btn-ghost">
            Продовжити перегляд
          </Link>
        </aside>
      </div>
    </div>
  );
}
