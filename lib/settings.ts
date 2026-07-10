import prisma from '@/lib/prisma'
import { defaultSettings, getDefaultSetting, settingGroupMap, type SettingGroup } from '@/data/default-settings'

export async function getSetting<T>(group: string, key: string, fallback: T): Promise<T> {
  try {
    const setting = await prisma.setting.findUnique({ where: { group_key: { group, key } } })
    return (setting?.value as T | null) ?? fallback
  } catch {
    return fallback
  }
}

export async function getSettingsByGroup<T>(group: string, fallback: T): Promise<T> {
  return getSetting(group, 'main', fallback)
}

export async function upsertSetting(
  group: string,
  key: string,
  value: unknown,
  options: { type?: string; label?: string; description?: string; isPublic?: boolean } = {},
) {
  await prisma.setting.upsert({
    where: { group_key: { group, key } },
    update: { value: value as any, ...options },
    create: {
      group, key, value: value as any, type: options.type || 'json', label: options.label,
      description: options.description, isPublic: options.isPublic ?? true,
    },
  })
}

export async function getPublicSiteSettings() {
  const entries = await Promise.all(
    Object.keys(settingGroupMap).map(async (group) => {
      if (group === 'integrations.tracking') return [group, getDefaultSetting(group)] as const
      const fallback = getDefaultSetting(group)
      return [group, await getSettingsByGroup(group, fallback)] as const
    }),
  )
  return Object.fromEntries(entries)
}

export async function getResolvedPublicSettings() {
  const [general, brand, contact, social, header, footer, home, products, services, posts, seo, popup, advanced] = await Promise.all([
    getSettingsByGroup('general.site', defaultSettings.generalSite),
    getSettingsByGroup('brand.identity', defaultSettings.brandIdentity),
    getSettingsByGroup('contact.info', defaultSettings.contactInfo),
    getSettingsByGroup('social.links', defaultSettings.socialLinks),
    getSettingsByGroup('header.config', defaultSettings.headerConfig),
    getSettingsByGroup('footer.config', defaultSettings.footerConfig),
    getSettingsByGroup('home.config', defaultSettings.homeConfig),
    getSettingsByGroup('products.config', defaultSettings.productsConfig),
    getSettingsByGroup('services.config', defaultSettings.servicesConfig),
    getSettingsByGroup('posts.config', defaultSettings.postsConfig),
    getSettingsByGroup('seo.default', defaultSettings.seoDefault),
    getSettingsByGroup('popup.config', defaultSettings.popupConfig),
    getSettingsByGroup('advanced.config', defaultSettings.advancedConfig),
  ])
  return { general, brand, contact, social, header, footer, home, products, services, posts, seo, popup, advanced }
}

export function defaultForGroup(group: SettingGroup) {
  return getDefaultSetting(group)
}
