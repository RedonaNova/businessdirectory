import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { LoginSchema } from '@businessdirectory/database';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

interface LoginResponse {
  user: {
    id: number;
    email: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  token: string;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // Validate credentials with zod
          const validatedCredentials = LoginSchema.parse({
            email: credentials?.email,
            password: credentials?.password,
          });

          // Call your API to authenticate
          const response = await fetch(`${baseUrl}/users/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(validatedCredentials),
          });

          const result: ApiResponse<LoginResponse> = await response.json();

          if (!response.ok || !result.success || !result.data) {
            return null;
          }

          // Return user object that will be stored in session
          return {
            id: result.data.user.id.toString(),
            email: result.data.user.email,
            name: result.data.user.firstName
              ? `${result.data.user.firstName} ${
                  result.data.user.lastName || ''
                }`.trim()
              : result.data.user.email,
            role: result.data.user.role,
            token: result.data.token, // Store token for API calls
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/signin',
    signOut: '/signin',
  },
  secret: process.env.AUTH_SECRET,
});
