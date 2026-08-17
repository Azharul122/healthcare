import { speciality } from "../../genereted/prisma/client"

import { auth } from "../../lib/auth"
import { prisma } from "../../lib/prisma"
import { CreateDoctorPayload } from "../../types/user"







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

export const userService = {
    createDoctor
}