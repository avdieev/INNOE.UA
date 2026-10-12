import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchView } from "@/components/search-view";

export const metadata: Metadata = {
  title: "Пошук",
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="page-narrow"><h1>Шукаємо</h1></div>}>
      <SearchView />
    </Suspense>
  );
}
