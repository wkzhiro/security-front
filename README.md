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
src/
├── app/
│   ├── api/auth/[...nextauth]/     # NextAuth.js APIルート
│   ├── admin/                      # 管理者専用ページ
│   ├── dashboard/                  # 認証が必要なページ
│   ├── login/                      # ログインページ
│   ├── layout.tsx                  # ルートレイアウト
│   └── page.tsx                    # ホームページ（パブリック）
├── components/
│   ├── AuthGuard.tsx              # 認証保護コンポーネント
│   ├── AuthProvider.tsx           # セッションプロバイダー
│   └── RoleGuard.tsx              # ロール保護コンポーネント
├── lib/
│   └── auth.ts                     # NextAuth設定
└── types/
    └── next-auth.d.ts             # NextAuth型拡張
```

## 🛠️ セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Auth0アプリケーションの設定

1. [Auth0ダッシュボード](https://manage.auth0.com/)にログイン
2. 新しいアプリケーションを作成（**Single Page Application**）
3. **Settings** タブで以下のURLを設定：
   - **Allowed Callback URLs:** `http://localhost:3000/api/auth/callback/auth0`
   - **Allowed Logout URLs:** `http://localhost:3000`
   - **Allowed Web Origins:** `http://localhost:3000`

### 3. Auth0でロールを作成し、ユーザーに割り当てる

1. 左メニューの **User Management > Roles** に移動し、`admin` という名前のロールを作成します。
2. 左メニューの **User Management > Users** に移動し、管理者にしたいユーザーを選択します。
3. **Roles** タブを開き、先ほど作成した `admin` ロールを割り当てます。

### 4. Auth0 Actionsでロール情報をトークンに追加【重要】

ユーザーにロールを割り当てるだけでは、その情報はNext.jsに送られません。**Actions**を使って、ログイン時にロール情報をトークンに含める必要があります。

1.  左メニューの **Actions > Library** に移動し、**Build Custom** をクリックします。
2.  以下の通り設定し、**Create** をクリックします。
    -   **Name:** `Add Role to Token`
    -   **Trigger:** **Login / Post Login**
    -   **Runtime:** **Node 18**
3.  エディタが開いたら、中身をすべて以下のコードに置き換えます。

    ```javascript
    exports.onExecutePostLogin = async (event, api) => {
      const namespace = "https://sample-app.com/";
      if (event.authorization) {
        const roles = event.authorization.roles;
        api.idToken.setCustomClaim(namespace + "roles", roles);
        api.accessToken.setCustomClaim(namespace + "roles", roles);
      }
    };
    ```

4.  **Deploy** をクリックして保存します。
5.  左メニューの **Actions > Flows** に移動し、**Login** フローを選択します。
6.  **Custom** タブから先ほど作成した `Add Role to Token` を、フロー図の中央（StartとCompleteの間）にドラッグ＆ドロップします。
7.  **Apply** をクリックしてフローを有効化します。

### 5. 環境変数の設定

プロジェクトのルートに `.env.local` ファイルを作成し、以下の変数を設定してください。

```bash
# NextAuth設定
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here

# Auth0設定
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret
AUTH0_ISSUER=https://your-auth0-domain.auth0.com
```

### 6. 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) をブラウザで開いてください。

## 📋 ページ構成

- **ホームページ (/)**: 認証不要のトップページ。
- **ログインページ (/login)**: ログインボタンを押すとAuth0のログインページに遷移します。
- **ダッシュボード (/dashboard)**: 認証済みユーザーがアクセスできるページ。ユーザー名が表示され、管理者であれば管理者ページへのリンクが表示されます。
- **管理者ページ (/admin)**: `admin` ロールを持つユーザーのみがアクセスできるページ。

## 🔒 認証・認可フロー

1. **ログイン**: 未認証ユーザーがログインを試みると、Auth0のログインページにリダイレクトされます。
2. **認証完了**: 認証に成功すると、`/dashboard` にリダイレクトされます。
3. **トークン取得**: ログイン時、Auth0 Actionsが実行され、IDトークンにロール情報が付与されます。
4. **セッション作成**: NextAuthの `jwt` コールバックがトークンを検証し、ロール情報を含むセッションを確立します。
5. **ページ保護**: 
   - `AuthGuard` は、未認証ユーザーが `/dashboard` などの保護されたページにアクセスするのを防ぎます。
   - `RoleGuard` は、`admin` ロールを持たないユーザーが `/admin` ページにアクセスするのを防ぎます。
