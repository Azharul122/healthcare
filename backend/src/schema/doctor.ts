import { z } from "zod";
import { Gender } from "../genereted/prisma/enums";


export const createDoctorSchema = z.object({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),

  doctor: z.object({
    name: z
      .string()
      .min(1, "Doctor name is required"),

    email: z
      .string()
      .email("Invalid email address"),

    profilePic: z
      .string()
      .url("Invalid profile picture URL")
      .optional(),

    gender: z
      .nativeEnum(Gender)
      .optional(),

    phone: z
      .string()
      .optional(),

    registartionNumber: z
      .string()
      .optional(),

    appointFe: z
      .number()
      .nonnegative("Appointment fee cannot be negative")
      .optional(),

    qualification: z
      .string()
      .optional(),

    currentWorkingPlace: z
      .string()
      .optional(),

    designation: z
      .string()
      .optional(),

    avarageRating: z
      .number()
      .min(0)
      .max(5)
      .optional(),

    expreince: z
      .number()
      .int()
      .nonnegative()
      .optional(),
  }),

  specialities: z
    .array(z.string())
    .optional(),
});

export type CreateDoctorPayload = z.infer<typeof createDoctorSchema>;