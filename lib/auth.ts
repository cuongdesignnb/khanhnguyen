import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import prisma from "./prisma"
import { headers } from "next/headers"

const authBaseUrl = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_SITE_URL
const trustedOrigins = [
  authBaseUrl,
  process.env.NEXT_PUBLIC_SITE_URL,
  "http://localhost:4317",
  "http://127.0.0.1:4317",
].filter((origin): origin is string => Boolean(origin))

export const auth = betterAuth({
  baseURL: authBaseUrl,
  trustedOrigins,
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
        defaultValue: "CUSTOMER",
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
