

import { config } from "dotenv";

config();



interface EnvConfig {
    NODE_ENV: string,
    PORT: string
    DATABASE_URL: string
    JWT_SECRET_KEY: string
    JWT_EXPIRES_IN: string
    JWT_COOKIE_EXPIRES_IN: number
    JWT_COOKIE_HTTP_ONLY: boolean
    JWT_COOKIE_SAME_SITE: string
    JWT_COOKIE_SECURE: boolean
    BETTER_AUTH_SECRET: string
    BETTER_AUTH_URL: string
    ALLOWED_ORIGINS: string
    ACCESS_TOKEN_SECRET: string
    REFRESH_TOKEN_SECRET: string
    ACCESS_TOKEN_EXPIRE_IN: string
    REFRESH_TOKEN_EXPIRE_IN: string
    BETTER_AUTH_SESSION_EXPIRE_IN: string
    BETTER_AUTH_SESSION_TOKEN_UPDATE_IN: string

    EMAIL_SENDER_SMTP_USER: string
    EMAIL_SENDER_SMTP_PASS: string
    EMAIL_SENDER_SMTP_HOST: string
    EMAIL_SENDER_SMTP_PORT: string
    EMAIL_SENDER_SMTP_FROM: string

    GOOGLE_CLIENT_ID: string
    GOOGLE_CLIENT_SECRET: string
    GOOGLE_CALLBACK_URL: URL

    FRONTEND_URL: URL

}

const envConfig = process.env as unknown as EnvConfig

export default envConfig