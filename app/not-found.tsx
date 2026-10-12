import Link from "next/link";

export default function NotFound() {
  return (
    <div className="empty-state page-empty">
      <p className="eyebrow">404</p>
      <h1>Цієї сторінки в добірці немає</h1>
      <p>Посилання застаріло або адресу набрано з помилкою.</p>
      <div className="confirm-actions">
        <Link href="/" className="btn">
          На головну
        </Link>
        <Link href="/catalog" className="btn btn-ghost">
          До каталогу
        </Link>
      </div>
    </div>
  );
}
