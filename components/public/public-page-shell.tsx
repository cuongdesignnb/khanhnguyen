import { getHomeData } from '@/lib/public-data'
import PublicPageShellClient from './public-page-shell-client'
import { getSettingGroup } from '@/lib/site-config/settings'
import type { ProductCardSettings } from '@/types/product-card-settings'
import { getResolvedFloatingContactConfig } from '@/lib/floating-contact'
import type { HeaderConfig } from '@/types/header-settings'
import type { HeaderContact } from '@/lib/header/resolve-header-utility-item'

export default async function PublicPageShell({ children }: { children: React.ReactNode }) {
  const [data, headerConfig, contactConfig, productCardConfig, floatingContactConfig] = await Promise.all([getHomeData(), getSettingGroup('header.config'), getSettingGroup('contact.info'), getSettingGroup('products.config'), getResolvedFloatingContactConfig()])
  return (
    <PublicPageShellClient data={data} headerConfig={headerConfig as unknown as HeaderConfig} contactConfig={contactConfig as HeaderContact} productCardConfig={productCardConfig as unknown as ProductCardSettings} floatingContactConfig={floatingContactConfig}>
      {children}
    </PublicPageShellClient>
  )
}
