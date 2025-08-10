# チャットボットアプリケーション

Next.js + Auth0認証とAzure OpenAIを使用したチャットボットアプリケーションです。

## 🚀 機能

- **NextAuth + Auth0**: セキュアな認証システム
- **Azure OpenAIチャットボット**: 高性能な会話AI
- **リアルタイムチャットUI**: モダンなチャットインターフェース
- **MySQLセッション管理**: ユーザーセッション管理
- **CosmosDB会話履歴**: スケーラブルなデータ保存
- **TypeScript**: 型安全性を提供
- **TailwindCSS**: モダンなUIデザイン

## 📁 プロジェクト構成

```
chatbot-app/
├── src/                           # Next.js フロントエンド
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/ # NextAuth.js APIルート
│   │   │   └── chat/send/         # チャットAPIルート
│   │   ├── chat/                  # チャットページ
│   │   ├── dashboard/             # ダッシュボードページ
│   │   ├── login/                 # ログインページ
│   │   └── page.tsx               # ホームページ
│   ├── components/
│   │   ├── AuthGuard.tsx          # 認証保護コンポーネント
│   │   └── AuthProvider.tsx       # セッションプロバイダー
│   ├── lib/
│   │   └── auth.ts                # NextAuth設定
│   └── types/
│       └── next-auth.d.ts         # NextAuth型拡張
└── fastapi-chatbot/               # FastAPI バックエンド
    ├── config/
    │   └── settings.py            # 環境設定
    ├── models/
    │   └── chat_models.py         # データモデル
    ├── routes/
    │   └── chat_routes.py         # APIルート
    ├── services/
    │   ├── azure_openai_service.py # Azure OpenAI統合
    │   ├── mysql_service.py       # MySQLサービス
    │   └── cosmosdb_service.py    # CosmosDBサービス
    └── main.py                    # FastAPIメインサーバー
```

## 🛠️ セットアップ

### 1. Next.js フロントエンド

#### 依存関係のインストール
```bash
npm install
```

#### 環境変数の設定
`.env.example`を`.env`にコピーし、以下を設定：

```bash
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Auth0
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_ISSUER=https://your-domain.auth0.com
AUTH0_SECRET=your-auth0-secret

# FastAPI URL
FASTAPI_URL=http://localhost:8000
```

#### 開発サーバー起動
```bash
npm run dev
```

### 2. FastAPI バックエンド

#### ディレクトリ移動
```bash
cd fastapi-chatbot
```

#### 依存関係のインストール
```bash
pip install -r requirements.txt
```

#### 環境変数の設定
`.env.example`を`.env`にコピーし、必要な値を設定：

```bash
# Azure OpenAI
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_DEPLOYMENT_NAME=your-deployment-name

# MySQL
MYSQL_HOST=localhost
MYSQL_USER=your-username
MYSQL_PASSWORD=your-password
MYSQL_DATABASE=chatbot_db

# CosmosDB
COSMOSDB_ENDPOINT=https://your-account.documents.azure.com:443/
COSMOSDB_KEY=your-cosmos-key
```

#### サーバー起動
```bash
python main.py
```

## 📱 使用方法

1. **アクセス**: http://localhost:3000 にアクセス
2. **ログイン**: Auth0でログイン
3. **チャット開始**: 「チャットボット」ボタンをクリック
4. **会話**: チャット画面でメッセージを入力して会話開始

## 🔧 API エンドポイント

### Next.js API Routes
- `POST /api/chat/send` - チャットメッセージ送信（FastAPIへプロキシ）

### FastAPI Endpoints
- `POST /chat` - チャットメッセージ処理
- `GET /health` - ヘルスチェック
- `GET /docs` - Swagger UI
- `GET /chat/sessions/{user_email}` - ユーザーセッション取得
- `GET /chat/history/{user_email}` - 会話履歴取得

## 🗄️ データベース構造

### MySQL (セッション管理)
```sql
CREATE TABLE chat_sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_email VARCHAR(255) NOT NULL,
  session_id VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### CosmosDB (会話履歴)
```json
{
  "id": "unique_id",
  "session_id": "session_uuid",
  "user_email": "user@example.com",
  "message": "ユーザーメッセージ",
  "response": "AIレスポンス",
  "timestamp": "2025-01-01T00:00:00Z"
}
```

## 🔧 トラブルシューティング

### 認証エラー
- `.env`ファイルの`AUTH0_SECRET`が設定されているか確認
- Auth0の設定が正しいか確認

### チャットボット接続エラー
- FastAPIサーバーが起動しているか確認 (http://localhost:8000)
- Azure OpenAIの設定が正しいか確認

### データベース接続エラー
- MySQL・CosmosDBの接続情報が正しいか確認
- データベースサービスが起動しているか確認

## 🎯 主要ファイル

### フロントエンド
- `src/app/chat/page.tsx` - チャットページUI
- `src/app/api/chat/send/route.ts` - Next.js APIルート

### バックエンド
- `fastapi-chatbot/main.py` - FastAPIメインサーバー
- `fastapi-chatbot/services/azure_openai_service.py` - Azure OpenAI統合
- `fastapi-chatbot/services/mysql_service.py` - MySQL統合
- `fastapi-chatbot/services/cosmosdb_service.py` - CosmosDB統合

## 🏗️ 開発メモ

このチャットボットアプリケーションは以下の技術スタックで構築されています：

- **フロントエンド**: Next.js 15.3.4, TypeScript, TailwindCSS
- **認証**: NextAuth.js + Auth0
- **バックエンド**: FastAPI (Python)
- **AI**: Azure OpenAI
- **データベース**: MySQL (リレーショナル) + CosmosDB (NoSQL)
- **HTTP通信**: Axios

認証が必要なチャット機能により、セキュアな環境でAIとの対話が可能です。