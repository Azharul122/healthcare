import { RegisterPayload } from '../../types/user';
import { Role, User } from "../../genereted/prisma/client"
import { auth } from '../../lib/auth';
import { prisma } from '../../lib/prisma';
import { getAccessToken, getRefreshToken } from '../../utils/token';


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

const getMe=async(id:string)=>{
    const result=await prisma.user.findUnique({
        where:{
            id:id
        }
    })
    return result
}

export const authService = { register, login, getMe }
