import Image from 'next/image';
import { Star } from 'lucide-react';
import { testimonials } from '@/data/home';
import { SectionHeading } from '@/components/ui/section-heading';

export function Testimonials() {
  return (
    <section className="py-14 lg:py-20 bg-[color:var(--surface)]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="KHÁCH HÀNG NÓI VỀ CHÚNG TÔI"
          className="justify-center text-center"
        />

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} testimonial={t} />
          ))}
        </div>

        {/* Mobile horizontal scroll */}
        <div className="flex md:hidden overflow-x-auto snap-x gap-4 scrollbar-hidden">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface TestimonialCardProps {
  testimonial: (typeof testimonials)[number];
}

function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <article className="bg-[color:var(--surface-2)] rounded-xl p-6 border border-white/10 min-w-[300px] snap-start">
      {/* Author info */}
      <div className="flex items-center gap-3">
        <Image
          src={testimonial.image}
          alt={`Ảnh đại diện của ${testimonial.name}`}
          width={48}
          height={48}
          className="rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-white">
            {testimonial.name} – {testimonial.location}
          </p>
        </div>
      </div>

      {/* Star rating */}
      <div className="flex items-center gap-0.5 mt-3" aria-label={`Đánh giá ${testimonial.rating} trên 5 sao`}>
        {Array.from({ length: testimonial.rating }, (_, i) => (
          <Star
            key={i}
            size={16}
            className="fill-[var(--gold)] text-[color:var(--gold)]"
          />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="text-sm text-[color:var(--silver)] mt-3 italic leading-relaxed">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
    </article>
  );
}
