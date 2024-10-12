import { NextResponse } from "next/server";
import authConfig from "@/auth.config";
import NextAuth from "next-auth";

const { auth } = NextAuth(authConfig)

import {
    DEFAULT_LOGIN_REDIRECT,
    apiAuthPrefix,
    authRoutes,
    publicRoutes
} from "@/routes"

/**
 * Authentication method provided through next-auth package.
 * Handles routing requests according to constants and login status
 */
export default auth((req) => {
    console.log('Middleware log - REQUESTED PATH: ', req.url)
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    // Always accept API routes for authentication purposes
    if (isApiAuthRoute) {
        console.log('Middleware log - ALLOWED ACCESS TO PATH: ', req.url)
        return NextResponse.next();
    }

    // Always accept page routes for authentication purposes
    // For example /login. However, if logged in redirect to default route
    if(isAuthRoute) {
        if(isLoggedIn) {
            console.log('Middleware log - DENIED ACCESS TO PATH: ', req.url)
            console.log("Middleware log - REDIRECTED TO: ", DEFAULT_LOGIN_REDIRECT)
            return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
        }
        console.log('Middleware log - ALLOWED ACCESS TO PATH: ', req.url)
        return NextResponse.next();
    }

    // If not logged in and is not public route deny access and redirect to login page
    if (!isLoggedIn && !isPublicRoute) {
        console.log('Middleware log - DENIED ACCESS TO PATH: ', req.url)
        console.log("Middleware log - REDIRECTED TO: /login")
        return NextResponse.redirect(new URL("/login", nextUrl))
    }

    // All other cases allow route
    console.log('Middleware log - ALLOWED ACCESS TO PATH: ', req.url)
    return NextResponse.next();
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}