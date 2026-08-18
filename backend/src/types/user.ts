import { Gender } from "../genereted/prisma/enums"

export interface RegisterPayload {
    name: string,
    email: string,
    password: string
    needPasswordChange?: boolean
    role?: string
    status?: string
    image?: string
}

export interface CreateDoctorPayload {
    password: string,
    doctor: {
        name: string,
        email: string,
        profilePic?: string
        gender?: Gender
        phone?: string
        registartionNumber?: string
        appointFe?: number
        qualification?: string
        currentWorkingPlace?: string
        designation?: string
        avarageRating?: number
        expreince?: number
    }
    specialities?: string[]
}

export interface updateDoctorPayload {
    doctor: {
        name?: string,
        email?: string,
        profilePic?: string
        gender?: Gender
        phone?: string
        registartionNumber?: string
        appointFe?: number
        qualification?: string
        currentWorkingPlace?: string
        designation?: string
        avarageRating?: number
        expreince?: number
    }
    specialities?: string[]
}