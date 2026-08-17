
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"
const createToken = async (payload: JwtPayload, secret: string, { expiresIn }: SignOptions) => {
    return jwt.sign(payload, secret, { expiresIn })
}

const verifyToken = async (token: string, secret: string) => {
    try {
        const data = jwt.verify(token, secret) as JwtPayload

        return {
            success: true,
            message: "Verified",
            data
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.message,
            statusCode: 401,
            error
        }
    }
    // return jwt.verify(token, secret)
}

const decodeToken = async (token: string) => {
    return jwt.decode(token) as JwtPayload
}

export { createToken, verifyToken, decodeToken }