import { prisma } from "../../../lib/prisma"


// ...................... Create Speciality ......................
const createSpeciality = async ({ title, description }: { title: string, description?: string }) => {
    const result = await prisma.speciality.create({
        data: {
            title,
            description
        }
    })

    console.log(result, "result")
    console.log(title, "title", description, "description")

    return result
}

// ...................... Get All Speciality ......................
const getAllSpeciality = async () => {
    const result = await prisma.speciality.findMany()
    return result
}

// ...................... Update Speciality ......................

const updateSpeciality = async (id: string, data: { title?: string, description?: string }) => {
    const result = await prisma.speciality.update({
        where: {
            id
        },
        data
    })
    return result
}

// ...................... Delete Speciality(soft) ......................

const deleteSpeciality = async (id: string) => {
    const result = await prisma.speciality.update({
        where: {
            id
        },
        data: {
            isDeleted: true
        }
    })
    return result
}

// ...................... Export ......................
export const specialityService = {
    createSpeciality,
    getAllSpeciality,
    updateSpeciality,
    deleteSpeciality
}


