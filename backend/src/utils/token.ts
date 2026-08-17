import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"
import { createToken } from "./jwt"
import envConfig from "../configs/envConfig"
import ms from "ms"
import { setCookie } from "./cookie"
import { Response } from "express"


const getAccessToken = (payload: JwtPayload) => {
    const accessToken = createToken(payload, envConfig.ACCESS_TOKEN_SECRET as string, { expiresIn: envConfig.ACCESS_TOKEN_EXPIRE_IN } as SignOptions)
    return accessToken
}


const getRefreshToken = (payload: JwtPayload) => {
    const refreshToken = createToken(payload, envConfig.REFRESH_TOKEN_SECRET as string, { expiresIn: envConfig.REFRESH_TOKEN_EXPIRE_IN } as SignOptions)
    return refreshToken
}

const setAccessTokenToCookie = (res: any, accessToken: string) => {
    const maxAge = ms(envConfig.ACCESS_TOKEN_EXPIRE_IN as ms.StringValue)
    console.log(maxAge)

    setCookie(res, 'accessToken', accessToken, {
        maxAge: maxAge,
        httpOnly: envConfig.JWT_COOKIE_HTTP_ONLY,
        sameSite: "none",
        path: "/",
        secure: envConfig.JWT_COOKIE_SECURE
    })
}

const setRefreshTokenToCookie = (res: any, refreshToken: string) => {
    const maxAge = ms(envConfig.REFRESH_TOKEN_EXPIRE_IN as ms.StringValue)

    setCookie(res, 'refreshToken', refreshToken, {
        maxAge: maxAge,
        httpOnly: envConfig.JWT_COOKIE_HTTP_ONLY,
        sameSite: "none",
        path: "/",
        secure: envConfig.JWT_COOKIE_SECURE
    })
}

const setBetterAuthSessionToCookie = (res: Response, accessToken: string) => {
    const maxAge = ms(envConfig.BETTER_AUTH_SESSION_EXPIRE_IN as ms.StringValue)

    setCookie(res, 'betterAuth.session_token', accessToken, {
        maxAge:maxAge,
        httpOnly: envConfig.JWT_COOKIE_HTTP_ONLY,
        sameSite: "none",
        path: "/",
        secure: envConfig.JWT_COOKIE_SECURE
    })
}


export { getAccessToken, getRefreshToken, setAccessTokenToCookie, setRefreshTokenToCookie, setBetterAuthSessionToCookie }