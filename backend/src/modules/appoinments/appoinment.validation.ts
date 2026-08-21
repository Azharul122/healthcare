import { z } from "zod";

const createAppointmentSchema = z.object({
  doctorId: z.string().min(1, "Doctor ID is required"),
  scheduleId: z.string().min(1, "Schedule ID is required"),
});

const updateAppointmentSchema = z.object({
  doctorId: z.string().min(1, "Doctor ID is required"),
  scheduleId: z.string().min(1, "Schedule ID is required"),
  status: z.string().min(1, "Status is required"),
});

export const appointmentValidation = {
  createAppointmentSchema,
  updateAppointmentSchema,
};