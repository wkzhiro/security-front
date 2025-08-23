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
    const fastApiUrl = process.env.FASTAPI_URL || "http://127.0.0.1:8000";

    // 送信するデータをログに出力（デバッグ用）
    const requestData = {
      message,
      user_email: userEmail || session.user?.email,
    };
    console.log("Sending request to FastAPI:", {
      url: `${fastApiUrl}/chat`,
      data: requestData
    });

    // FastAPIサーバーにリクエストを送信
    // 開発環境での自己証明書を許可する設定
    const response = await axios.post(`${fastApiUrl}/chat`, {
      message,
      user_email: userEmail || session.user?.email,
    }, {
      timeout: 30000, // 30秒のタイムアウト
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.accessToken}`,
      },
      // NODE_TLS_REJECT_UNAUTHORIZED環境変数で制御
      ...(process.env.NODE_TLS_REJECT_UNAUTHORIZED && {
        httpsAgent: new (await import('https')).Agent({
          rejectUnauthorized: false
        })
      })
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
        // 422エラーの場合、詳細なエラー情報をログに出力
        if (error.response.status === 422) {
          console.error("Validation error details:", error.response.data);
        }
        
        return NextResponse.json(
          { 
            error: "チャットボットサーバーでエラーが発生しました。",
            details: error.response.data?.detail || error.response.data || "Unknown error"
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