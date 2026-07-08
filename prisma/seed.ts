import { PrismaClient } from '@prisma/client'
import { hashPassword } from 'better-auth/crypto'
import * as homeData from '../data/home'
import * as adminData from '../data/admin'

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
  const settingsKeys = Object.keys(homeData.siteConfig)
  for (const key of settingsKeys) {
    const val = (homeData.siteConfig as any)[key]
    let type = 'text'
    if (key === 'logo') type = 'image'
    else if (key.endsWith('Url')) type = 'url'
    else if (key === 'footerDescription') type = 'textarea'

    await prisma.setting.upsert({
      where: { key },
      update: { value: val.toString() },
      create: {
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
        value: val.toString(),
        type,
        group: 'general'
      }
    })
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
    const slug = name.toLowerCase()
    
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

  for (let i = 0; i < productsToSeed.length; i++) {
    const prod = productsToSeed[i] as any
    const slug = prod.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const priceVal = prod.price ? parseFloat(prod.price) : null
    
    const media = await upsertMedia(prod.image)
    const categoryId = categoryIdMap.get(prod.category) || Array.from(categoryIdMap.values())[0]

    // Determine brand based on product name prefix
    let brandId: string | null = null
    for (const [bName, bId] of brandIdMap.entries()) {
      if (prod.name.toUpperCase().startsWith(bName)) {
        brandId = bId
        break
      }
    }

    const dbProduct = await prisma.product.upsert({
      where: { slug },
      update: {
        price: priceVal,
        priceLabel: prod.priceLabel,
      },
      create: {
        categoryId,
        brandId,
        thumbnailId: media.id,
        name: prod.name,
        slug,
        sku: `KN-${(i + 1).toString().padStart(4, '0')}`,
        model: prod.model,
        price: priceVal,
        priceLabel: prod.priceLabel,
        isFeatured: i < 5,
        status: 'PUBLISHED',
        stockStatus: 'IN_STOCK'
      }
    })
    productIdMap.set(prod.name, dbProduct.id)

    // Seed Specs for this product
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

  // 6. Seed Services
  console.log('Seeding services...')
  for (let i = 0; i < homeData.services.length; i++) {
    const s = homeData.services[i] as any
    const slug = s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    
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
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
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
        slug: adminPost.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      } as any)
    }
  }

  for (let i = 0; i < postsToSeed.length; i++) {
    const p = postsToSeed[i] as any
    const slug = p.slug || p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
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
  for (let i = 0; i < homeData.navigation.length; i++) {
    const nav = homeData.navigation[i]
    await prisma.menu.create({
      data: {
        label: nav.label,
        href: nav.href,
        group: 'header',
        sortOrder: i,
        isVisible: true
      }
    })
  }

  for (let gIdx = 0; gIdx < homeData.footerGroups.length; gIdx++) {
    const group = homeData.footerGroups[gIdx]
    for (let lIdx = 0; lIdx < group.links.length; lIdx++) {
      const link = group.links[lIdx]
      await prisma.menu.create({
        data: {
          label: link.label,
          href: link.href,
          group: `footer-${gIdx + 1}`,
          sortOrder: lIdx,
          isVisible: true
        }
      })
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
