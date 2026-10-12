"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { categories } from "@/data/products";
import { searchProducts } from "@/lib/catalog";
import { formatPrice, itemCountLabel } from "@/lib/format";
import { useCart } from "@/components/cart-provider";
import { IconBag, IconClose, IconMenu, IconSearch } from "@/components/icons";

const links = [
  { href: "/catalog/novynky", label: "Новинки" },
  ...categories.map((category) => ({ href: category.href, label: category.label })),
  { href: "/catalog/znizhky", label: "Знижки" },
];

export function SiteHeader() {
  const router = useRouter();
  const { count } = useCart();
  const searchId = useId();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const results = useMemo(() => searchProducts(query).slice(0, 6), [query]);

  useEffect(() => {
    document.body.classList.toggle("lock-scroll", menuOpen);
    return () => document.body.classList.remove("lock-scroll");
  }, [menuOpen]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function goToSearch() {
    const value = query.trim();
    setSearchOpen(false);
    setMenuOpen(false);
    router.push(value ? `/search?q=${encodeURIComponent(value)}` : "/search");
  }

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    goToSearch();
  }

  return (
    <header className="site-header">
      <div className="announce">
        <p>Демонстраційний прототип · ціни та залишки вигадані · обмін 14 днів</p>
      </div>
      <div className="header-bar">
        <button
          type="button"
          className="icon-btn menu-btn"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => {
            setMenuOpen((open) => !open);
            setSearchOpen(false);
          }}
        >
          {menuOpen ? <IconClose /> : <IconMenu />}
          <span className="sr-only">{menuOpen ? "Закрити меню" : "Відкрити меню"}</span>
        </button>

        <Link href="/" className="logo" onClick={() => setMenuOpen(false)}>
          INNOE
        </Link>

        <nav className="desktop-nav" aria-label="Основна навігація">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-tools">
          <button
            type="button"
            className="icon-btn"
            aria-expanded={searchOpen}
            aria-controls={searchId}
            onClick={() => {
              setSearchOpen((open) => !open);
              setMenuOpen(false);
            }}
          >
            {searchOpen ? <IconClose /> : <IconSearch />}
            <span className="sr-only">{searchOpen ? "Закрити пошук" : "Відкрити пошук"}</span>
          </button>
          <Link href="/cart" className="icon-btn cart-link" aria-label={`Кошик, ${itemCountLabel(count)}`}>
            <IconBag />
            <span className="cart-count" data-ready={count > 0}>
              {count}
            </span>
          </Link>
        </div>
      </div>

      {searchOpen ? (
        <div className="search-panel" id={searchId}>
          <form onSubmit={submitSearch} role="search">
            <label htmlFor={`${searchId}-input`} className="sr-only">
              Пошук товарів
            </label>
            <input
              id={`${searchId}-input`}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Назва, категорія або артикул"
              autoFocus
            />
            <button type="submit" className="btn">
              Знайти
            </button>
          </form>
          {query.trim() ? (
            <ul className="search-suggest">
              {results.length === 0 ? (
                <li className="search-empty">Нічого не знайдено серед демонстраційних товарів.</li>
              ) : (
                results.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={`/product/${product.slug}`}
                      onClick={() => setSearchOpen(false)}
                    >
                      <span>{product.name}</span>
                      <span>{formatPrice(product.price)}</span>
                    </Link>
                  </li>
                ))
              )}
              <li>
                <button type="button" className="text-link" onClick={goToSearch}>
                  Усі результати
                </button>
              </li>
            </ul>
          ) : (
            <p className="search-hint">Наприклад: пальто, костюм, черевики, OR-NOR-001</p>
          )}
        </div>
      ) : null}

      {menuOpen
        ? createPortal(
            <div className="nav-layer">
              <button type="button" className="nav-scrim" aria-label="Закрити меню" onClick={() => setMenuOpen(false)} />
              <nav className="mobile-nav" id="mobile-nav" aria-label="Мобільна навігація">
                <div className="mobile-nav-head">
                  <p>INNOE</p>
                  <button type="button" className="icon-btn" onClick={() => setMenuOpen(false)}>
                    <IconClose />
                    <span className="sr-only">Закрити меню</span>
                  </button>
                </div>
                {links.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
                    {link.label}
                  </Link>
                ))}
                <div className="mobile-nav-sub">
                  <Link href="/about" onClick={() => setMenuOpen(false)}>
                    Про INNOE
                  </Link>
                  <Link href="/delivery" onClick={() => setMenuOpen(false)}>
                    Доставка
                  </Link>
                  <Link href="/returns" onClick={() => setMenuOpen(false)}>
                    Повернення
                  </Link>
                  <Link href="/contacts" onClick={() => setMenuOpen(false)}>
                    Контакти
                  </Link>
                </div>
              </nav>
            </div>,
            document.body,
          )
        : null}
    </header>
  );
}
