import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

declare module 'next-auth' {
  interface User {
    id: string;
    username: string;
    email: string;
    role: string;
  }

  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    username: string;
    email: string;
    role: string;
  }
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error('Username and password required');
        }

        try {
          console.log('Authenticating user:', credentials.username);
          console.log('Authenticating password:', credentials.password);
          // Use the API route to authenticate
          const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          });

          // Check if the response is OK first
          if (!response.ok) {
            const error = await response.json();
            console.error('Auth failed:', error);
            throw new Error(error.message || 'Authentication failed');
          }

          // Only parse the response once
          const user = await response.json();
          console.log('Authentication successful for:', credentials.username);
          return user;
        } catch (error) {
          console.error('Auth error:', error);
          throw new Error(error instanceof Error ? error.message : 'Authentication failed');
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.email = token.email;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  jwt: {
    // Increase security for JWTs
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 24 * 60 * 60,
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

export { authOptions };
