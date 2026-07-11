import { getHomeData } from '@/lib/public-data'
import PublicPageShellClient from './public-page-shell-client'
import { getSettingGroup } from '@/lib/site-config/settings'

export default async function PublicPageShell({ children }: { children: React.ReactNode }) {
  const [data, headerConfig, contactConfig] = await Promise.all([getHomeData(), getSettingGroup('header.config'), getSettingGroup('contact.info')])
  return (
    <PublicPageShellClient data={data} headerConfig={headerConfig as any} contactConfig={contactConfig}>
      {children}
    </PublicPageShellClient>
  )
}
