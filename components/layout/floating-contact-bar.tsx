import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import type {
  ResolvedFloatingContactConfig,
  ResolvedFloatingContactItem,
} from "@/types/floating-contact";
import { isBrowserHandledHref } from "@/lib/urls/normalize-configured-href";

function ContactIcon({ item }: { item: ResolvedFloatingContactItem }) {
  return (
    <span className="relative flex size-10 shrink-0 items-center justify-center sm:size-11 lg:size-10">
      {item.resolvedIconUrl ? (
        <Image
          src={item.resolvedIconUrl}
          alt=""
          fill
          sizes="44px"
          className="object-contain"
        />
      ) : (
        <MessageCircle aria-hidden className="size-7 text-sky-500" />
      )}
      {item.badge && (
        <span className="absolute -right-1 -top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-black leading-none text-white">
          {item.badge}
        </span>
      )}
    </span>
  );
}

function ContactLink({
  item,
  className,
}: {
  item: ResolvedFloatingContactItem;
  className: string;
}) {
  const content = (
    <>
      <ContactIcon item={item} />
      <span className="max-w-full truncate">{item.label}</span>
    </>
  );
  const external = item.target === "_blank" || isBrowserHandledHref(item.href);

  if (external) {
    return (
      <a
        href={item.href}
        target={item.target}
        rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
        className={className}
        aria-label={item.label}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={item.href} className={className} aria-label={item.label}>
      {content}
    </Link>
  );
}

export default function FloatingContactBar({
  config,
}: {
  config: ResolvedFloatingContactConfig;
}) {
  if (!config.enabled || config.items.length === 0) return null;

  const mobileItems = config.items.slice(0, 6);
  const mobileClass =
    "flex min-w-0 flex-col items-center justify-center gap-1 px-1 py-2 text-center text-[10px] font-semibold leading-tight text-neutral-900 transition hover:bg-black/5 focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-sky-500 active:scale-95 sm:text-xs";
  const desktopClass =
    "group flex w-[76px] flex-col items-center justify-center gap-1 border-b border-black/10 px-1 py-2 text-center text-[10px] font-bold leading-tight text-neutral-900 transition last:border-b-0 hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-sky-500";

  return (
    <>
      {config.showOnMobile && mobileItems.length > 0 && (
        <div aria-hidden className="h-20 lg:hidden" />
      )}
      {config.showOnMobile && mobileItems.length > 0 && (
        <nav
          aria-label="Liên hệ nhanh"
          className="mobile-safe-bottom fixed inset-x-0 bottom-0 z-[70] border-t border-black/10 shadow-[0_-8px_28px_rgba(0,0,0,0.18)] lg:hidden"
          style={{ backgroundColor: config.mobileBackgroundColor }}
        >
          <div
            className="mx-auto grid min-h-[68px] max-w-xl"
            style={{
              gridTemplateColumns: `repeat(${mobileItems.length}, minmax(0, 1fr))`,
            }}
          >
            {mobileItems.map((item) => (
              <ContactLink
                key={item.id}
                item={item}
                className={mobileClass}
              />
            ))}
          </div>
        </nav>
      )}

      {config.showOnDesktop && (
        <nav
          aria-label="Liên hệ nhanh"
          className="fixed right-0 z-[65] hidden -translate-y-1/2 overflow-hidden rounded-l-2xl border border-r-0 border-black/10 shadow-[-8px_8px_28px_rgba(0,0,0,0.22)] lg:flex lg:flex-col"
          style={{
            top: `${config.desktopTopPercent}%`,
            backgroundColor: config.desktopBackgroundColor,
          }}
        >
          {config.items.map((item) => (
            <ContactLink
              key={item.id}
              item={item}
              className={desktopClass}
            />
          ))}
        </nav>
      )}
    </>
  );
}
