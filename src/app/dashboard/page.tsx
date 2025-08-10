"use client"

import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { AuthGuard } from "@/components/AuthGuard"

function DashboardContent() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-200"
            >
              ホームに戻る
            </Link>
            <h1 className="text-xl font-bold">ダッシュボード</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">こんにちは、{session?.user?.name || session?.user?.email}</span>
            {(session?.user as { role?: string })?.role === 'admin' && (
              <Link
                href="/admin"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
              >
                管理者ページへ
              </Link>
            )}
            <button
              onClick={() => signOut()}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200"
            >
              ログアウト
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">認証が必要なページ</h2>
          <p className="text-gray-600 mb-4">このページは認証されたユーザーのみアクセスできます。</p>
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-semibold mb-2">ユーザー情報:</h3>
            <p><strong>名前:</strong> {session?.user?.name || "N/A"}</p>
            <p><strong>メール:</strong> {session?.user?.email || "N/A"}</p>
            <p><strong>画像:</strong> {session?.user?.image && <Image src={session.user.image} alt="User" width={32} height={32} className="w-8 h-8 rounded-full inline ml-2" />}</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}