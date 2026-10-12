import Link from "next/link";
import type { ReactNode } from "react";

const links = [
  { href: "/about", label: "Про INNOE" },
  { href: "/delivery", label: "Доставка і оплата" },
  { href: "/returns", label: "Повернення" },
  { href: "/contacts", label: "Контакти" },
];

export function InfoShell({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="info-page">
      <header className="page-intro">
        <p className="eyebrow">{kicker}</p>
        <h1>{title}</h1>
      </header>
      <div className="info-layout">
        <nav aria-label="Інформація">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="prose">{children}</div>
      </div>
    </article>
  );
}
