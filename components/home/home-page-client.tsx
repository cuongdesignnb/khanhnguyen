'use client'

import { useState } from 'react'
import DesktopHeader from '@/components/layout/desktop-header'
import MobileMenuDrawer from '@/components/layout/mobile-menu-drawer'
import MobileDock from '@/components/layout/mobile-dock'
import Hero from '@/components/home/hero'
import CategoryGrid from '@/components/home/category-grid'
import FeaturedProducts from '@/components/home/featured-products'
import PromoBanner from '@/components/home/promo-banner'
import BrandStrip from '@/components/home/brand-strip'
import WhyUs from '@/components/home/why-us'
import StatsStrip from '@/components/home/stats-strip'
import ServicesSection from '@/components/home/services-section'
import { Testimonials } from '@/components/home/testimonials'
import { LatestNews } from '@/components/home/latest-news'
import { ContactSection } from '@/components/home/contact-section'
import Footer from '@/components/layout/footer'
import { PublicHomeData } from '@/types/public'
import type { HeaderConfig } from '@/types/header-settings'
import type { HeaderContact } from '@/lib/header/resolve-header-utility-item'

interface HomePageClientProps {
  data: PublicHomeData
  headerConfig: HeaderConfig
  contactConfig: HeaderContact
}

export default function HomePageClient({ data, headerConfig, contactConfig }: HomePageClientProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <DesktopHeader
        siteConfig={data.siteConfig}
        navigation={data.navigation}
        headerConfig={headerConfig}
        contactConfig={contactConfig}
        onMenuOpen={() => setMenuOpen(true)}
      />
      <MobileMenuDrawer siteConfig={data.siteConfig} navigation={data.navigation} open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="pb-24 lg:pb-0">
        <Hero />
        <CategoryGrid categories={data.categories} />
        <FeaturedProducts products={data.featuredProducts} />
        <PromoBanner />
        <BrandStrip brands={data.brands} />
        <WhyUs />
        <StatsStrip stats={data.stats} />
        <ServicesSection services={data.services} />
        <Testimonials testimonials={data.testimonials} />
        <LatestNews posts={data.latestPosts} />
        <ContactSection siteConfig={data.siteConfig} />
      </main>

      <Footer siteConfig={data.siteConfig} footerGroups={data.footerGroups} />
      <MobileDock onMenuOpen={() => setMenuOpen(true)} />
    </>
  )
}
