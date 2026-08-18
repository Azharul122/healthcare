import { UserStatus } from "../../genereted/prisma/enums"
import { prisma } from "../../lib/prisma"
import { updateDoctorPayload } from "../../types/user"

const getAllDoctors = async () => {
    const result = await prisma.doctor.findMany({
        where: {
            isDeleted: false
        },
        include: {
            user: true,
            doctorSpecialities: {
                include: {
                    speciality: true
                }
            }
        }
    })
    return result
}

const getSingleDoctor = async (id: string) => {
    const result = await prisma.doctor.findUnique({
        where: {
            id
        },
        include: {
            user: true,
            doctorSpecialities: {
                include: {
                    speciality: true
                }
            }
        }
    })
    return result
}

const updateDoctor = async (id: string, payload: updateDoctorPayload) => {
    const result = await prisma.$transaction(async (tx) => {

        const isDoctorExists = await tx.doctor.findUnique({
            where: { id }
        })

        if (!isDoctorExists) {
            throw new Error("Doctor not found")
        }

        // doctor field update
        if (payload.doctor) {
            await tx.doctor.update({
                where: { id },
                data: payload.doctor
            })
        }

        // speciality update (upsert)
        if (payload.specialities && payload.specialities.length > 0) {
            for (const specialityId of payload.specialities) {
                await tx.doctorSpeciality.upsert({
                    where: {
                        doctorId_specialityId: {
                            doctorId: id,
                            specialityId: specialityId
                        }
                    },
                    update: {},
                    create: {
                        doctorId: id,
                        specialityId: specialityId
                    }
                })
            }
        }

        const updatedDoctor = await tx.doctor.findUnique({
            where: { id },
            include: {
                doctorSpecialities: {
                    include: {
                        speciality: true
                    }
                }
            }
        })

        return updatedDoctor
    })

    return result
}

//  soft delete
const deleteDoctor = async (id: string) => {

    const isDoctorExists = await prisma.doctor.findUnique({
        where: { id }
    })

    if (!isDoctorExists) {
        throw new Error("Doctor not found")
    }

    await prisma.$transaction(async (tx) => {
        await tx.doctor.update({
            where: {
                id
            },
            data: {
                isDeleted: true,
                deletedAt: new Date()
            }
        })

        await tx.user.update({
            where: {
                id
            },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
                status: UserStatus.BLOCKED
            }
        })

        await tx.doctorSpeciality.deleteMany({
            where: {
                doctorId: id
            }
        })

        await tx.session.deleteMany({
            where: {
                userId: id
            }
        })
    })
    return true
}

export const doctorService = {
    getAllDoctors,
    getSingleDoctor,
    updateDoctor,
    deleteDoctor
}