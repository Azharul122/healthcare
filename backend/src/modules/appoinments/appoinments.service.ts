import { uuidv7 } from "zod";
import { prisma } from "../../lib/prisma";
import { IRequestUser } from "../../types/user";
import { ICreateAppoinmentPayload } from "./appoinment.interface";
import { AppointmentStatus, Role } from "../../genereted/prisma/enums";
import { AppError } from "../../errors/AppError";
import status from "http-status";


const createAppoinment = async (payload: ICreateAppoinmentPayload, user: IRequestUser) => {

    const patoentData = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });

    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });

    const doctorSchedules = await prisma.doctorSchedules.findUniqueOrThrow({
        where: {
            doctorId_scheduleId: {
                doctorId: doctorData.id,
                scheduleId: payload.scheduleId
            }
        }
    })

    const videoCallingId = String(uuidv7());




    const result = await prisma.$transaction(async (tx) => {
        const appoinment = await tx.appointment.create({
            data: {
                patientId: patoentData.id,
                doctorId: payload.doctorId,
                videoCallingId,
                scheduleId: doctorSchedules.scheduleId
            }
        })

        // update true
        await tx.doctorSchedules.update({
            where: {
                doctorId_scheduleId: {
                    doctorId: payload.doctorId,
                    scheduleId: payload.scheduleId
                }
            },
            data: {
                isBooked: true
            }
        })

        // now payment
        // await tx.payment.create({
        //     data: {
        //         patientId: patoentData.id,
        //         doctorId: payload.doctorId,
        //         videoCallingId,
        //         scheduleId: doctorSchedules.scheduleId
        //     }
        // })
        return appoinment
    })

    return result
}

// 1. Completed Or Cancelled Appointments should not be allowed to update status

const changeAppointmentStatus = async (appointmentId: string, appointmentStatus: AppointmentStatus, user: IRequestUser) => {
    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: appointmentId,
            // status: AppointmentStatus.SCHEDULED
        },
        include: {
            doctor: true
        }
    });

    // if (!appointmentData) {
    //     throw new AppError(status.NOT_FOUND, "Appointment not found or already completed/cancelled");
    // }

    if (user?.role === Role.DOCTOR) {
        if (!(user?.email === appointmentData.doctor.email))
            throw new AppError(status.BAD_REQUEST, "This is not your appointment")

        if (appointmentData.status === AppointmentStatus.SCHEDULED) {
            if (appointmentStatus === AppointmentStatus.INPROGRESS) {
                return await prisma.appointment.update({
                    where: {
                        id: appointmentId
                    },
                    data: {
                        status: appointmentStatus
                    }
                })
            }
        }

        if (appointmentData.status === AppointmentStatus.INPROGRESS) {
            if (appointmentStatus === AppointmentStatus.COMPLETED) {
                return await prisma.appointment.update({
                    where: {
                        id: appointmentId
                    },
                    data: {
                        status: appointmentStatus
                    }
                })
            }
        }
    }

    // patient can only cancel the scheduled appointment if it scheduled not completed or cancelled or inprogress.
    if (user?.role === Role.PATIENT) {
        if (appointmentData.status === AppointmentStatus.SCHEDULED) {
            if (appointmentStatus === AppointmentStatus.CANCELED) {
                return await prisma.appointment.update({
                    where: {
                        id: appointmentId
                    },
                    data: {
                        status: appointmentStatus
                    }
                })
            }
        }
    }

    // admin and super admin can update to any status
    return await prisma.appointment.update({
        where: {
            id: appointmentId
        },
        data: {
            status: appointmentStatus
        }
    })

}

const getMyAppointments = async (user: IRequestUser) => {
    //user can be patient or doctor, so we need to check both
    const patientData = await prisma.patient.findUnique({
        where: {
            email: user?.email
        }
    });

    const doctorData = await prisma.doctor.findUnique({
        where: {
            email: user?.email
        }
    });

    let appointments = [];

    if (patientData) {
        appointments = await prisma.appointment.findMany({
            where: {
                patientId: patientData.id
            },
            include: {
                doctor: true,
                schedule: true
            }
        });
    } else if (doctorData) {
        appointments = await prisma.appointment.findMany({
            where: {
                doctorId: doctorData.id
            },
            include: {
                patient: true,
                schedule: true
            }
        });
    } else {
        throw new Error("User not found");
    }

    return appointments;

}

const getMySingleAppointment = async (appointmentId: string, user: IRequestUser) => {

    const patientData = await prisma.patient.findUnique({
        where: {
            email: user?.email
        }
    });

    const doctorData = await prisma.doctor.findUnique({
        where: {
            email: user?.email
        }
    });

    let appointment;

    if (patientData) {
        appointment = await prisma.appointment.findFirst({
            where: {
                id: appointmentId,
                patientId: patientData.id
            },
            include: {
                doctor: true,
                schedule: true
            }
        });
    } else if (doctorData) {
        appointment = await prisma.appointment.findFirst({
            where: {
                id: appointmentId,
                doctorId: doctorData.id
            },
            include: {
                patient: true,
                schedule: true
            }
        });
    }

    if (!appointment) {
        throw new AppError(status.NOT_FOUND, "Appointment not found");
    }

    return appointment;
}



const getAppoinment = async (id: string) => {
    const result = await prisma.appointment.findUniqueOrThrow({
        where: {
            id
        }
    })
    return result
}

const getAllAppointment = async () => {
    const result = await prisma.appointment.findMany({
        include: {
            doctor: true,
            patient: true
        }
    })
    return result
}


export const appointmentService = { createAppoinment, changeAppointmentStatus, getAppoinment, getAllAppointment, getMyAppointments, getMySingleAppointment } 