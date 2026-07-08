import Image from 'next/image'

export default function PageHero({
  title,
  subtitle,
  backgroundImage = '/images/seed/hero/industrial-yard.jpg',
}: {
  title: string
  subtitle?: string
  backgroundImage?: string
}) {
  return (
    <section className="relative h-[160px] sm:h-[200px] flex items-center overflow-hidden">
      <Image
        src={backgroundImage}
        alt={title}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/75" />
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase text-white tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-[color:var(--gold)] mt-1 sm:mt-2 font-medium">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  )
}
