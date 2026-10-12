import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { InfoShell } from "@/components/info-shell";

export const metadata: Metadata = { title: "Контакти" };

export default function ContactsPage() {
  return (
    <InfoShell kicker="Зв’язок" title="Контакти демонстраційного дому">
      <p>hello@innoe.demo</p>
      <p>Київ, вул. Рейтарська, 12. Адреса вигадана, дзвінків магазин не приймає.</p>
      <p>Графік на вітрині: щодня 11:00–20:00.</p>
      <ContactForm />
    </InfoShell>
  );
}
