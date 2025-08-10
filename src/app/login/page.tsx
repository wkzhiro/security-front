"use client"

import { signIn, useSession } from "next-auth/react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push("/dashboard")
    }
  }, [session, router])

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (session) {
    return null
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="text-center mb-6">
          <Link
            href="/"
            className="inline-block bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-200 mb-4"
          >
            ホームに戻る
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-center mb-6">ログイン</h1>
        <button
          onClick={() => {
            console.log("Login button clicked");
            signIn("auth0", { callbackUrl: "/dashboard" });
          }}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
        >
          Auth0でログイン
        </button>
        <div className="mt-4 text-sm text-gray-600 text-center">
          <p>デバッグ情報:</p>
          <p>Status: {status}</p>
          <p>Session: {session ? "あり" : "なし"}</p>
        </div>
      </div>
    </div>
  )
}