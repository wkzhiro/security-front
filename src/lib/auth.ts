import Auth0Provider from "next-auth/providers/auth0"

export const authOptions = {
    providers: [
        Auth0Provider({
            clientId: process.env.AUTH0_CLIENT_ID!,
            clientSecret: process.env.AUTH0_CLIENT_SECRET!,
            issuer: process.env.AUTH0_ISSUER!,
            authorization: {
                params: {
                    scope: "openid email profile"
                }
            }
        }),
    ],
    debug: true,
    callbacks: {
        async jwt({ token, account, profile }: { token: Record<string, unknown>; account: Record<string, unknown> | null; profile?: Record<string, unknown> }) {
            if (account) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.expiresAt = account.expires_at;
            }

            if (profile) {
                token.name = profile.name;
                // Auth0 Actionsで追加したカスタムクレームからロールを取得
                const roles = profile["https://sample-app.com/roles"] as string[];
                if (roles && roles.includes('admin')) {
                    token.role = 'admin';
                }
            }
            
            if (token.expiresAt && Date.now() / 1000 > (token.expiresAt as number)) {
                console.warn("Access token has expired");
                return {};
            }
            
            return token;
        },
        async session({ session, token }: { session: Record<string, unknown>; token: Record<string, unknown> }) {
            if (token?.accessToken) {
                session.accessToken = token.accessToken as string;
            }
            if (token?.expiresAt) {
                session.expiresAt = token.expiresAt as number;
            }
            if (token?.role) {
                session.user.role = token.role as string;
            }
            if (token?.name) {
                session.user.name = token.name as string;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt" as const,
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login',
    },
};