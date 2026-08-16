

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
}

const envConfig = process.env as unknown as EnvConfig

export default envConfig