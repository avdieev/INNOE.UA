"use client";

import { useState, type FormEvent } from "react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = "Вкажіть ім’я.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "Вкажіть пошту.";
    if (message.trim().length < 10) next.message = "Напишіть повідомлення щонайменше в кілька слів.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setSent(true);
  }

  if (sent) {
    return (
      <div className="confirm compact" role="status">
        <h2>Повідомлення лишилось у браузері</h2>
        <p>Форма нічого не відправила. Так перевіряється лише сценарій звернення.</p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <label className={errors.name ? "field has-error" : "field"}>
        <span>Ім’я</span>
        <input value={name} onChange={(event) => setName(event.target.value)} />
        {errors.name ? <small>{errors.name}</small> : null}
      </label>
      <label className={errors.email ? "field has-error" : "field"}>
        <span>Електронна пошта</span>
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        {errors.email ? <small>{errors.email}</small> : null}
      </label>
      <label className={errors.message ? "field has-error" : "field"}>
        <span>Повідомлення</span>
        <textarea rows={5} value={message} onChange={(event) => setMessage(event.target.value)} />
        {errors.message ? <small>{errors.message}</small> : null}
      </label>
      <button type="submit" className="btn">
        Надіслати демонстрацію
      </button>
    </form>
  );
}
