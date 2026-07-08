import Image from 'next/image'
import Link from 'next/link'
import { services as staticServices } from '@/data/home'
import { SectionHeading } from '@/components/ui/section-heading'
import { PublicService } from '@/types/public'

interface ServicesSectionProps {
  services?: PublicService[]
}

export default function ServicesSection({ services }: ServicesSectionProps) {
  const displayServices: PublicService[] = services && services.length > 0
    ? services
    : staticServices.map((s, i) => ({
        id: `service-${i}`,
        title: s.title,
        slug: s.title.toLowerCase().replace(/\s+/g, '-'),
        description: s.subtitle,
        image: s.image,
      }))

  return (
    <section className="py-14 lg:py-20" aria-label="Dịch vụ của chúng tôi">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <SectionHeading title="DỊCH VỤ CỦA CHÚNG TÔI" linkHref="/dich-vu" linkText="Xem tất cả" />

        {/* Desktop / Tablet grid */}
        <div className="hidden sm:grid sm:grid-cols-3 sm:gap-4 xl:grid-cols-5">
          {displayServices.map((service) => (
            <Link
              href={`/dich-vu/${service.slug}`}
              key={service.id}
              className="group relative cursor-pointer overflow-hidden rounded-xl block"
            >
              <div className="relative aspect-[3/4]">
                <Image
                  src={service.image}
                  alt={`Dịch vụ ${service.title}`}
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
                    {service.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="flex gap-4 overflow-x-auto snap-x scrollbar-hidden sm:hidden">
          {displayServices.map((service) => (
            <Link
              href={`/dich-vu/${service.slug}`}
              key={service.id}
              className="group relative min-w-[200px] cursor-pointer snap-start overflow-hidden rounded-xl block"
            >
              <div className="relative aspect-[3/4]">
                <Image
                  src={service.image}
                  alt={`Dịch vụ ${service.title}`}
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
                    {service.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
