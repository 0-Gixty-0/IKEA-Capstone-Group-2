// types/next-auth.d.ts
import NextAuth from "next-auth";
import {UserRole} from "@/types/index";
import { JWT } from "next-auth/jwt"

/**
 * The following two declarations are required to define session and user types
 * in authentication
 */
declare module "next-auth" {
    interface User {
        id: string;
        name: string | null;
        username: string;
        email: string;
        roles: UserRole[];
    }

    interface Session {
        user: User;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        roles: UserRole[];
    }
}
