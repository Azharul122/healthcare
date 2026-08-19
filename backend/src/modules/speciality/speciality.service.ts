import { prisma } from "../../lib/prisma"
import { AppError } from "../../errors/AppError"


// ...................... Create Speciality ......................
const createSpeciality = async ({ title, description, icon }: { title: string, description?: string, icon: string }) => {
    const result = await prisma.speciality.create({
        data: {
            title,
            description,
            icon
        }
    })

    console.log(result, "result")
    console.log(title, "title", description, "description")

    return result
}

// ...................... Get All Speciality ......................
const getAllSpeciality = async () => {
    const result = await prisma.speciality.findMany({
        where: {
            isDeleted: false
        }
    })
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
    const speciality = await prisma.speciality.findUnique({
        where: { id }
    });

    if (!speciality) {
        throw new AppError(404, "Speciality not found");
    }

    if (speciality.isDeleted) {
        throw new AppError(400, "Speciality is already deleted");
    }

    const result = await prisma.speciality.update({
        where: { id },
        data: {
            isDeleted: true,
            deletedAt: new Date()
        }
    });

    return result;
};

// ...................... Get Single Speciality By Id ......................

const getSingleSpeciality = async (id: string) => {
    if (id.length !== 36) throw new AppError(400, "Invalid id provided")
    const result = await prisma.speciality.findUnique({
        where: {
            id
        }
    })
    return result
}

// ...................... Export ......................
export const specialityService = {
    createSpeciality,
    getAllSpeciality,
    updateSpeciality,
    deleteSpeciality,
    getSingleSpeciality
}


