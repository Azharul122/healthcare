import { prisma } from "../../lib/prisma"

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

const updateDoctor = async (id: string, payload: any) => {
    const result = await prisma.doctor.update({
        where: {
            id
        },
        data: payload
    })
    return result
}

//  soft delete
const deleteDoctor = async (id: string) => {
    const result = await prisma.doctor.update({
        where: {
            id
        },
        data: {
            isDeleted: true,
            deletedAt: new Date()
        }
    })
    return result
}

export const doctorService = {
    getAllDoctors,
    getSingleDoctor,
    updateDoctor,
    deleteDoctor
}