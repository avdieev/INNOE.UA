"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useCart } from "@/components/cart-provider";
import { products } from "@/data/products";
import { formatPrice, sizeName } from "@/lib/format";

type Delivery = "branch" | "courier" | "pickup";
type Payment = "card" | "cod";

type Fields = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  city: string;
  delivery: Delivery | "";
  branch: string;
  address: string;
  payment: Payment | "";
  comment: string;
  agree: boolean;
};

const empty: Fields = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  city: "",
  delivery: "",
  branch: "",
  address: "",
  payment: "",
  comment: "",
  agree: false,
};

const deliveryCost: Record<Delivery, number> = {
  branch: 120,
  courier: 180,
  pickup: 0,
};

export function CheckoutView() {
  const { lines, ready, clear } = useCart();
  const [fields, setFields] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [order, setOrder] = useState<{ id: string; total: number } | null>(null);

  const detailed = useMemo(
    () =>
      lines
        .map((line) => {
          const product = products.find((item) => item.id === line.productId);
          if (!product) return null;
          const color = product.colors.find((item) => item.id === line.colorId);
          return { line, product, color };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null),
    [lines],
  );

  const subtotal = detailed.reduce((sum, item) => sum + item.product.price * item.line.qty, 0);
  const shipping =
    fields.delivery === ""
      ? 0
      : fields.delivery === "branch" && subtotal >= 4000
        ? 0
        : deliveryCost[fields.delivery];
  const total = subtotal + shipping;

  if (!ready) {
    return (
      <div className="page-narrow">
        <h1>Готуємо оформлення</h1>
      </div>
    );
  }

  if (order) {
    return (
      <div className="confirm">
        <p className="eyebrow">Демонстрація</p>
        <h1>Замовлення {order.id} зафіксовано лише на цьому екрані</h1>
        <p>
          Дані нікуди не надіслано, оплата не пройшла, відправлення не створено. Сума демонстрації:{" "}
          {formatPrice(order.total)}.
        </p>
        <div className="confirm-actions">
          <Link href="/catalog" className="btn">
            Повернутися до каталогу
          </Link>
          <Link href="/" className="btn btn-ghost">
            На головну
          </Link>
        </div>
      </div>
    );
  }

  if (detailed.length === 0) {
    return (
      <div className="empty-state page-empty">
        <p className="eyebrow">Оформлення</p>
        <h1>Кошик порожній</h1>
        <p>Спочатку додайте річ, потім поверніться до цього кроку.</p>
        <Link href="/catalog" className="btn">
          До каталогу
        </Link>
      </div>
    );
  }

  function update<K extends keyof Fields>(key: K, value: Fields[K]) {
    setFields((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (fields.firstName.trim().length < 2) next.firstName = "Вкажіть ім’я.";
    if (fields.lastName.trim().length < 2) next.lastName = "Вкажіть прізвище.";
    const phone = fields.phone.replace(/[^\d+]/g, "");
    if (!/^(\+?380\d{9}|0\d{9})$/.test(phone)) next.phone = "Вкажіть телефон у форматі 0XX XXX XX XX.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) next.email = "Вкажіть електронну пошту.";
    if (fields.city.trim().length < 2) next.city = "Вкажіть місто.";
    if (!fields.delivery) next.delivery = "Оберіть спосіб доставки.";
    if (fields.delivery === "branch" && fields.branch.trim().length < 1) {
      next.branch = "Вкажіть номер або адресу відділення.";
    }
    if (fields.delivery === "courier" && fields.address.trim().length < 5) {
      next.address = "Вкажіть адресу доставки.";
    }
    if (!fields.payment) next.payment = "Оберіть спосіб оплати.";
    if (!fields.agree) next.agree = "Підтвердьте, що це лише демонстрація.";
    setErrors(next);
    if (Object.keys(next).length) return;

    const id = `INNOE-${Date.now().toString().slice(-6)}`;
    clear();
    setOrder({ id, total });
  }

  return (
    <div className="checkout-page">
      <header className="page-intro">
        <p className="eyebrow">Оформлення</p>
        <div className="page-intro-row">
          <h1>Демонстраційне замовлення</h1>
          <p>Форма перевіряє поля і показує підтвердження. Персональні дані залишаються у вашому браузері.</p>
        </div>
      </header>

      <form className="checkout-layout" onSubmit={submit} noValidate>
        <div className="checkout-fields">
          <section>
            <h2>Контакти</h2>
            <div className="field-grid">
              <Field label="Ім’я" error={errors.firstName}>
                <input value={fields.firstName} autoComplete="given-name" onChange={(event) => update("firstName", event.target.value)} />
              </Field>
              <Field label="Прізвище" error={errors.lastName}>
                <input value={fields.lastName} autoComplete="family-name" onChange={(event) => update("lastName", event.target.value)} />
              </Field>
              <Field label="Телефон" error={errors.phone}>
                <input value={fields.phone} inputMode="tel" autoComplete="tel" placeholder="0XX XXX XX XX" onChange={(event) => update("phone", event.target.value)} />
              </Field>
              <Field label="Електронна пошта" error={errors.email}>
                <input value={fields.email} type="email" autoComplete="email" onChange={(event) => update("email", event.target.value)} />
              </Field>
              <Field label="Місто" error={errors.city}>
                <input value={fields.city} autoComplete="address-level2" onChange={(event) => update("city", event.target.value)} />
              </Field>
            </div>
          </section>

          <section>
            <h2>Доставка</h2>
            {errors.delivery ? <p className="form-error">{errors.delivery}</p> : null}
            <div className="choices">
              <Choice
                name="delivery"
                checked={fields.delivery === "branch"}
                onChange={() => update("delivery", "branch")}
                title="Відділення перевізника"
                note={subtotal >= 4000 ? "У демо безкоштовно від 4 000 ₴" : "Демо-тариф 120 ₴"}
              />
              <Choice
                name="delivery"
                checked={fields.delivery === "courier"}
                onChange={() => update("delivery", "courier")}
                title="Кур’єр по місту"
                note="Демо-тариф 180 ₴"
              />
              <Choice
                name="delivery"
                checked={fields.delivery === "pickup"}
                onChange={() => update("delivery", "pickup")}
                title="Самовивіз"
                note="Київ, вул. Рейтарська, 12 · безкоштовно"
              />
            </div>
            {fields.delivery === "branch" ? (
              <Field label="Відділення" error={errors.branch}>
                <input
                  value={fields.branch}
                  placeholder="Наприклад, відділення 12"
                  onChange={(event) => update("branch", event.target.value)}
                />
              </Field>
            ) : null}
            {fields.delivery === "courier" ? (
              <Field label="Адреса" error={errors.address}>
                <input
                  value={fields.address}
                  autoComplete="street-address"
                  placeholder="Вулиця, будинок, квартира"
                  onChange={(event) => update("address", event.target.value)}
                />
              </Field>
            ) : null}
          </section>

          <section>
            <h2>Оплата</h2>
            {errors.payment ? <p className="form-error">{errors.payment}</p> : null}
            <div className="choices">
              <Choice
                name="payment"
                checked={fields.payment === "cod"}
                onChange={() => update("payment", "cod")}
                title="Під час отримання"
                note="Картка або готівка. Платіж не проходить."
              />
              <Choice
                name="payment"
                checked={fields.payment === "card"}
                onChange={() => update("payment", "card")}
                title="Онлайн-оплата"
                note="Кнопка лише показує сценарій. Картку вводити не потрібно."
              />
            </div>
          </section>

          <Field label="Коментар" error="">
            <textarea
              value={fields.comment}
              rows={3}
              onChange={(event) => update("comment", event.target.value)}
            />
          </Field>

          <label className={`agree ${errors.agree ? "has-error" : ""}`}>
            <input
              type="checkbox"
              checked={fields.agree}
              onChange={(event) => update("agree", event.target.checked)}
            />
            <span>Розумію, що це демонстрація: замовлення не буде оброблено, а дані не підуть на сервер.</span>
          </label>
          {errors.agree ? <p className="form-error">{errors.agree}</p> : null}

          <button type="submit" className="btn">
            Підтвердити демонстрацію
          </button>
        </div>

        <aside className="summary">
          <p className="footer-label">Підсумок</p>
          <ul className="summary-lines">
            {detailed.map(({ line, product, color }) => (
              <li key={line.id}>
                <span className="summary-thumb">
                  <Image src={product.images[0].src} alt="" fill sizes="56px" className="cover" />
                </span>
                <span>
                  {product.name}
                  <small>
                    {color?.name} · {sizeName(line.size)} · {line.qty} шт.
                  </small>
                </span>
                <span>{formatPrice(product.price * line.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="summary-math">
            <div>
              <dt>Речі</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div>
              <dt>Доставка</dt>
              <dd>{fields.delivery ? formatPrice(shipping) : "—"}</dd>
            </div>
            <div>
              <dt>Разом</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>
        </aside>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className={error ? "field has-error" : "field"}>
      <span>{label}</span>
      {children}
      {error ? <small>{error}</small> : null}
    </label>
  );
}

function Choice({
  name,
  checked,
  onChange,
  title,
  note,
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  title: string;
  note: string;
}) {
  return (
    <label className={checked ? "choice is-checked" : "choice"}>
      <input type="radio" name={name} checked={checked} onChange={onChange} />
      <span>
        <strong>{title}</strong>
        <small>{note}</small>
      </span>
    </label>
  );
}
