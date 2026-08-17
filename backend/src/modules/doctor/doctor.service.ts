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

export const doctorService = {
    getAllDoctors
}