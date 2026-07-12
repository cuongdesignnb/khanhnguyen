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
    topNoticeEnabled: false, topNoticeText: '', topNoticeIcon: 'Megaphone', topNoticeBackgroundColor: '#F5B51B', topNoticeTextColor: '#070707', showSearch: true, showWishlist: true, showCompare: true,
    showAccount: true, stickyHeader: true, primaryCtaLabel: 'Nhận báo giá', primaryCtaUrl: '/lien-he',
    hotlineLabel: 'Hotline', menuItems: navigation.map((item) => ({
      label: item.label, url: item.href,
      children: item.children?.map((child) => ({ label: child.label, url: child.href })),
    })),
    showLogo: true, showTagline: true, showCart: true,
    utilityLeft: [
      { id: 'header-hotline', label: 'Hotline', icon: 'Phone', dataSource: 'hotline', actionType: 'phone', target: '_self', isEnabled: true, sortOrder: 0 },
      { id: 'header-email', label: 'Email', icon: 'Mail', dataSource: 'email', actionType: 'email', target: '_self', isEnabled: true, sortOrder: 1 },
      { id: 'header-showroom', label: 'Showroom', icon: 'MapPin', dataSource: 'showroomAddress', actionType: 'internal', url: '/lien-he', target: '_self', isEnabled: true, sortOrder: 2 },
    ],
    utilityRight: [
      { id: 'header-support', label: 'Hỗ trợ 24/7', icon: 'Headset', dataSource: 'hotline', actionType: 'phone', target: '_self', isEnabled: true, sortOrder: 0 },
      { id: 'header-catalogue', label: 'Tải Catalogue', icon: 'FileDown', actionType: 'catalogue', url: '/catalogue', target: '_self', isEnabled: true, sortOrder: 1 },
      { id: 'header-order-tracking', label: 'Kiểm tra đơn hàng', icon: 'PackageSearch', actionType: 'orderTracking', url: '/kiem-tra-don-hang', target: '_self', isEnabled: true, sortOrder: 2 },
    ],
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
    categoryProductSectionsEnabled: true, categoryProductLimit: 8,
    categoriesEnabled: true, brandsEnabled: true, servicesEnabled: true, testimonialsEnabled: true, statsEnabled: true,
    newsEnabled: true, newsLimit: 3, promoBannerEnabled: true, promoBannerTitle: '', promoBannerDescription: '',
    promoBannerImageId: null, promoBannerCtaLabel: 'Xem chi tiết', promoBannerCtaUrl: '/san-pham',
  },
  productsConfig: {
    listingTitle: 'Sản phẩm xe nâng', listingDescription: '', defaultSort: 'latest', productsPerPage: 12,
    showPrice: true, priceFallbackLabel: 'Liên hệ', showCompare: true, showWishlist: true, showQuoteButton: true,
    showZaloButton: true, showHotlineButton: true, relatedProductsLimit: 4, enableProductReviews: true,
    requireReviewApproval: true, categoryBannerDefaultId: null,
    cardQuickSpecsEnabled: true, cardVisibleSpecsLimit: 3,
    cardHoverSpecsEnabled: true, cardHoverSpecsLimit: 6,
    cardPrioritySpecs: ['model', 'capacity', 'liftHeight'], cardImageRatio: '4:3',
    enableCompare: true, compareMaxItems: 4, compareFloatingTrayEnabled: true,
    compareAllowDifferentGroups: true, compareShareEnabled: true,
    compareAddAllToQuoteEnabled: true, compareShowEqualRowsByDefault: true,
    compareEmptyTitle: 'Bạn chưa chọn sản phẩm nào để so sánh.',
    compareEmptyDescription: 'Chọn tối đa 4 sản phẩm để so sánh thông số kỹ thuật.',
    compareButtonLabel: 'So sánh',
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
    siteName: 'Khanh Nguyên Forklift',
    defaultTitle: 'Khanh Nguyên | Chuyên mua bán xe nâng, xe cẩu',
    titleTemplate: '%s | Khanh Nguyên Forklift',
    defaultDescription: 'Xe nâng Nhật bãi, xe cẩu, phụ tùng và dịch vụ thiết bị nâng hạ.',
    defaultKeywords: ['xe nâng', 'xe nâng Nhật bãi', 'xe nâng điện', 'xe nâng dầu'],
    siteUrl: '', defaultOgImageId: null, defaultOgImageUrl: null,
    twitterCard: 'summary_large_image', robotsIndex: true, robotsFollow: true,
    googleVerificationCode: '', bingVerificationCode: '',
  },
  seoOrganization: {
    organizationName: 'Khanh Nguyên Forklift', legalName: 'Khanh Nguyên',
    description: 'Chuyên cung cấp xe nâng và giải pháp thiết bị nâng hạ.', logoId: null, logoUrl: null,
    phone: siteConfig.hotline, email: siteConfig.email, address: siteConfig.showroom,
    addressLocality: '', addressRegion: '', postalCode: '', addressCountry: 'VN',
    latitude: '', longitude: '', openingHours: [{ days: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], opens: '07:30', closes: '17:30' }],
    areaServed: ['Việt Nam'], socialLinks: [], businessType: 'LocalBusiness',
  },
  seoSchemas: {
    organizationEnabled: true, localBusinessEnabled: true, breadcrumbEnabled: true,
    productEnabled: true, articleEnabled: true, faqEnabled: true, serviceEnabled: true,
  },
  seoRobots: {
    allowIndexing: true,
    disallow: ['/admin/', '/api/', '/tai-khoan/', '/gio-hang/', '/dang-nhap', '/dang-ky', '/quen-mat-khau'],
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
  aboutConfig: { enabled: true, pageTitle: 'Giới thiệu', pageDescription: '', emptyMessage: '' },
  productDetailConfig: { enabled: true, pageTitle: 'Chi tiết sản phẩm', pageDescription: '', emptyMessage: '' },
  catalogueConfig: { enabled: true, pageTitle: 'Catalogue', pageDescription: '', emptyMessage: 'Catalogue đang được cập nhật.' },
  supportConfig: { enabled: true, pageTitle: 'Hỗ trợ khách hàng', pageDescription: '', emptyMessage: 'Nội dung đang được cập nhật.' },
  accountConfig: { enabled: true, pageTitle: 'Tài khoản khách hàng', pageDescription: '', emptyMessage: 'Chưa có dữ liệu.' },
  quoteCartConfig: { enabled: true, pageTitle: 'Giỏ hàng yêu cầu báo giá', pageDescription: '', emptyMessage: 'Giỏ hàng đang trống.' },
  searchConfig: { enabled: true, pageTitle: 'Tìm kiếm', pageDescription: '', emptyMessage: 'Không tìm thấy kết quả phù hợp.' },
} as const

export const settingGroupMap = {
  'general.site': 'generalSite', 'brand.identity': 'brandIdentity', 'contact.info': 'contactInfo',
  'social.links': 'socialLinks', 'header.config': 'headerConfig', 'footer.config': 'footerConfig',
  'home.config': 'homeConfig', 'products.config': 'productsConfig', 'services.config': 'servicesConfig',
  'posts.config': 'postsConfig', 'seo.default': 'seoDefault', 'integrations.tracking': 'integrationsTracking',
  'seo.organization': 'seoOrganization', 'seo.schemas': 'seoSchemas', 'seo.robots': 'seoRobots',
  'popup.config': 'popupConfig', 'advanced.config': 'advancedConfig',
  'about.config': 'aboutConfig', 'product-detail.config': 'productDetailConfig',
  'catalogue.config': 'catalogueConfig', 'support.config': 'supportConfig',
  'account.config': 'accountConfig', 'quote-cart.config': 'quoteCartConfig', 'search.config': 'searchConfig',
} as const

export type SettingGroup = keyof typeof settingGroupMap

export function getDefaultSetting(group: string): Record<string, any> {
  const key = settingGroupMap[group as SettingGroup]
  return key ? structuredClone(defaultSettings[key]) : {}
}
