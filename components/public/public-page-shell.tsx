import { getHomeData } from '@/lib/public-data'
import PublicPageShellClient from './public-page-shell-client'

export default async function PublicPageShell({ children }: { children: React.ReactNode }) {
  const data = await getHomeData()
  return (
    <PublicPageShellClient data={data}>
      {children}
    </PublicPageShellClient>
  )
}
