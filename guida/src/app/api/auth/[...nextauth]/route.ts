import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/db";
import bcrypt from 'bcryptjs'

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.log('Authorize log - ATTEMPT AUTHORISATION')
                if (credentials?.username || credentials?.password) {

                    const username = credentials.username as string;
                    const password = credentials.password as string;

                    const user = await prisma.user.findFirst({
                        where: {username: username}
                    })

                    if (!user || !user.password) {
                        console.log('Authorize log - USER OR PASSWORD DOES NOT EXIST. RETURN NULL')
                        return null;
                    }

                    const passwordsMatch = await bcrypt.compare(password, user.password)

                    if (passwordsMatch) {
                        console.log('Authorize log - VALID USER AND PASSWORD. RETURN USER')
                        return {
                            id: String(user.id),
                            name: user.name,
                            username: user.username,
                            email: user.email
                        };
                    }
                }

                console.log('Authorize log - CREDENTIALS INVALID. RETURN NULL')
                return null;
            }
        })],
})

export { handler as GET, handler as POST }