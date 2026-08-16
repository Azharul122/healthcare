import { RegisterPayload } from '../../types/user';
import { Role, User } from "../../genereted/prisma/client"
import { auth } from '../../lib/auth';
import { prisma } from '../../lib/prisma';


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
}

const login = async (email: string, password: string) => {

    const isAlreadyDeletedUser = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (isAlreadyDeletedUser?.isDeleted) throw new Error("User is already deleted")

    const result = await auth.api.signInEmail({
        body: {
            email,
            password
        }
    })


    return result
}

export const authService = { register, login }
