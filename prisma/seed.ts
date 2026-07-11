import { PrismaClient } from '@prisma/client'
import { hashPassword } from 'better-auth/crypto'
import * as homeData from '../data/home'
import * as adminData from '../data/admin'
import { toVietnameseSlug } from '../lib/slug'
import { defaultSettings, settingGroupMap } from '../data/default-settings'
import { defaultFooterMenu, defaultHeaderMenu, defaultMobileMenu, type DefaultMenuItem } from '../data/default-menus'
import { defaultPages } from '../data/default-pages'

const prisma = new PrismaClient() as any

async function main() {
  console.log('Start seeding...')

  // 1. Seed Admin User
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@khanhnguyen.vn'
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456'
  const adminName = process.env.ADMIN_NAME || 'Administrator'

  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail }
  })

  let adminId = ''
  if (!existingUser) {
    const hashedPassword = await hashPassword(adminPassword)
    const user = await prisma.user.create({
      data: {
        email: adminEmail,
        name: adminName,
        role: 'ADMIN',
        emailVerified: true
      }
    })
    adminId = user.id

    await prisma.account.create({
      data: {
        userId: user.id,
        providerId: 'credential',
        accountId: adminEmail,
        password: hashedPassword
      }
    })
    console.log('Admin user created successfully.')
  } else {
    adminId = existingUser.id
    console.log('Admin user already exists.')
  }

  // Helper function for media files
  async function upsertMedia(url: string) {
    const filename = url.split('/').pop() || 'file'
    const ext = '.' + filename.split('.').pop()
    const originalName = filename

    const existing = await prisma.mediaFile.findFirst({
      where: { url }
    })
    if (existing) return existing

    return prisma.mediaFile.create({
      data: {
        filename,
        originalName,
        path: `public${url}`,
        url,
        mimeType: ext === '.png' ? 'image/png' : 'image/jpeg',
        extension: ext,
        size: 1024,
        type: 'IMAGE',
      }
    })
  }

  // 2. Seed Settings
  console.log('Seeding settings...')
  for (const [group, defaultKey] of Object.entries(settingGroupMap)) {
    await prisma.setting.upsert({
      where: { group_key: { group, key: 'main' } },
      update: {},
      create: {
        group, key: 'main', label: group, value: (defaultSettings as any)[defaultKey],
        type: 'json', isPublic: group !== 'integrations.tracking',
      },
    })
  }
  for (const [pageKey, name] of defaultPages) {
    await prisma.pageConfiguration.upsert({ where: { pageKey }, update: {}, create: { pageKey, name, isActive: true } })
  }

  // 3. Seed Categories
  console.log('Seeding categories...')
  const categoryIdMap = new Map<string, string>()
  for (let i = 0; i < homeData.categories.length; i++) {
    const cat = homeData.categories[i]
    const dbCat = await prisma.category.upsert({
      where: { slug: cat.id },
      update: { name: cat.label },
      create: {
        name: cat.label,
        slug: cat.id,
        icon: cat.icon,
        sortOrder: i,
        isVisible: true
      }
    })
    categoryIdMap.set(cat.label, dbCat.id)
  }

  // Add child categories from admin data if present
  for (const adminCat of adminData.adminCategories) {
    if (adminCat.parent) {
      const parentId = categoryIdMap.get(adminCat.parent)
      if (parentId) {
        await prisma.category.upsert({
          where: { slug: adminCat.slug },
          update: { parentId },
          create: {
            parentId,
            name: adminCat.name,
            slug: adminCat.slug,
            description: adminCat.description,
            sortOrder: adminCat.order,
            isVisible: adminCat.isVisible
          }
        })
      }
    }
  }

  // 4. Seed Brands
  console.log('Seeding brands...')
  const brandIdMap = new Map<string, string>()
  for (let i = 0; i < homeData.brandNames.length; i++) {
    const name = homeData.brandNames[i]
    const slug = toVietnameseSlug(name)
    
    // Find matching admin brand to get mock logo and details
    const adminBrand = adminData.adminBrands.find(b => b.name === name)
    let logoMediaId: string | undefined
    if (adminBrand?.logo) {
      const media = await upsertMedia(adminBrand.logo)
      logoMediaId = media.id
    }

    const dbBrand = await prisma.brand.upsert({
      where: { slug },
      update: { name },
      create: {
        name,
        slug,
        logoId: logoMediaId || null,
        description: adminBrand?.description || `${name} Forklift`,
        isVisible: true,
        sortOrder: i
      }
    })
    brandIdMap.set(name, dbBrand.id)
  }

  // 5. Seed Products
  console.log('Seeding products...')
  const productIdMap = new Map<string, string>()
  const productsToSeed = [...homeData.featuredProducts]
  
  // Merge in admin products
  for (const adminProd of adminData.adminProducts) {
    if (!productsToSeed.some(p => p.name === adminProd.name)) {
      productsToSeed.push({
        id: adminProd.id,
        name: adminProd.name,
        model: adminProd.model,
        category: adminProd.category,
        price: adminProd.price ? adminProd.price.toString() : null,
        priceLabel: adminProd.priceLabel,
        image: adminProd.image,
        specs: []
      } as any)
    }
  }

  // Mandatory demo product
  const toyotaDemo = {
    name: 'Xe nâng điện đứng lái Toyota 1.5 tấn 7FB15',
    slug: 'xe-nang-dien-dung-lai-toyota-15-tan-7fb15',
    sku: 'KN-ED-7FB15-2019',
    model: '7FB15',
    category: 'Xe nâng điện',
    brand: 'Toyota',
    price: '425000000',
    priceLabel: '425.000.000đ',
    badge: 'Mới',
    stockStatus: 'IN_STOCK',
    isFeatured: true,
    isBestSeller: true,
    capacity: '1500 kg',
    liftHeight: '4.5 m',
    fuelType: 'Điện',
    manufactureYear: 2019,
    forkLength: '1070 mm',
    condition: 'Nhật bãi 85%',
    origin: 'Nhật Bản',
    shortDescription: 'Xe nâng điện đứng lái Toyota 7FB15 tải trọng 1.5 tấn, nâng cao 4.5m, hoạt động êm ái, tiết kiệm năng lượng, phù hợp kho xưởng, kệ cao.',
    description: 'Xe nâng điện đứng lái Toyota 7FB15 là lựa chọn tối ưu cho các kho xưởng, nhà máy, siêu thị với khả năng vận hành linh hoạt trong không gian hẹp. Được thiết kế bởi Toyota Nhật Bản, sản phẩm nổi bật với độ bền cao, vận hành êm ái, tiết kiệm điện năng và chi phí bảo trì thấp.',
    advantages: [
      'Thiết kế nhỏ gọn, bán kính quay vòng nhỏ, phù hợp lối đi hẹp.',
      'Động cơ điện mạnh mẽ, vận hành êm, không khí thải, thân thiện môi trường.',
      'Hệ thống điều khiển thông minh, an toàn và chính xác.',
      'Pin dung lượng lớn, thời gian sử dụng dài, sạc nhanh.',
      'Độ bền cao, phụ tùng dễ thay thế, chi phí bảo dưỡng thấp.'
    ],
    warrantyPolicy: 'Bảo hành 6 – 12 tháng hoặc 1000 giờ hoạt động tùy điều kiện nào đến trước. Hỗ trợ kỹ thuật 24/7 qua hotline, Zalo.',
    image: '/images/seed/products/toyota-8fb25.jpg',
    specs: {
      'Model': '7FB15',
      'Thương hiệu': 'Toyota',
      'Tải trọng nâng': '1500 kg',
      'Chiều cao nâng': '4500 mm',
      'Tâm tải trọng': '500 mm',
      'Chiều dài càng': '1070 mm',
      'Nguồn năng lượng': 'Điện 48V',
      'Loại pin': 'Ắc quy chì axit',
      'Dung lượng pin': '48V – 420Ah',
      'Năm sản xuất': '2019',
      'Xuất xứ': 'Nhật Bản',
      'Tình trạng': 'Nhật bãi 85%',
      'Giờ hoạt động': '3.250 giờ',
      'Tổng trọng lượng': '2650 kg',
      'Bánh trước': 'Bánh đặc',
      'Bánh sau': 'Bánh đặc',
      'Bán kính quay vòng': '1480 mm',
      'Tốc độ di chuyển': '10.5 km/h'
    }
  }

  if (!productsToSeed.some(p => p.name === toyotaDemo.name)) {
    productsToSeed.push(toyotaDemo as any)
  }

  for (let i = 0; i < productsToSeed.length; i++) {
    const prod = productsToSeed[i] as any
    const slug = toVietnameseSlug(prod.slug || prod.name)
    const priceVal = prod.price ? parseFloat(prod.price) : null
    
    const media = await upsertMedia(prod.image)
    const categoryId = categoryIdMap.get(prod.category) || Array.from(categoryIdMap.values())[0]

    // Determine brand based on product name prefix
    let brandId: string | null = null
    for (const [bName, bId] of brandIdMap.entries()) {
      if (prod.name.toUpperCase().startsWith(bName) || (prod.brand && prod.brand.toUpperCase() === bName.toUpperCase())) {
        brandId = bId
        break
      }
    }

    const dbProduct = await prisma.product.upsert({
      where: { slug },
      update: {
        categoryId,
        brandId,
        thumbnailId: media.id,
        name: prod.name,
        sku: prod.sku || `KN-${(i + 1).toString().padStart(4, '0')}`,
        model: prod.model || null,
        price: priceVal,
        priceLabel: prod.priceLabel || 'Liên hệ',
        badge: prod.badge || null,
        isFeatured: prod.isFeatured ?? (i < 5),
        isBestSeller: prod.isBestSeller ?? false,
        stockStatus: prod.stockStatus || 'IN_STOCK',
        capacity: prod.capacity || null,
        liftHeight: prod.liftHeight || null,
        fuelType: prod.fuelType || null,
        manufactureYear: prod.manufactureYear ? parseInt(prod.manufactureYear.toString()) : null,
        forkLength: prod.forkLength || null,
        condition: prod.condition || null,
        origin: prod.origin || null,
        shortDescription: prod.shortDescription || null,
        description: prod.description || null,
        advantages: prod.advantages || null,
        warrantyPolicy: prod.warrantyPolicy || null,
      },
      create: {
        categoryId,
        brandId,
        thumbnailId: media.id,
        name: prod.name,
        slug,
        sku: prod.sku || `KN-${(i + 1).toString().padStart(4, '0')}`,
        model: prod.model || null,
        price: priceVal,
        priceLabel: prod.priceLabel || 'Liên hệ',
        badge: prod.badge || null,
        isFeatured: prod.isFeatured ?? (i < 5),
        isBestSeller: prod.isBestSeller ?? false,
        stockStatus: prod.stockStatus || 'IN_STOCK',
        capacity: prod.capacity || null,
        liftHeight: prod.liftHeight || null,
        fuelType: prod.fuelType || null,
        manufactureYear: prod.manufactureYear ? parseInt(prod.manufactureYear.toString()) : null,
        forkLength: prod.forkLength || null,
        condition: prod.condition || null,
        origin: prod.origin || null,
        shortDescription: prod.shortDescription || null,
        description: prod.description || null,
        advantages: prod.advantages || null,
        warrantyPolicy: prod.warrantyPolicy || null,
      }
    })
    productIdMap.set(prod.name, dbProduct.id)

    // Seed Specs for this product (idempotent: delete existing first)
    await prisma.productSpec.deleteMany({ where: { productId: dbProduct.id } })
    if (prod.specs) {
      const specLabels = Object.keys(prod.specs)
      for (let sIdx = 0; sIdx < specLabels.length; sIdx++) {
        const label = specLabels[sIdx]
        const value = (prod.specs as any)[label]
        await prisma.productSpec.create({
          data: {
            productId: dbProduct.id,
            label,
            value: value.toString(),
            sortOrder: sIdx
          }
        })
      }
    }

    // Seed Album Images (idempotent: delete existing first)
    await prisma.productImage.deleteMany({ where: { productId: dbProduct.id } })
    if (prod.images && Array.isArray(prod.images)) {
      for (let imgIdx = 0; imgIdx < prod.images.length; imgIdx++) {
        const imgUrl = prod.images[imgIdx]
        const imgMedia = await upsertMedia(imgUrl)
        await prisma.productImage.create({
          data: {
            productId: dbProduct.id,
            mediaId: imgMedia.id,
            sortOrder: imgIdx,
            isPrimary: imgIdx === 0
          }
        })
      }
    }
  }

  // 5.5. Seed Reviews
  console.log('Seeding reviews...')
  await prisma.productReview.deleteMany()
  const demoProduct = await prisma.product.findFirst({
    where: { slug: 'xe-nang-dien-dung-lai-toyota-15-tan-7fb15' }
  })
  if (demoProduct) {
    const reviewsData = [
      {
        name: 'Anh Minh',
        phone: '0901234567',
        rating: 5,
        content: 'Xe vận hành êm, nâng khỏe, kỹ thuật hỗ trợ rất nhanh.',
        status: 'APPROVED' as any,
        approvedAt: new Date()
      },
      {
        name: 'Chị Hương',
        phone: '0912345678',
        rating: 5,
        content: 'Đã nhận xe đúng hẹn, ngoại hình đẹp hơn mong đợi.',
        status: 'APPROVED' as any,
        approvedAt: new Date()
      },
      {
        name: 'Anh Tuấn',
        phone: '0987654321',
        rating: 4,
        content: 'Tư vấn kỹ, giá hợp lý, cần thêm ảnh thực tế trước khi giao.',
        status: 'APPROVED' as any,
        approvedAt: new Date()
      }
    ]

    for (const r of reviewsData) {
      await prisma.productReview.create({
        data: {
          productId: demoProduct.id,
          name: r.name,
          phone: r.phone,
          rating: r.rating,
          content: r.content,
          status: r.status,
          approvedAt: r.approvedAt
        }
      })
    }
  }

  // 6. Seed Services
  console.log('Seeding services...')
  for (let i = 0; i < homeData.services.length; i++) {
    const s = homeData.services[i] as any
    const slug = toVietnameseSlug(s.slug || s.title)
    
    // Find matching admin service details
    const adminS = adminData.adminServices.find(as => as.title === s.title)
    let imageId: string | null = null
    if (adminS?.image) {
      const media = await upsertMedia(adminS.image)
      imageId = media.id
    }

    await prisma.service.upsert({
      where: { slug },
      update: { title: s.title },
      create: {
        title: s.title,
        slug,
        description: s.description || s.subtitle || '',
        imageId,
        status: 'PUBLISHED',
        sortOrder: i,
        benefits: [
          'Tiết kiệm chi phí đầu tư ban đầu',
          'Linh hoạt thay đổi theo nhu cầu',
          'Bảo trì, sửa chữa miễn phí'
        ],
        process: [
          'Khảo sát nhu cầu',
          'Báo giá chi tiết',
          'Ký hợp đồng',
          'Giao xe & hỗ trợ'
        ],
        ctaTitle: 'Liên hệ ngay để được tư vấn',
        ctaButtonText: 'Gọi ngay',
        ctaButtonHref: 'tel:0901234567'
      }
    })
  }

  // 7. Seed Testimonials
  console.log('Seeding testimonials...')
  await prisma.testimonial.deleteMany()
  for (let i = 0; i < homeData.testimonials.length; i++) {
    const t = homeData.testimonials[i] as any
    let imageId: string | null = null
    if (t.image) {
      const media = await upsertMedia(t.image)
      imageId = media.id
    }

    await prisma.testimonial.create({
      data: {
        name: t.name,
        location: t.location || null,
        quote: t.quote || t.content || '',
        imageId,
        rating: t.rating || 5,
        isVisible: true,
        sortOrder: i
      }
    })
  }

  // 8. Seed Post Categories & Posts
  console.log('Seeding posts...')
  const postCategories = ['Tin tức xe nâng', 'Hướng dẫn', 'Thị trường']
  const postCatMap = new Map<string, string>()
  for (let i = 0; i < postCategories.length; i++) {
    const name = postCategories[i]
    const slug = toVietnameseSlug(name)
    const dbCat = await prisma.postCategory.upsert({
      where: { slug },
      update: { name },
      create: {
        name,
        slug,
        isVisible: true,
        sortOrder: i
      }
    })
    postCatMap.set(name, dbCat.id)
  }

  const postsToSeed = [...homeData.latestPosts]
  for (const adminPost of adminData.adminPosts) {
    if (!postsToSeed.some(p => p.title === adminPost.title)) {
      postsToSeed.push({
        id: adminPost.id,
        title: adminPost.title,
        excerpt: '',
        date: adminPost.publishedAt,
        category: adminPost.category,
        image: adminPost.image,
        slug: toVietnameseSlug(adminPost.title)
      } as any)
    }
  }

  for (let i = 0; i < postsToSeed.length; i++) {
    const p = postsToSeed[i] as any
    const slug = toVietnameseSlug(p.slug || p.title)
    const media = await upsertMedia(p.image)
    const categoryId = postCatMap.get(p.category) || Array.from(postCatMap.values())[0]

    await prisma.post.upsert({
      where: { slug },
      update: { title: p.title },
      create: {
        categoryId,
        authorId: adminId,
        title: p.title,
        slug,
        excerpt: p.excerpt || 'Excerpt for ' + p.title,
        content: `Nội dung chi tiết cho bài viết ${p.title}. Xe nâng hàng là thiết bị quan trọng giúp tối ưu hóa kho bãi.`,
        thumbnailId: media.id,
        status: 'PUBLISHED',
        publishedAt: new Date(),
        isFeatured: i === 0
      }
    })
  }

  // 9. Seed Contacts
  console.log('Seeding contacts...')
  await prisma.contact.deleteMany()
  for (const c of adminData.adminContacts) {
    await prisma.contact.create({
      data: {
        name: c.name,
        phone: c.phone,
        email: c.email,
        company: c.company,
        need: c.need,
        message: 'Tôi quan tâm đến dịch vụ xe nâng.',
        status: (c.status === 'contacted' ? 'CALLED' : c.status.toUpperCase()) as any,
        internalNote: c.note,
        assignedToId: adminId
      }
    })
  }

  // 10. Seed Quote Requests
  console.log('Seeding quote requests...')
  await prisma.quoteRequest.deleteMany()
  for (const q of adminData.adminQuoteRequests) {
    // Find matching product id
    let productId: string | null = null
    for (const [pName, pId] of productIdMap.entries()) {
      if (q.product.includes(pName)) {
        productId = pId
        break
      }
    }

    await prisma.quoteRequest.create({
      data: {
        code: q.code,
        name: q.name,
        phone: q.phone,
        email: q.email,
        company: q.company,
        productId,
        productName: q.product,
        quantity: q.quantity,
        budget: q.budget,
        message: 'Vui lòng báo giá sớm.',
        status: q.status.toUpperCase() as any,
        internalNote: q.note,
        assignedToId: adminId
      }
    })
  }

  // 11. Seed Orders
  console.log('Seeding orders...')
  await prisma.order.deleteMany()
  for (const o of adminData.adminOrders) {
    const order = await prisma.order.create({
      data: {
        code: o.code,
        customerName: o.customerName,
        company: o.company,
        phone: o.phone,
        email: o.email,
        address: o.address,
        totalAmount: o.totalAmount,
        depositAmount: o.depositAmount,
        remainingAmount: o.remainingAmount,
        orderStatus: o.orderStatus.toUpperCase() as any,
        paymentStatus: o.paymentStatus.toUpperCase() as any,
        source: o.source.toUpperCase() as any,
        deliveryMethod: o.deliveryMethod.toUpperCase() as any,
        assignedToId: adminId,
        note: o.note,
        internalNote: o.internalNote
      }
    })

    // Seed Order Items
    for (const item of o.items) {
      let productId: string | null = null
      for (const [pName, pId] of productIdMap.entries()) {
        if (item.productName.includes(pName)) {
          productId = pId
          break
        }
      }

      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId,
          productName: item.productName,
          model: item.model,
          sku: item.sku,
          imageUrl: item.image,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice
        }
      })
    }

    // Seed Timeline Events
    await prisma.orderTimelineEvent.create({
      data: {
        orderId: order.id,
        type: 'create',
        title: 'Đơn hàng được khởi tạo',
        description: `Đơn hàng ${o.code} được tạo thành công trên hệ thống.`,
        createdById: adminId
      }
    })

    if (o.depositAmount > 0) {
      await prisma.orderTimelineEvent.create({
        data: {
          orderId: order.id,
          type: 'payment',
          title: 'Khách hàng thanh toán tiền đặt cọc',
          description: `Đã nhận số tiền đặt cọc ${new Intl.NumberFormat('vi-VN').format(o.depositAmount)}đ.`,
          createdById: adminId
        }
      })
    }
  }

  // 12. Seed Menus
  console.log('Seeding menus...')
  const menus = [
    { name: 'Header Menu', slug: 'header-menu', location: 'HEADER', items: defaultHeaderMenu },
    { name: 'Footer Menu', slug: 'footer-menu', location: 'FOOTER', items: defaultFooterMenu },
    { name: 'Mobile Menu', slug: 'mobile-menu', location: 'MOBILE', items: defaultMobileMenu },
  ]
  async function seedMenuItems(menuId: string, items: DefaultMenuItem[], parentId: string | null = null) {
    for (let index = 0; index < items.length; index++) {
      const item = items[index]
      const created = await prisma.menuItem.create({
        data: { menuId, parentId, label: item.label, url: item.url, type: 'INTERNAL', sortOrder: index },
      })
      if (item.children?.length) await seedMenuItems(menuId, item.children, created.id)
    }
  }
  for (const definition of menus) {
    const menu = await prisma.menu.upsert({
      where: { slug: definition.slug },
      update: {},
      create: { name: definition.name, slug: definition.slug, location: definition.location as any },
    })
    if (await prisma.menuItem.count({ where: { menuId: menu.id } }) === 0) {
      await seedMenuItems(menu.id, definition.items)
    }
  }

  console.log('Seeding finished successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
