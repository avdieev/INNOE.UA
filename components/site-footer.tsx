import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <p className="footer-mark">INNOE</p>
        <p className="footer-lead">
          Демонстраційний дім одягу, взуття й аксесуарів. Прототип для перегляду дизайну:
          замовлення нікуди не надсилаються, оплата не списується.
        </p>
      </div>
      <div className="footer-grid">
        <div>
          <p className="footer-label">Магазин</p>
          <Link href="/catalog">Увесь каталог</Link>
          <Link href="/catalog/novynky">Новинки</Link>
          <Link href="/catalog/zhinkam">Жінкам</Link>
          <Link href="/catalog/cholovikam">Чоловікам</Link>
          <Link href="/catalog/vzuttya">Взуття</Link>
          <Link href="/catalog/aksesuary">Аксесуари</Link>
        </div>
        <div>
          <p className="footer-label">Інформація</p>
          <Link href="/about">Про INNOE</Link>
          <Link href="/delivery">Доставка і оплата</Link>
          <Link href="/returns">Повернення</Link>
          <Link href="/contacts">Контакти</Link>
        </div>
        <div>
          <p className="footer-label">Прототип</p>
          <p>Київ, демонстраційна адреса</p>
          <p>вул. Рейтарська, 12</p>
          <p>Щодня 11:00–20:00</p>
          <a href="mailto:hello@innoe.demo">hello@innoe.demo</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 INNOE. Не є чинним магазином.</p>
        <p>Фотографії — демонстраційні стокові кадри. Ціни та наявність вигадані.</p>
      </div>
    </footer>
  );
}
