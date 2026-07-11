import prisma from '@/lib/prisma'
import { defaultSettings } from '@/data/default-settings'
import { getSettingsByGroup } from '@/lib/settings'
import { normalizeSiteUrl } from './canonical'

export async function getSeoConfig() {
  const [seo, organization, schemas, robots, brand, contact, social] = await Promise.all([
    getSettingsByGroup('seo.default', defaultSettings.seoDefault),
    getSettingsByGroup('seo.organization', defaultSettings.seoOrganization),
    getSettingsByGroup('seo.schemas', defaultSettings.seoSchemas),
    getSettingsByGroup('seo.robots', defaultSettings.seoRobots),
    getSettingsByGroup('brand.identity', defaultSettings.brandIdentity),
    getSettingsByGroup('contact.info', defaultSettings.contactInfo),
    getSettingsByGroup('social.links', defaultSettings.socialLinks),
  ])
  const siteUrl = normalizeSiteUrl(seo.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
  const imageCandidates: unknown[] = [seo.defaultOgImageId, organization.logoId, brand.faviconId]
  const imageIds = imageCandidates.filter((id): id is string => typeof id === 'string' && id.length > 0)
  const media = imageIds.length ? await prisma.mediaFile.findMany({ where: { id: { in: imageIds }, deletedAt: null }, select: { id: true, url: true } }) : []
  const mediaUrl = (id?: string | null) => media.find((item) => item.id === id)?.url || null
  return {
    seo, schemas, robots, siteUrl,
    defaultOgImage: seo.defaultOgImageUrl || mediaUrl(seo.defaultOgImageId),
    favicon: mediaUrl(brand.faviconId),
    organization: {
      ...organization,
      organizationName: organization.organizationName || seo.siteName,
      logoUrl: organization.logoUrl || mediaUrl(organization.logoId),
      phone: organization.phone || contact.hotline,
      email: organization.email || contact.email,
      address: organization.address || contact.address,
      socialLinks: (organization.socialLinks?.length ? [...organization.socialLinks] : Object.values(social).map(String)).filter((url) => /^https?:\/\//.test(url)),
    },
  }
}
