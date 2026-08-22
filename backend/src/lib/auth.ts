import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role, UserStatus } from "../genereted/prisma/enums";
import envConfig from "../configs/envConfig";
import ms from "ms";
import { bearer, emailOTP } from "better-auth/plugins";
import { sendEmail } from "../utils/email";


export const auth = betterAuth({
    baseURL: envConfig.BETTER_AUTH_URL,
    secret: envConfig.BETTER_AUTH_SECRET,

    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true
    },



    socialProviders: {
        google: {
            clientId: envConfig.GOOGLE_CLIENT_ID,
            clientSecret: envConfig.GOOGLE_CLIENT_SECRET,
            callbackUrl: envConfig.GOOGLE_CALLBACK_URL,
            mapProfileToUser: () => {
                return {
                    role: Role.PATIENT,
                    status: UserStatus.ACTIVE,
                    needPasswordChange: false,
                    emailVerified: true,
                    isDeleted: false,
                    deletedAt: null,
                }
            }
        },
    },

    emailVerification: {
        sendOnSignIn: true,
        sendOnSignUp: true,
        autoSignInAfterVerification: true
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
        expiresIn: ms(envConfig.BETTER_AUTH_SESSION_EXPIRE_IN as ms.StringValue) / 1000,
        updateAge: ms(envConfig.BETTER_AUTH_SESSION_TOKEN_UPDATE_IN as ms.StringValue) / 1000,
        cookieCache: {
            enabled: true,
            maxAge: ms(envConfig.BETTER_AUTH_SESSION_EXPIRE_IN as ms.StringValue) / 1000
        }
    },
    plugins: [
        bearer(),
        emailOTP({
            overrideDefaultEmailVerification: true,
            async sendVerificationOTP({ email, otp, type }) {

                if (type === "email-verification") {
                    const user = await prisma.user.findUnique({
                        where: {
                            email,
                        }
                    })

                    if (user && !user.emailVerified && user.role !== Role.SUPER_ADMIN) {
                        sendEmail({
                            to: email,
                            subject: "Verify your email",
                            templateName: "otp",
                            templateData: {
                                name: user.name,
                                otp,
                            }
                        })
                    }
                } else if (type === "forget-password") {
                    const user = await prisma.user.findUnique({
                        where: {
                            email,
                        }
                    })

                    if (user) {
                        sendEmail({
                            to: email,
                            subject: "Password Reset OTP",
                            templateName: "otp",
                            templateData: {
                                name: user.name,
                                otp,
                            }
                        })
                    }
                }
            },
            expiresIn: 10 * 60,
            otpLength: 6,
        })
    ],
    redirectURLs: {
        signIn: `${envConfig.BETTER_AUTH_URL}/api/v1/auth/google/success`,
    },

    trustedOrigins: [process.env.NODE_ENV || "http://localhost:5000"],
    advanced: {
        // disableCSRFCheck: true,
        useSecureCookies: false,
        cookies: {
            state: {
                attributes: {
                    sameSite: "none",
                    secure: true,
                    httpOnly: true,
                    path: "/",
                }
            },
            sessionToken: {
                attributes: {
                    sameSite: "none",
                    secure: true,
                    httpOnly: true,
                    path: "/",
                }
            }
        }
    }
});