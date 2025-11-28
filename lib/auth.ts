import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { hashPassword, verifyPassword } from "./argon2";
import { nextCookies } from "better-auth/next-js";
import { Role } from "@prisma/client";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  // experimental: { joins: true },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    password: {
      hash: hashPassword,
      verify: verifyPassword
    },
    autoSignIn: true
  },
  user: {
    additionalFields: {
      role: {
        type: Object.values(Role) as [string, ...string[]],
        input: false,
        fieldName: "role",
        required: false,
        defaultValue: "USER"
      },
      phone: {
        type: "string",
        input: false,
        required: false
      },
      // active: {
      //   type: "boolean",
      //   input: false,
      //   required: false,
      // }
    }
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
  },
  hooks: {
    // before: createAuthMiddleware(async (ctx) => {
    //   if (ctx.path === "/sign-in/email") {
    //       const { email } = ctx.body || {};

    //       if (email) {
    //           const user = await prisma.user.findUnique({
    //               where: { email },
    //               select: { 
    //                 active: true, 
    //                 id: true 
    //               }
    //           });

    //           if (user && !user.active) {
    //               throw new APIError("FORBIDDEN", {
    //                   message: "Ce compte est désactivé. Veuillez contacter l'administrateur."
    //               });
    //           }
    //       }
    //   }
    // }),
  },
  advanced: {
    database: {
      generateId: false
    }
  },
  plugins: [nextCookies()]
});