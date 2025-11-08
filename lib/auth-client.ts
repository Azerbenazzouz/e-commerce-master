import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react"
import { auth } from "@/lib/auth";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
    plugins: [inferAdditionalFields<typeof auth>()],
})

export const {
    signUp,
    signIn,
    signOut
} = authClient;