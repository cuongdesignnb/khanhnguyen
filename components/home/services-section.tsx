import Image from 'next/image';
import { services } from '@/data/home';
import { SectionHeading } from '@/components/ui/section-heading';

export default function ServicesSection() {
  return (
    <section className="py-14 lg:py-20" aria-label="Dịch vụ của chúng tôi">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <SectionHeading title="DỊCH VỤ CỦA CHÚNG TÔI" />

        {/* Desktop / Tablet grid */}
        <div className="hidden sm:grid sm:grid-cols-3 sm:gap-4 xl:grid-cols-5">
          {services.map((service) => (
            <article
              key={service.title}
              className="group relative cursor-pointer overflow-hidden rounded-xl"
            >
              <div className="relative aspect-[3/4]">
                <Image
                  src={service.image}
                  alt={`Dịch vụ ${service.title} - ${service.subtitle}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(min-width: 1280px) 20vw, (min-width: 640px) 33vw, 50vw"
                />

                {/* Gradient overlay */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
                />

                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-sm font-bold text-white lg:text-base">
                    {service.title}
                  </h3>
                  <p className="mt-1 text-xs text-[color:var(--muted)]">
                    {service.subtitle}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="flex gap-4 overflow-x-auto snap-x scrollbar-hidden sm:hidden">
          {services.map((service) => (
            <article
              key={service.title}
              className="group relative min-w-[200px] cursor-pointer snap-start overflow-hidden rounded-xl"
            >
              <div className="relative aspect-[3/4]">
                <Image
                  src={service.image}
                  alt={`Dịch vụ ${service.title} - ${service.subtitle}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="200px"
                />

                {/* Gradient overlay */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
                />

                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-sm font-bold text-white">
                    {service.title}
                  </h3>
                  <p className="mt-1 text-xs text-[color:var(--muted)]">
                    {service.subtitle}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
