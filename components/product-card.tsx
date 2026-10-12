import Image from "next/image";
import Link from "next/link";
import { discountPercent, formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const discount = discountPercent(product.price, product.compareAtPrice);
  const image = product.images[0];

  return (
    <article className="product-card">
      <Link href={`/product/${product.slug}`} className="product-card-link">
        <div className="product-media">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 720px) 50vw, (max-width: 1100px) 33vw, 25vw"
            priority={priority}
            className="cover"
          />
          {product.isNew ? <span className="card-flag">Новинка</span> : null}
        </div>
        <div className="product-meta">
          <p className="product-kicker">{product.categoryLabel}</p>
          <h3>{product.name}</h3>
          <p className="price-row">
            <span>{formatPrice(product.price)}</span>
            {product.compareAtPrice ? (
              <>
                <s>{formatPrice(product.compareAtPrice)}</s>
                {discount ? <span className="discount">−{discount}%</span> : null}
              </>
            ) : null}
          </p>
        </div>
      </Link>
    </article>
  );
}
