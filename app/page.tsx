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

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <DesktopHeader onMenuOpen={() => setMenuOpen(true)} />
      <MobileMenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="pb-24 lg:pb-0">
        <Hero />
        <CategoryGrid />
        <FeaturedProducts />
        <PromoBanner />
        <BrandStrip />
        <WhyUs />
        <StatsStrip />
        <ServicesSection />
        <Testimonials />
        <LatestNews />
        <ContactSection />
      </main>

      <Footer />
      <MobileDock onMenuOpen={() => setMenuOpen(true)} />
    </>
  )
}
