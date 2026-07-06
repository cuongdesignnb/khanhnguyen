import clsx from 'clsx';

interface SectionHeadingProps {
  title: string;
  linkText?: string;
  linkHref?: string;
  className?: string;
}

export function SectionHeading({
  title,
  linkText,
  linkHref,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={clsx(
        'flex items-end justify-between mb-8 lg:mb-10',
        className
      )}
    >
      <div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold uppercase tracking-tight text-[color:var(--text)]">
          {title}
        </h2>
        <div className="mt-2 h-1 w-12 rounded-full bg-[color:var(--gold)]" />
      </div>

      {linkText && linkHref && (
        <a
          href={linkHref}
          className="text-sm text-[color:var(--gold)] hover:text-[color:var(--gold-strong)] transition-colors font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)]"
        >
          {linkText}
        </a>
      )}
    </div>
  );
}
