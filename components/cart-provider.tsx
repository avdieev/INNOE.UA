"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import Link from "next/link";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/format";
import type { CartLine } from "@/lib/types";

const STORAGE_KEY = "innoe-demo-cart";

type AddInput = {
  productId: string;
  colorId: string;
  size: string;
  qty?: number;
};

type CartContextValue = {
  lines: CartLine[];
  ready: boolean;
  count: number;
  addItem: (input: AddInput) => void;
  setQty: (id: string, qty: number) => void;
  removeLine: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function parseLines(raw: string): CartLine[] {
  try {
    const parsed = JSON.parse(raw) as CartLine[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (line) =>
        line &&
        typeof line.productId === "string" &&
        products.some((product) => product.id === line.productId) &&
        line.qty > 0,
    );
  } catch {
    return [];
  }
}

function readRaw() {
  if (typeof window === "undefined") return "[]";
  return localStorage.getItem(STORAGE_KEY) ?? "[]";
}

function writeLines(lines: CartLine[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function lineId(productId: string, colorId: string, size: string) {
  return `${productId}:${colorId}:${size}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const raw = useSyncExternalStore(subscribe, readRaw, () => "[]");
  const lines = useMemo(() => parseLines(raw), [raw]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const value = useMemo<CartContextValue>(() => {
    return {
      lines,
      ready: true,
      count: lines.reduce((sum, line) => sum + line.qty, 0),
      addItem: ({ productId, colorId, size, qty = 1 }) => {
        const product = products.find((item) => item.id === productId);
        if (!product) return;
        const id = lineId(productId, colorId, size);
        const current = parseLines(readRaw());
        const existing = current.find((line) => line.id === id);
        const next = existing
          ? current.map((line) =>
              line.id === id ? { ...line, qty: Math.min(8, line.qty + qty) } : line,
            )
          : [...current, { id, productId, colorId, size, qty }];
        writeLines(next);
        setToast(product.name);
      },
      setQty: (id, qty) => {
        const current = parseLines(readRaw());
        writeLines(
          current.flatMap((line) => {
            if (line.id !== id) return [line];
            if (qty <= 0) return [];
            return [{ ...line, qty: Math.min(8, qty) }];
          }),
        );
      },
      removeLine: (id) => writeLines(parseLines(readRaw()).filter((line) => line.id !== id)),
      clear: () => writeLines([]),
    };
  }, [lines]);

  const toastProduct = toast ? products.find((product) => product.name === toast) : undefined;

  return (
    <CartContext.Provider value={value}>
      {children}
      <div className="toast-slot" aria-live="polite">
        {toast ? (
          <div className="toast" role="status">
            <p>
              <strong>{toast}</strong> додано до кошика
              {toastProduct ? ` · ${formatPrice(toastProduct.price)}` : ""}
            </p>
            <Link href="/cart" onClick={() => setToast(null)}>
              Переглянути
            </Link>
            <button type="button" onClick={() => setToast(null)}>
              Закрити
            </button>
          </div>
        ) : null}
      </div>
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart має бути всередині CartProvider");
  return context;
}
