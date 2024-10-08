import { NextAuthConfig } from "next-auth";

/**
 * NextAuthConfig required for callback methods due to pg unable to run in Edge environment
 */
export default {
    providers: [],
} satisfies NextAuthConfig