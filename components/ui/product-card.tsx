import Image from 'next/image';
import clsx from 'clsx';
import type { Product } from '@/data/home';

interface ProductCardProps {
  product: Product;
}

const badgeColorMap: Record<string, string> = {
  'Mới': 'bg-[color:var(--gold)] text-[color:var(--bg)]',
  'Bán chạy': 'bg-[color:var(--danger)] text-white',
  'Giảm giá': 'bg-[color:var(--success)] text-[color:var(--bg)]',
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article
      className={clsx(
        'group flex flex-col rounded-xl border border-white/10',
        'bg-[color:var(--surface-2)]',
        'hover:border-[color:var(--line-gold)] transition-colors duration-300'
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl">
        <Image
          src={product.image}
          alt={`Hình ảnh sản phẩm ${product.name}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {product.badge && (
          <span
            className={clsx(
              'absolute top-3 left-3 rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wide',
              badgeColorMap[product.badge]
            )}
          >
            {product.badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        {/* Category */}
        <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">
          {product.category}
        </p>

        {/* Name */}
        <h3 className="text-base font-bold leading-snug text-[color:var(--text)] line-clamp-2">
          {product.name}
        </h3>

        {/* Specs */}
        <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
          {product.specs.map((spec) => (
            <li
              key={spec.label}
              className="flex items-center gap-1.5 text-xs text-[color:var(--muted)]"
            >
              <span className="font-medium text-[color:var(--silver)]">{spec.label}:</span>
              <span>{spec.value}</span>
            </li>
          ))}
        </ul>

        {/* Spacer to push price & CTA to bottom */}
        <div className="mt-auto" />

        {/* Price */}
        <p className="text-lg font-bold text-[color:var(--gold)]">
          {product.priceLabel}
        </p>

        {/* CTA */}
        <a
          href={`/san-pham/${product.id}`}
          className={clsx(
            'mt-1 block w-full rounded-lg border border-[color:var(--gold)] py-2.5 text-center',
            'text-sm font-bold uppercase tracking-wider text-[color:var(--gold)]',
            'hover:bg-[color:var(--gold)] hover:text-[color:var(--bg)] transition-colors duration-200',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)]'
          )}
        >
          Xem chi tiết
        </a>
      </div>
    </article>
  );
}
