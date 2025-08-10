// Type definitions for NextAuth.js

declare module "next-auth" {
  interface Session {
    accessToken?: string
    expiresAt?: number
    user?: {
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string | null
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    expiresAt?: number
    role?: string
  }
}
