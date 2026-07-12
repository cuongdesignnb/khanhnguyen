import { getHomeData } from '@/lib/public-data'
import PublicPageShellClient from './public-page-shell-client'
import { getSettingGroup } from '@/lib/site-config/settings'
import type { ProductCardSettings } from '@/types/product-card-settings'

export default async function PublicPageShell({ children }: { children: React.ReactNode }) {
  const [data, headerConfig, contactConfig, productCardConfig] = await Promise.all([getHomeData(), getSettingGroup('header.config'), getSettingGroup('contact.info'), getSettingGroup('products.config')])
  return (
    <PublicPageShellClient data={data} headerConfig={headerConfig as any} contactConfig={contactConfig} productCardConfig={productCardConfig as unknown as ProductCardSettings}>
      {children}
    </PublicPageShellClient>
  )
}
