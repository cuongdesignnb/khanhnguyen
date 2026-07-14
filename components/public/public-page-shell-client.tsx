'use client'

import { useState } from 'react'
import DesktopHeader from '@/components/layout/desktop-header'
import MobileMenuDrawer from '@/components/layout/mobile-menu-drawer'
import FloatingContactBar from '@/components/layout/floating-contact-bar'
import Footer from '@/components/layout/footer'
import { PublicHomeData } from '@/types/public'
import type { HeaderConfig } from '@/types/header-settings'
import type { HeaderContact } from '@/lib/header/resolve-header-utility-item'
import { ProductCardConfigProvider } from '@/components/products/product-card-config-provider'
import type { ProductCardSettings } from '@/types/product-card-settings'
import type { ResolvedFloatingContactConfig } from '@/types/floating-contact'

export default function PublicPageShellClient({
  data,
  children,
  headerConfig,
  contactConfig,
  productCardConfig,
  floatingContactConfig,
}: {
  data: PublicHomeData
  children: React.ReactNode
  headerConfig: HeaderConfig
  contactConfig: HeaderContact
  productCardConfig: ProductCardSettings
  floatingContactConfig: ResolvedFloatingContactConfig
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <DesktopHeader siteConfig={data.siteConfig} navigation={data.navigation} headerConfig={headerConfig} contactConfig={contactConfig} onMenuOpen={() => setMenuOpen(true)} />
      <MobileMenuDrawer siteConfig={data.siteConfig} navigation={data.mobileNavigation || data.navigation} open={menuOpen} onClose={() => setMenuOpen(false)} />
      
      <ProductCardConfigProvider settings={productCardConfig}>{children}</ProductCardConfigProvider>

      <Footer siteConfig={data.siteConfig} footerGroups={data.footerGroups} />
      <FloatingContactBar config={floatingContactConfig} />
    </>
  )
}
