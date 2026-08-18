import status from "http-status"
import { speciality } from "../../genereted/prisma/client"

import { auth } from "../../lib/auth"
import { prisma } from "../../lib/prisma"
import { CreateDoctorPayload, IChangePassword } from "../../types/user"
import { AppError } from "../../errors/AppError"
import { getAccessToken, getRefreshToken } from "../../utils/token"







const createDoctor = async (payload: CreateDoctorPayload) => {
    // console.log("payload", payload)
    // specialities xheck
    const specialities: speciality[] = []

    for (const specialityId of payload.specialities || []) {
        const speciality = await prisma.speciality.findUnique({
            where: {
                id: specialityId
            }
        })

        if (!speciality) {
            throw new Error("Speciality not found")
        }

        if (speciality) {
            specialities.push(speciality)
        }
    }

    // user already exists
    const userAlreadyExists = await prisma.user.findUnique({
        where: {
            email: payload.doctor.email
        }
    })


    if (userAlreadyExists) {
        throw new Error("User already exists")
    }

    // create user
    const userCreate = await auth.api.signUpEmail({
        body: {
            name: payload.doctor.name,
            email: payload.doctor.email,
            needPasswordChange: true,
            password: payload.password,
            role: "DOCTOR"
        }
    })

    // check having a problem when creating a speciality if yes then delete the user
    try {
        const result = await prisma.$transaction(async (tx) => {
            const doctorData = await tx.doctor.create({
                data: {
                    userId: userCreate.user.id,
                    ...payload.doctor,
                }
            })

            console.log(doctorData)

            const doctorSpeciality = await tx.doctorSpeciality.createMany({
                data: specialities.map((speciality) => ({
                    doctorId: doctorData.id,
                    specialityId: speciality.id
                }))
            })

            const doctor = await tx.doctor.findUnique({
                where: {
                    id: doctorData.id
                },
                select: {
                    id: true,
                    userId: true,
                    name: true,
                    email: true,
                    profilePic: true,
                    gender: true,
                    phone: true,
                    registartionNumber: true,
                    appointFe: true,
                    qualification: true,
                    currentWorkingPlace: true,
                    designation: true,
                    avarageRating: true,
                    expreince: true,
                    doctorSpecialities: {
                        select: {
                            speciality: {
                                select: {
                                    id: true,
                                    title: true,
                                    description: true,
                                    createdAt: true,
                                    updatedAt: true,
                                    deletedAt: true,
                                    isDeleted: true,
                                }
                            }
                        }
                    },
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            createdAt: true,
                            updatedAt: true,
                            deletedAt: true,
                            isDeleted: true,
                        }
                    }
                }
            })

            if (!doctor) {
                return null
            }

            const { doctorSpecialities, ...rest } = doctor

            return {
                ...rest,
                specialities: doctorSpecialities.map((ds) => ds.speciality)
            }
        })
        return result
    } catch (error) {
        console.log("doctor creating error:", error)
        await prisma.user.delete({
            where: {
                id: userCreate.user.id
            }
        })
        throw error
    }
}

// change password

const changePassword = async (payload: IChangePassword, sessionToken: string) => {
    const session = await auth.api.getSession({
        headers: new Headers({
            Authorization: `Bearer ${sessionToken}`
        })
    })

    if (!session) {
        throw new AppError(status.UNAUTHORIZED, "Invalid session token");
    }

    const { oldPassword, newPassword } = payload;

    const result = await auth.api.changePassword({
        body: {
            currentPassword: oldPassword,
            newPassword,
            revokeOtherSessions: true,
        },
        headers: new Headers({
            Authorization: `Bearer ${sessionToken}`
        })
    })

    if (session.user.needPasswordChange) {
        await prisma.user.update({
            where: {
                id: session.user.id,
            },
            data: {
                needPasswordChange: false,
            }
        })
    }

    const accessToken = await getAccessToken({
        userId: session.user.id,
        role: session.user.role,
        name: session.user.name,
        email: session.user.email,
        status: session.user.status,
        isDeleted: session.user.isDeleted,
        emailVerified: session.user.emailVerified,
    });

    const refreshToken = await getRefreshToken({
        userId: session.user.id,
        role: session.user.role,
        name: session.user.name,
        email: session.user.email,
        status: session.user.status,
        isDeleted: session.user.isDeleted,
        emailVerified: session.user.emailVerified,
    });


    return {
        ...result,
        accessToken,
        refreshToken,
    }



}

export const userService = {
    createDoctor,
    changePassword
}