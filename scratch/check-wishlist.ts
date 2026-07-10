import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const wishlists = await prisma.customerWishlist.findMany({
    include: {
      user: {
        select: { id: true, name: true, email: true }
      },
      product: {
        select: { id: true, name: true }
      }
    }
  })
  console.log('CustomerWishlist records:', JSON.stringify(wishlists, null, 2))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
