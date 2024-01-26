const url = process.env.SITE
export const authConfig = {
    pages: {
        signIn: '/login',
    },
    secret: process.env.JWT_SECRET,
    session: {
        strategy: "jwt",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/preventivi');
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                return Response.redirect(new URL('/preventivi', nextUrl));
            }
            return true;
        },
        async jwt({ token, user }) {
            return { ...token, ...user };
        },

        async session({ session, token }) {
            const response = await fetch(
                `${url}/api/profilo/${token.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const userData = await response.json();
            userData[0].options = JSON.parse(userData[0].options);
            userData[0].accessToken = token.accessToken;

            // Assign updated user data to session.user
            session.user = { ...session.user, ...userData[0] };

            return session;
        },
        redirect: async (url, baseUrl) => {
            return Promise.resolve('/preventivi')
        }
    },
    providers: [], // Add providers with an empty array for now
}