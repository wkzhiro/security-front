import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import axios from "axios";
import type { Session } from "next-auth";

export async function POST(request: NextRequest) {
  try {
    // 認証チェック
    const session = await getServerSession(authOptions) as Session | null;
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    const { message, userEmail } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "メッセージが必要です" },
        { status: 400 }
      );
    }

    // FastAPIサーバーのURL（環境変数から取得、デフォルトはlocalhost）
    const fastApiUrl = process.env.FASTAPI_URL || "http://localhost:8000";

    // FastAPIサーバーにリクエストを送信
    const response = await axios.post(`${fastApiUrl}/chat`, {
      message,
      user_email: userEmail || session.user?.email,
    }, {
      timeout: 30000, // 30秒のタイムアウト
      headers: {
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json({
      response: response.data.response,
      success: true,
    });

  } catch (error) {
    console.error("Chat API error:", error);
    
    if (axios.isAxiosError(error)) {
      if (error.code === "ECONNREFUSED") {
        return NextResponse.json(
          { 
            error: "チャットボットサーバーに接続できません。しばらくしてから再試行してください。",
            details: "FastAPIサーバーが起動していない可能性があります。"
          },
          { status: 503 }
        );
      }
      
      if (error.response?.status) {
        return NextResponse.json(
          { 
            error: "チャットボットサーバーでエラーが発生しました。",
            details: error.response.data?.detail || "Unknown error"
          },
          { status: error.response.status }
        );
      }
    }

    return NextResponse.json(
      { 
        error: "予期しないエラーが発生しました。",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}