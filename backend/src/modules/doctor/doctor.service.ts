/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status"
import { AppError } from "../../errors/AppError"
import { DoctorSchedules, Prisma } from "../../genereted/prisma/client"
import { UserStatus } from "../../genereted/prisma/enums"
import { prisma } from "../../lib/prisma"
import { IQueryParams } from "../../types/query"
import { IRequestUser, updateDoctorPayload } from "../../types/user"
import { QueryBuilder } from "../../utils/QyuryBuilder"
import { doctorScheduleFilterableFields, doctorScheduleIncludeConfig, doctorScheduleSearchableFields } from "./doctor.constand"
import { ICreateDoctorSchedulePayload, IUpdateDoctorSchedulePayload } from "./doctor.interface"

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

const createSchedule = async (user: IRequestUser, payload: ICreateDoctorSchedulePayload) => {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });

    const doctorScheduleData = payload.scheduleIds.map((scheduleId) => ({
        doctorId: doctorData.id,
        scheduleId
    }))

    await prisma.doctorSchedules.createMany({
        data: doctorScheduleData
    });

    const result = await prisma.doctorSchedules.findMany({
        where: {
            doctorId: doctorData.id,
            scheduleId: {
                in: payload.scheduleIds
            }
        },
        include: {
            schedule: true
        }
    })


    return result;
}


const deleteSchedule = async (id: string, user: IRequestUser) => {

    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });

    const result = await prisma.doctorSchedules.deleteMany({
        where: {
            doctorId: doctorData.id,
            isBooked: false,
            scheduleId: id
        }
    })
    return result
}

const getSchedule = async (id: string) => {
    const result = await prisma.doctorSchedules.findMany({
        where: {
            doctorId: id
        }
    })
    return result
}

const updateSchedule = async (user: IRequestUser, payload: IUpdateDoctorSchedulePayload) => {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });

    const deleteIds = payload.scheduleIds.filter(schedule => schedule.shouldDelete).map(schedule => schedule.id);

    const createIds = payload.scheduleIds.filter(schedule => !schedule.shouldDelete).map(schedule => schedule.id);

    const result = await prisma.$transaction(async (tx) => {

        await tx.doctorSchedules.deleteMany({
            where: {
                isBooked: false,
                doctorId: doctorData.id,
                scheduleId: {
                    in: deleteIds
                }
            }
        });

        const doctorScheduleData = createIds.map((scheduleId) => ({
            doctorId: doctorData.id,
            scheduleId
        }))

        const result = await tx.doctorSchedules.createMany({
            data: doctorScheduleData
        });

        return result;
    })

    return result;
}

const getMyDoctorSchedules = async (user: IRequestUser, query: IQueryParams) => {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });
    const queryBuilder = new QueryBuilder<DoctorSchedules, Prisma.DoctorSchedulesWhereInput, Prisma.DoctorSchedulesInclude>(prisma.doctorSchedules,
        {
            doctorId: doctorData.id,
            ...query
        },
        {
            filterableFields: doctorScheduleFilterableFields,
            searchableFields: doctorScheduleSearchableFields
        })
    const doctorSchedules = await queryBuilder
        .search()
        .filter()
        .paginate()
        .include({
            schedule: true,
            doctor: {
                include: {
                    user: true,
                }
            }
        })
        .sort()
        .fields()
        .dynamicInclude(doctorScheduleIncludeConfig)
        .execute();
    return doctorSchedules;
}

const getAllDoctorSchedules = async (query: IQueryParams) => {
    const queryBuilder = new QueryBuilder<DoctorSchedules, Prisma.DoctorSchedulesWhereInput, Prisma.DoctorSchedulesInclude>(prisma.doctorSchedules, query, {
        filterableFields: doctorScheduleFilterableFields,
        searchableFields: doctorScheduleSearchableFields
    })

    const result = await queryBuilder
        .search()
        .filter()
        .paginate()
        .dynamicInclude(doctorScheduleIncludeConfig)
        .sort()
        .execute();

    return result;
}

const getDoctorScheduleById = async (doctorId: string, scheduleId: string) => {
    const doctorSchedule = await prisma.doctorSchedules.findUnique({
        where: {
            doctorId_scheduleId: {
                doctorId: doctorId,
                scheduleId: scheduleId
            }
        },
        include: {
            schedule: true,
            doctor: true
        }
    });
    return doctorSchedule;
}


const deleteMyDoctorSchedule = async (id: string, user: IRequestUser) => {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });

    // check if the schedule belongs to the doctor or not
    const isThisOwnSchedule = await prisma.doctorSchedules.findFirst({
        where: {
            doctorId: doctorData.id,
            scheduleId: id
        }
    })

    if (!isThisOwnSchedule) {
        throw new AppError(status.BAD_REQUEST, "This schedule does not belong to you");
    }

    await prisma.doctorSchedules.deleteMany({
        where: {
            isBooked: false,
            doctorId: doctorData.id,
            scheduleId: id
        }
    });
}



export const doctorService = {
    getAllDoctors,
    getSingleDoctor,
    updateDoctor,
    deleteDoctor,
    createSchedule,
    deleteSchedule,
    getSchedule,
    updateSchedule,
    getMyDoctorSchedules,
    getAllDoctorSchedules,
    getDoctorScheduleById,
    deleteMyDoctorSchedule
}