import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import prisma from "./prisma"
import { headers } from "next/headers"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "STAFF",
      },
    },
  },
})

export async function getServerSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  return session
}
