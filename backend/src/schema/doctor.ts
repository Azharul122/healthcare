import { z } from "zod";
import { Gender } from "../genereted/prisma/enums";
import { emailSchema, passwordSchema, uuidArraySchema } from "../utils/validation";


export const createDoctorSchema = z.object({
    password: passwordSchema,

    doctor: z.object({
        name: z
            .string()
            .min(1, "Doctor name is required"),

        email: emailSchema,

        profilePic: z
            .string()
            .url("Invalid profile picture URL")
            .optional(),

        gender: z
            .enum(Gender)
            .optional(),

        phone: z
            .string()
            .regex(
                /^(?:\+8801|01)[3-9]\d{8}$/,
                "Invalid Bangladesh mobile number"
            ).optional(),

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

    specialities: uuidArraySchema("Please select at least one speciality"),
});

export type CreateDoctorPayload = z.infer<typeof createDoctorSchema>;

// export const updateDoctorSchema = createDoctorSchema.partial();