import { NextFunction, Request, Response } from "express"
import { specialityService } from "./speciality.service"


const createSpecialities = async (req: Request, res: Response, next: NextFunction) => {
    const { title, description } = req.body

    const data = {
        title,
        description
    }

    try {
        const speciality = await specialityService.createSpeciality(data)

        return res.status(201).json({
            success: true,
            message: "Speciality created successfully",
            data: speciality
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const getAllSpeciality = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const speciality = await specialityService.getAllSpeciality()
        return res.status(200).json({
            success: true,
            message: "Speciality fetched successfully",
            data: speciality
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const updateSpeciality = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const { title, description } = req.body
    const data = {
        title,
        description
    }
    try {
        const speciality = await specialityService.updateSpeciality(id as string, data)
        return res.status(200).json({
            success: true,
            message: "Speciality updated successfully",
            data: speciality
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const deleteSpeciality = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    try {
        await specialityService.deleteSpeciality(id as string)

        res.json({
            success: true,
            message: "Deleted successfully",
            data: null
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

// ...................... get single speciality ......................
const getSingleSpeciality = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Id is required",
            data: null
        })
    }

    try {
        const speciality = await specialityService.getSingleSpeciality(id as string)
        return res.status(200).json({
            success: true,
            message: "Speciality fetched successfully",
            data: speciality
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}


// ...................... Export ......................
export const specialityController = {
    createSpecialities,
    updateSpeciality,
    getAllSpeciality,
    deleteSpeciality,
    getSingleSpeciality
}