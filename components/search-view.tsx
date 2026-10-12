"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { searchProducts } from "@/lib/catalog";
import { itemCountLabel } from "@/lib/format";
import { ProductCard } from "@/components/product-card";

export function SearchView() {
  const params = useSearchParams();
  const initial = params.get("q") ?? "";
  const results = useMemo(() => searchProducts(initial), [initial]);

  return (
    <div className="search-page">
      <header className="page-intro">
        <p className="eyebrow">Пошук</p>
        <div className="page-intro-row">
          <h1>{initial ? `«${initial}»` : "Знайти річ"}</h1>
          <p>Пошук іде по назві, категорії, кольору й артикулу демонстраційних товарів.</p>
        </div>
      </header>
      <SearchForm key={initial} initial={initial} />

      {!initial ? (
        <div className="empty-state">
          <h2>Введіть запит</h2>
          <p>Можна шукати «пальто», «взуття» або артикул на кшталт OR-NOR-001.</p>
        </div>
      ) : results.length === 0 ? (
        <div className="empty-state">
          <h2>Нічого не знайдено</h2>
          <p>Спробуйте коротшу назву або відкрийте весь каталог.</p>
          <Link className="btn" href="/catalog">
            До каталогу
          </Link>
        </div>
      ) : (
        <>
          <p className="result-count">{itemCountLabel(results.length)}</p>
          <div className="product-grid">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function SearchForm({ initial }: { initial: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initial);

  function submit(event: FormEvent) {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `/search?q=${encodeURIComponent(value)}` : "/search");
  }

  return (
    <form className="search-form" onSubmit={submit} role="search">
      <label htmlFor="catalog-search">Запит</label>
      <div>
        <input
          id="catalog-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Пальто, костюм, OR-KAM-101"
        />
        <button type="submit" className="btn">
          Шукати
        </button>
      </div>
    </form>
  );
}
