import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role, UserStatus } from "../genereted/prisma/enums";
import envConfig from "../configs/envConfig";
import ms from "ms";


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),

    emailAndPassword: {
        enabled: true
    },

    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: Role.PATIENT
            },
            status: {
                type: "string",
                required: true,
                defaultValue: UserStatus.ACTIVE
            },
            isDeleted: {
                type: "boolean",
                required: true,
                defaultValue: false
            },
            deletedAt: {
                type: "date",
                required: false,
                defaultValue: null
            },
            needPasswordChange: {
                type: "boolean",
                required: true,
                defaultValue: false
            }
        }
    },
    session: {
        expiresIn: ms(envConfig.BETTER_AUTH_SESSION_EXPIRE_IN as ms.StringValue)/1000,
        updateAge: ms(envConfig.BETTER_AUTH_SESSION_TOKEN_UPDATE_IN as ms.StringValue)/1000,
        cookieCache: {
            enabled: true,
            maxAge: ms(envConfig.BETTER_AUTH_SESSION_EXPIRE_IN as ms.StringValue)/1000
        }
    },
    // trustedOrigins: [process.env.NODE_ENV || "http://localhost:5000"],
    // advanced : {
    //     disableCSRFCheck: true
    // }
});