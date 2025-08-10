"use client"

import { getProviders } from "next-auth/react"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function TestPage() {
  const [providers, setProviders] = useState<Record<string, unknown> | null>(null)
  const [envVars, setEnvVars] = useState<Record<string, string>>({})

  useEffect(() => {
    const loadProviders = async () => {
      const providers = await getProviders()
      setProviders(providers)
    }
    loadProviders()

    // Check if environment variables are accessible
    setEnvVars({
      AUTH0_CLIENT_ID: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || "Not set",
      AUTH0_ISSUER: process.env.NEXT_PUBLIC_AUTH0_ISSUER || "Not set",
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "Not set"
    })
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">NextAuth テストページ</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">認証プロバイダー:</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(providers, null, 2)}
        </pre>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">環境変数:</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(envVars, null, 2)}
        </pre>
      </div>

      <div className="space-y-2">
        <Link href="/api/auth/providers" className="block text-blue-600 hover:underline">
          /api/auth/providers を確認
        </Link>
        <Link href="/api/auth/signin" className="block text-blue-600 hover:underline">
          /api/auth/signin を確認
        </Link>
      </div>
    </div>
  )
}