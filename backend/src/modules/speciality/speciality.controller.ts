import { NextFunction, Request, Response } from "express"
import { specialityService } from "./speciality.service"


const createSpecialities = async (req: Request, res: Response) => {
    const { title, description } = req.body

    const data = {
        title,
        description
    }
    console.log(data, "controler")
    try {
        const speciality = await specialityService.createSpeciality(data)

        return res.status(201).json({
            success: true,
            message: "Speciality created successfully",
            data: speciality
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error creating speciality",
            error: error
        })
    }
}

const getAllSpeciality = async (req: Request, res: Response) => {
    try {
        const speciality = await specialityService.getAllSpeciality()
        return res.status(200).json({
            success: true,
            message: "Speciality fetched successfully",
            data: speciality
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching speciality",
            error: error
        })
    }
}

const updateSpeciality = async (req: Request, res: Response) => {
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
        return res.status(500).json({
            success: false,
            message: "Error updating speciality",
            error: error
        })
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

export const specialityController = {
    createSpecialities,
    updateSpeciality,
    getAllSpeciality,
    deleteSpeciality
}