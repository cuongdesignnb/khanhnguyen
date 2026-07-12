'use client'

import { useState } from 'react'
import DesktopHeader from '@/components/layout/desktop-header'
import MobileMenuDrawer from '@/components/layout/mobile-menu-drawer'
import MobileDock from '@/components/layout/mobile-dock'
import Footer from '@/components/layout/footer'
import { PublicHomeData } from '@/types/public'
import type { HeaderConfig } from '@/types/header-settings'
import type { HeaderContact } from '@/lib/header/resolve-header-utility-item'
import { ProductCardConfigProvider } from '@/components/products/product-card-config-provider'
import type { ProductCardSettings } from '@/types/product-card-settings'

export default function PublicPageShellClient({
  data,
  children,
  headerConfig,
  contactConfig,
  productCardConfig,
}: {
  data: PublicHomeData
  children: React.ReactNode
  headerConfig: HeaderConfig
  contactConfig: HeaderContact
  productCardConfig: ProductCardSettings
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <DesktopHeader siteConfig={data.siteConfig} navigation={data.navigation} headerConfig={headerConfig} contactConfig={contactConfig} onMenuOpen={() => setMenuOpen(true)} />
      <MobileMenuDrawer siteConfig={data.siteConfig} navigation={data.mobileNavigation || data.navigation} open={menuOpen} onClose={() => setMenuOpen(false)} />
      
      <ProductCardConfigProvider settings={productCardConfig}>{children}</ProductCardConfigProvider>

      <Footer siteConfig={data.siteConfig} footerGroups={data.footerGroups} />
      <MobileDock onMenuOpen={() => setMenuOpen(true)} />
    </>
  )
}
