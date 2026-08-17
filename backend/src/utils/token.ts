import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"
import { createToken } from "./jwt"
import envConfig from "../configs/envConfig"


const getAccessToken = (payload: JwtPayload) => {
    const accessToken = createToken(payload, envConfig.ACCESS_TOKEN_SECRET as string, { expiresIn: envConfig.ACCESS_TOKEN_EXPIRE_IN  } as SignOptions)
    return accessToken
}


const getRefreshToken = (payload: JwtPayload) => {
    const refreshToken = createToken(payload, envConfig.REFRESH_TOKEN_SECRET as string, { expiresIn: envConfig.REFRESH_TOKEN_EXPIRE_IN  } as SignOptions)
    return refreshToken
}


export { getAccessToken, getRefreshToken }