import NextAuth, { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/db";
import bcrypt from "bcryptjs";
import { UserRole } from "@/types";
import { User } from "next-auth";

function isUserRole(value: string): value is UserRole {
  // @ts-expect-error
  return Object.values(UserRole).includes(value);
}

/**
 * Next-auth configuration
 * * Session strategy of jwt token
 * * Uses credentials provider defined with username and password
 * * Authorize method constructs user assigned to session in callback
 * * Token callback assign id and roles to token
 * * Session callback assigns user id and user roles from token
 */
export const authConfig = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Authorize log - ATTEMPT AUTHORISATION");
        if (credentials?.username || credentials?.password) {
          const username = credentials.username as string;
          const password = credentials.password as string;

          const user = await prisma.user.findFirst({
            where: { username: username },
            include: {
              roles: true,
            },
          });
          console.log(user);

          if (!user || !user.password) {
            console.log(
              "Authorize log - USER OR PASSWORD DOES NOT EXIST. RETURN NULL",
            );
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            console.log("Authorize log - VALID USER AND PASSWORD. RETURN USER");
            const userRoles: UserRole[] = [];
            user.roles.forEach((role) => {
              if (isUserRole(role.name)) {
                userRoles.push(role.name);
              }
            });
            return {
              id: user.id.toString(),
              name: user.name,
              username: user.username,
              email: user.email,
              roles: userRoles,
              profilePicture: user.profilePicture || "",
            };
          }
        }

        console.log("Authorize log - CREDENTIALS INVALID. RETURN NULL");
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = <string>user.id;
        token.name = user.name;
        token.username = user.username;
        token.email = user.email;
        token.roles = user.roles; // Store user role in the JWT token
        token.profilePicture = user.profilePicture;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.username = token.username;
      session.user.email = token.email ? token.email : "";
      session.user.roles = token.roles; // Attach user role to session
      session.user.profilePicture = token.profilePicture;

      return session;
    },
  },
} satisfies NextAuthConfig;

/**
 * Next-auth returns hooks globally available
 */
export const { auth, handlers, signIn, signOut } = NextAuth(authConfig);
