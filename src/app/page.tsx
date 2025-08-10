"use client"

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Auth Sample App</h1>
          <div className="space-x-4">
            {session ? (
              <>
                <Link
                  href="/chat"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200"
                >
                  チャットボット
                </Link>
                <Link
                  href="/dashboard"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
                >
                  ダッシュボード
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
              >
                ログイン
              </Link>
            )}
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-12 px-4">
        <div className="text-center">
          <Image
            className="mx-auto mb-8"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            NextAuth + Auth0 認証サンプル
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            このページは認証情報を必要としないパブリックページです。
          </p>
          
          {session ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              <p>ログイン済み: {session.user?.email}</p>
              <Link
                href="/dashboard"
                className="inline-block mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200"
              >
                ダッシュボードへ
              </Link>
            </div>
          ) : (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
              <p>認証されていません</p>
              <Link
                href="/login"
                className="inline-block mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
              >
                ログインページへ
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-3">パブリックページ</h3>
              <p className="text-gray-600">このページは誰でもアクセス可能です。認証は不要です。</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-3">チャットボット</h3>
              <p className="text-gray-600">
                Azure OpenAIを使用したチャットボットです。認証済みユーザーのみ利用可能で、会話履歴はMySQLとCosmosDBに保存されます。
              </p>
              {session && (
                <Link
                  href="/chat"
                  className="inline-block mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200"
                >
                  チャットを開始
                </Link>
              )}
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-3">プロテクトページ</h3>
              <p className="text-gray-600">
                ダッシュボードページは認証が必要です。Auth0のユニバーサルログインを使用します。
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
