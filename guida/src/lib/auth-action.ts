'use server'
import {signIn} from "@/auth";

/**
 * Server action calls next-auth signIn serverside hook
 * @param formData Credentials data passed to signIn hook
 * @constructor
 */
export async function SignInCredentials(formData: { redirect: boolean; password: string; username: string }) {
    return await signIn('credentials', formData)
}