import Image from 'next/image';
import { Calendar } from 'lucide-react';
import { latestPosts } from '@/data/home';
import { SectionHeading } from '@/components/ui/section-heading';

export function LatestNews() {
  return (
    <section className="py-14 lg:py-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="TIN TỨC MỚI NHẤT" />

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {latestPosts.map((post) => (
            <NewsCard key={post.id} post={post} />
          ))}
        </div>

        {/* Mobile horizontal scroll */}
        <div className="flex md:hidden overflow-x-auto snap-x gap-4 scrollbar-hidden">
          {latestPosts.map((post) => (
            <NewsCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface NewsCardProps {
  post: (typeof latestPosts)[number];
}

function NewsCard({ post }: NewsCardProps) {
  return (
    <article className="bg-[color:var(--surface-2)] rounded-xl overflow-hidden border border-white/10 hover:border-[color:var(--line-gold)] transition group min-w-[300px] snap-start">
      {/* Image */}
      <div className="aspect-[16/9] relative overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 300px, (max-width: 1200px) 33vw, 460px"
        />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        {/* Date */}
        <div className="flex items-center gap-1.5">
          <Calendar size={14} className="text-[color:var(--muted)]" />
          <time className="text-xs text-[color:var(--muted)]">{post.date}</time>
        </div>

        {/* Title */}
        <h3 className="font-bold text-white mt-2 line-clamp-2 text-base">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-[color:var(--muted)] mt-2 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Read more link */}
        <a
          href={post.href}
          className="text-sm text-[color:var(--gold)] hover:text-[color:var(--gold-strong)] mt-3 inline-block font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)]"
        >
          Xem thêm →
        </a>
      </div>
    </article>
  );
}
