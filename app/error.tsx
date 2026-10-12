"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="empty-state page-empty">
      <p className="eyebrow">Помилка</p>
      <h1>Сторінка не зібралася</h1>
      <p>Спробуйте відкрити її ще раз. Якщо стан повториться, це збій прототипу, не магазину.</p>
      <button type="button" className="btn" onClick={() => reset()}>
        Спробувати знову
      </button>
    </div>
  );
}
