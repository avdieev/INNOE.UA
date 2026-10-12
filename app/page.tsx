import Image from "next/image";
import Link from "next/link";
import { categories, products } from "@/data/products";
import { ProductCard } from "@/components/product-card";

const benefits = [
  {
    index: "01",
    title: "Крій без шуму",
    text: "Силуети зібрані як редакційна добірка: пальто, костюм, шкіра, базова футболка. Декор не замінює форму.",
  },
  {
    index: "02",
    title: "Доставка як сценарій",
    text: "На оформленні можна обрати відділення, кур’єра або самовивіз. Відправлення не створюється.",
  },
  {
    index: "03",
    title: "14 днів на обмін",
    text: "Умови описані окремо. У прототипі це текст для перевірки навігації, не служба підтримки.",
  },
  {
    index: "04",
    title: "Ціна видима одразу",
    text: "Якщо є демонстраційна знижка, попередня сума закреслена поруч. Жодна цифра не є прайсом магазину.",
  },
];

export default function HomePage() {
  const newest = products.filter((product) => product.isNew);
  const featured = newest[0];
  const restNew = newest.slice(1, 5);
  const popular = products.filter((product) => product.isPopular).slice(0, 8);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">01 — осінь 26</p>
          <h1>
            Сезон,
            <br />
            зібраний
            <span> без поспіху</span>
          </h1>
          <p>
            INNOE — демонстраційний дім одягу, взуття й аксесуарів. Тут можна пройти шлях від
            вітрини до кошика і вирішити, чи тримає композиція.
          </p>
          <div className="hero-actions">
            <Link href="/catalog/novynky" className="btn">
              Дивитись новинки
            </Link>
            <Link href="/catalog/zhinkam" className="btn btn-ghost">
              Жіноча добірка
            </Link>
          </div>
        </div>
        <figure className="hero-media">
          <Image
            src="/media/nord-1.jpg"
            alt="Кемелеве пальто з поясом на кам’яних сходах"
            fill
            priority
            sizes="(max-width: 800px) 100vw, 58vw"
            className="cover"
          />
          <figcaption>
            <span>Пальто «Норд»</span>
            <Link href="/product/palto-nord">Відкрити річ</Link>
          </figcaption>
        </figure>
      </section>

      <section className="mosaic" aria-label="Категорії">
        {categories.map((category, index) => (
          <Link
            key={category.id}
            href={category.href}
            className={index === 0 ? "mosaic-card is-lead" : "mosaic-card"}
          >
            <Image
              src={category.image}
              alt={category.imageAlt}
              fill
              sizes={index === 0 ? "(max-width: 800px) 100vw, 58vw" : "(max-width: 800px) 100vw, 28vw"}
              className="cover"
            />
            <span>
              <strong>{category.label}</strong>
              <em>{category.text}</em>
            </span>
          </Link>
        ))}
      </section>

      {featured ? (
        <section className="new-block">
          <div className="section-head">
            <div>
              <p className="eyebrow">02 — щойно</p>
              <h2>Новинки</h2>
            </div>
            <Link href="/catalog/novynky" className="btn btn-ghost">
              Уся добірка
            </Link>
          </div>
          <div className="new-layout">
            <article className="feature-card">
              <Link href={`/product/${featured.slug}`}>
                <div className="feature-media">
                  <Image
                    src={featured.images[0].src}
                    alt={featured.images[0].alt}
                    fill
                    sizes="(max-width: 800px) 100vw, 46vw"
                    className="cover"
                  />
                </div>
                <div className="feature-copy">
                  <p className="eyebrow">Новинка</p>
                  <h3>{featured.name}</h3>
                  <p>{featured.short}</p>
                </div>
              </Link>
            </article>
            <div className="product-grid compact-grid">
              {restNew.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="atelier">
        <div className="atelier-copy">
          <p className="eyebrow">03 — ательє</p>
          <h2>Речі, які тримають день, а не перекрикують його.</h2>
          <p>
            Це не кампанія бренду, а зібрана вручну демонстрація: стокові фотографії підібрані під
            конкретні моделі, щоб вітрина не виглядала як набір випадкових заглушок.
          </p>
          <Link href="/about" className="btn btn-ghost">
            Про прототип
          </Link>
        </div>
        <figure>
          <Image
            src="/media/hero.jpg"
            alt="Одяг на дерев’яних плічках уздовж світлої стіни"
            fill
            sizes="(max-width: 800px) 100vw, 50vw"
            className="cover"
          />
        </figure>
      </section>

      <section className="popular">
        <div className="section-head">
          <div>
            <p className="eyebrow">04 — частіше обирають</p>
            <h2>Популярне в добірці</h2>
          </div>
          <Link href="/catalog" className="btn btn-ghost">
            Увесь каталог
          </Link>
        </div>
        <div className="filmstrip">
          {popular.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="ledger" aria-label="Переваги">
        {benefits.map((item) => (
          <article key={item.index}>
            <p>{item.index}</p>
            <h2>{item.title}</h2>
            <p>{item.text}</p>
          </article>
        ))}
      </section>
    </>
  );
}
