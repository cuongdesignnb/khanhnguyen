import { siteConfig, navigation, footerGroups } from './home'

export const defaultSettings = {
  generalSite: {
    siteName: 'Khanh Nguyên Forklift', companyName: 'Khanh Nguyên', shortName: 'Khanh Nguyên',
    slogan: 'Xe nâng Nhật bãi chất lượng cao', description: siteConfig.slogan, language: 'vi',
    timezone: 'Asia/Ho_Chi_Minh', currency: 'VND', currencySymbol: '₫',
    maintenanceMode: false, maintenanceMessage: 'Website đang được bảo trì. Vui lòng quay lại sau.',
  },
  brandIdentity: {
    logoId: null, logoDarkId: null, logoLightId: null, faviconId: null, ogDefaultImageId: null,
    brandColor: '#f5b51b', accentColor: '#d99b00', fontFamily: 'Be Vietnam Pro',
  },
  contactInfo: {
    hotline: siteConfig.hotline, hotlineSecondary: siteConfig.secondaryHotline, phone: siteConfig.hotline,
    zaloPhone: siteConfig.hotline, email: siteConfig.email, salesEmail: siteConfig.email,
    supportEmail: siteConfig.email, address: siteConfig.showroom, showroomAddress: siteConfig.showroom,
    warehouseAddress: siteConfig.branch, workingHours: siteConfig.workingHours,
    googleMapUrl: '', googleMapEmbed: '', taxCode: '', businessLicense: '',
  },
  socialLinks: { facebook: '', zalo: '', youtube: '', tiktok: '', linkedin: '', googleBusiness: '', messenger: '' },
  headerConfig: {
    topNoticeEnabled: false, topNoticeText: '', showSearch: true, showWishlist: true, showCompare: true,
    showAccount: true, stickyHeader: true, primaryCtaLabel: 'Nhận báo giá', primaryCtaUrl: '/lien-he',
    hotlineLabel: 'Hotline', menuItems: navigation.map((item) => ({
      label: item.label, url: item.href,
      children: item.children?.map((child) => ({ label: child.label, url: child.href })),
    })),
  },
  footerConfig: {
    description: siteConfig.slogan, copyrightText: `© ${new Date().getFullYear()} Khanh Nguyên Forklift.`,
    showNewsletter: false, newsletterTitle: 'Đăng ký nhận tin', newsletterDescription: '',
    columns: footerGroups.map((column) => ({ title: column.title, links: column.links.map((link) => ({ label: link.label, url: link.href })) })),
    bottomLinks: [{ label: 'Chính sách bảo mật', url: '/chinh-sach-bao-mat' }, { label: 'Điều khoản', url: '/dieu-khoan' }],
  },
  homeConfig: {
    heroEnabled: true, heroTitle: 'GIẢI PHÁP XE NÂNG TOÀN DIỆN', heroSubtitle: 'KHANH NGUYÊN FORKLIFT',
    heroDescription: 'Xe nâng Nhật bãi tuyển chọn, dịch vụ kỹ thuật tận tâm.',
    heroPrimaryCtaLabel: 'Xem sản phẩm', heroPrimaryCtaUrl: '/san-pham',
    heroSecondaryCtaLabel: 'Nhận tư vấn', heroSecondaryCtaUrl: '/lien-he', heroImageId: null,
    featuredProductsEnabled: true, featuredProductsTitle: 'Sản phẩm nổi bật', featuredProductsSubtitle: '', featuredProductsLimit: 8,
    categoriesEnabled: true, brandsEnabled: true, servicesEnabled: true, testimonialsEnabled: true, statsEnabled: true,
    newsEnabled: true, newsLimit: 3, promoBannerEnabled: true, promoBannerTitle: '', promoBannerDescription: '',
    promoBannerImageId: null, promoBannerCtaLabel: 'Xem chi tiết', promoBannerCtaUrl: '/san-pham',
  },
  productsConfig: {
    listingTitle: 'Sản phẩm xe nâng', listingDescription: '', defaultSort: 'latest', productsPerPage: 12,
    showPrice: true, priceFallbackLabel: 'Liên hệ', showCompare: true, showWishlist: true, showQuoteButton: true,
    showZaloButton: true, showHotlineButton: true, relatedProductsLimit: 4, enableProductReviews: true,
    requireReviewApproval: true, categoryBannerDefaultId: null,
  },
  servicesConfig: {
    listingTitle: 'Dịch vụ xe nâng', listingDescription: '', showFaq: true, showProcess: true,
    showContactForm: true, defaultCtaLabel: 'Liên hệ tư vấn', defaultCtaUrl: '/lien-he',
  },
  postsConfig: {
    listingTitle: 'Tin tức xe nâng', listingDescription: '', postsPerPage: 12, showAuthor: true,
    showPublishedDate: true, showRelatedPosts: true, relatedPostsLimit: 3, enableTableOfContents: true,
    enableShareButtons: true, defaultPostImageId: null,
  },
  seoDefault: {
    defaultTitle: 'Khanh Nguyên | Chuyên mua bán xe nâng, xe cẩu',
    titleTemplate: '%s | Khanh Nguyên Forklift',
    defaultDescription: 'Xe nâng Nhật bãi, xe cẩu, phụ tùng và dịch vụ thiết bị nâng hạ.',
    defaultKeywords: 'xe nâng, xe nâng Nhật bãi, xe nâng điện, xe nâng dầu',
    canonicalUrl: '', robotsIndex: true, robotsFollow: true, ogTitle: '', ogDescription: '',
    ogImageId: null, twitterCard: 'summary_large_image', organizationSchemaEnabled: true,
    localBusinessSchemaEnabled: true, productSchemaEnabled: true, articleSchemaEnabled: true, faqSchemaEnabled: true,
  },
  integrationsTracking: {
    googleAnalyticsId: '', googleTagManagerId: '', facebookPixelId: '', googleSearchConsoleCode: '',
    customHeadScript: '', customBodyScript: '', customFooterScript: '',
  },
  popupConfig: {
    enabled: false, type: 'popup', title: '', description: '', imageId: null, ctaLabel: '',
    ctaUrl: '', delaySeconds: 5, showOncePerSession: true,
  },
  advancedConfig: {
    enableCache: true, cacheTtlSeconds: 300, enableDebugMode: false, enableSitemap: true,
    enableRobots: true, defaultNoImageId: null, lazyLoadImages: true,
  },
} as const

export const settingGroupMap = {
  'general.site': 'generalSite', 'brand.identity': 'brandIdentity', 'contact.info': 'contactInfo',
  'social.links': 'socialLinks', 'header.config': 'headerConfig', 'footer.config': 'footerConfig',
  'home.config': 'homeConfig', 'products.config': 'productsConfig', 'services.config': 'servicesConfig',
  'posts.config': 'postsConfig', 'seo.default': 'seoDefault', 'integrations.tracking': 'integrationsTracking',
  'popup.config': 'popupConfig', 'advanced.config': 'advancedConfig',
} as const

export type SettingGroup = keyof typeof settingGroupMap

export function getDefaultSetting(group: string): Record<string, any> {
  const key = settingGroupMap[group as SettingGroup]
  return key ? structuredClone(defaultSettings[key]) : {}
}
