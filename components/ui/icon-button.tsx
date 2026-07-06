import clsx from 'clsx';

interface IconButtonProps {
  ariaLabel: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
}

const baseStyles = clsx(
  'inline-flex items-center justify-center rounded-lg p-2',
  'text-[color:var(--muted)] hover:text-[color:var(--gold)] transition-colors',
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)]'
);

export function IconButton({
  ariaLabel,
  children,
  className,
  onClick,
  href,
}: IconButtonProps) {
  if (href) {
    return (
      <a
        href={href}
        aria-label={ariaLabel}
        className={clsx(baseStyles, className)}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={clsx(baseStyles, className)}
    >
      {children}
    </button>
  );
}
