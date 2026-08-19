/* eslint-disable @typescript-eslint/no-explicit-any */
import { RegisterPayload } from '../../types/user';
import { Role } from "../../genereted/prisma/client"
import { auth } from '../../lib/auth';
import { prisma } from '../../lib/prisma';
import { getAccessToken, getRefreshToken } from '../../utils/token';
import { verifyToken } from '../../utils/jwt';
import envConfig from '../../configs/envConfig';
import { AppError } from '../../errors/AppError';
import status from 'http-status';
import { JwtPayload } from 'jsonwebtoken';


const register = async (user: RegisterPayload) => {
    const result = await auth.api.signUpEmail({
        body: {
            name: user.name,
            email: user.email,
            needPasswordChange: false,
            password: user.password,
            role: Role.PATIENT
        }
    })

    try {
        if (!result.user) throw new Error("User not created")

        const patient = await prisma.$transaction(async (tx) => {
            const patient = await tx.patient.create({
                data: {
                    userId: result.user.id,
                    name: user.name,
                    email: user.email
                }
            })
            return patient
        })

        return {
            ...result,
            patient
        }
    } catch (error) {
        console.log("Pateint register error", error)
        await prisma.user.delete({
            where: {
                email: user.email
            }
        })
        throw error
    }
}

const login = async (email: string, password: string) => {

    const isAlreadyDeletedUser = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (isAlreadyDeletedUser?.isDeleted) throw new Error("User is already deleted")
    if (isAlreadyDeletedUser?.status === "BLOCKED") throw new Error("User is blocked, please contact with the admin")

    const result = await auth.api.signInEmail({
        body: {
            email,
            password
        }
    })

    // if password need to change true then make it false

    if (result.user.needPasswordChange) {
        await prisma.user.update({
            where: {
                id: result.user.id
            },
            data: {
                needPasswordChange: false
            }
        })
    }

    // console.log(result)

    const accessToken = await getAccessToken({
        id: result.user.id,
        role: result.user.role,
        name: result.user.name,
        isDeleted: result.user.isDeleted,
        email: result.user.email,
        status: result.user.status,
        emailVerified: result.user.emailVerified
    })

    const refreshToken = await getRefreshToken({
        id: result.user.id,
        role: result.user.role,
        name: result.user.name,
        isDeleted: result.user.isDeleted,
        email: result.user.email,
        status: result.user.status,
        emailVerified: result.user.emailVerified
    })

    // console.log(accessToken, refreshToken)



    return {
        ...result,
        accessToken,
        refreshToken
    }
}

const getMe = async (id: string) => {
    const result = await prisma.user.findUnique({
        where: {
            id: id
        }
    })
    return result
}

// get new access token

const getNewAccessToken = async (refreshToken: string, sessionToken: string) => {

    const isSessionTokenExists = await prisma.session.findUnique({
        where: {
            token: sessionToken,
        },
        include: {
            user: true,
        }
    })

    if (!isSessionTokenExists) {
        throw new AppError(status.UNAUTHORIZED, "Invalid session token");
    }

    const verifiedRefreshToken = await verifyToken(refreshToken, envConfig.REFRESH_TOKEN_SECRET)


    if (!verifiedRefreshToken.success && verifiedRefreshToken.error) {
        throw new AppError(status.UNAUTHORIZED, "Invalid refresh token");
    }

    const data = verifiedRefreshToken.data as JwtPayload;

    const newAccessToken = await getAccessToken({
        userId: data.userId,
        role: data.role,
        name: data.name,
        email: data.email,
        status: data.status,
        isDeleted: data.isDeleted,
        emailVerified: data.emailVerified,
    });

    const newRefreshToken = await getRefreshToken({
        userId: data.userId,
        role: data.role,
        name: data.name,
        email: data.email,
        status: data.status,
        isDeleted: data.isDeleted,
        emailVerified: data.emailVerified,
    });

    const { token } = await prisma.session.update({
        where: {
            token: sessionToken
        },
        data: {
            token: sessionToken,
            expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1000),
            updatedAt: new Date(),
        }
    }
    )



    return {
        token,
        newAccessToken,
        newRefreshToken
    }
}

// verify email otp

const verifyEmailOtp = async (email: string, otp: string) => {
    const result = await auth.api.verifyEmailOTP({
        body: {
            email,
            otp
        }
    })

    if (result.status && !result.user.emailVerified) await prisma.user.update({
        where: {
            email
        },
        data: {
            emailVerified: true
        }
    })
    return result
}

// forgot password
const forgotPassword = async (email: string) => {
    const isUserExists = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (!isUserExists) {
        throw new AppError(status.NOT_FOUND, "User not found")
    }

    if (!isUserExists.emailVerified) {
        throw new AppError(status.FORBIDDEN, "Email not verified")
    }

    if (isUserExists.isDeleted || isUserExists.status === "BLOCKED") {
        throw new AppError(status.INTERNAL_SERVER_ERROR, "You can't chnage password please contact with admin")
    }
    const result = await auth.api.requestPasswordResetEmailOTP({
        body: {
            email
        }
    })
    return result
}

// reset password

const resetPassword = async (email: string, otp: string, password: string) => {
    const isUserExists = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (!isUserExists) {
        throw new AppError(status.NOT_FOUND, "User not found")
    }

    if (!isUserExists.emailVerified) {
        throw new AppError(status.FORBIDDEN, "Email not verified")
    }

    if (isUserExists.isDeleted || isUserExists.status === "BLOCKED") {
        throw new AppError(status.INTERNAL_SERVER_ERROR, "You can't chnage password please contact with admin")
    }

    const result = await auth.api.resetPasswordEmailOTP({
        body: {
            email,
            otp,
            password
        }
    })

    // 
    if (isUserExists?.needPasswordChange) {
        await prisma.user.update({
            where: {
                id: isUserExists.id
            },
            data: {
                needPasswordChange: false
            }
        })
    }

    //delete all session if changed pass

    await prisma.session.deleteMany({
        where: {
            userId: isUserExists.id
        }
    })

    return result
}

// google login

const googleLoginSuccess = async (session : Record<string, any>) =>{
    const isPatientExists = await prisma.patient.findUnique({
        where : {
            userId : session.user.id,
        }
    })

    if(!isPatientExists){
        await prisma.patient.create({
            data : {
                userId : session.user.id,
                name : session.user.name,
                email : session.user.email,
            }
        
        })
    }

    const accessToken =  await getAccessToken({
        userId: session.user.id,
        role: session.user.role,
        name: session.user.name,
    });

    const refreshToken = await getRefreshToken({
        userId: session.user.id,
        role: session.user.role,
        name: session.user.name,
    });

    return {
        accessToken,
        refreshToken,
    }
}


export const authService = { register, login, getMe, getNewAccessToken, verifyEmailOtp, forgotPassword, resetPassword, googleLoginSuccess }
