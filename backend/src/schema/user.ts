import z, { email } from "zod";
import { emailSchema, otpSchema, passwordSchema } from "../utils/validation";


const changePasswordZodSchema = z.object(
    {
        oldPassword: passwordSchema,
        newPassword: passwordSchema,
        email: emailSchema
    }
)

const verifyOtpShema = z.object(
    {
        email: emailSchema,
        otp: otpSchema
    }
)



export {
    changePasswordZodSchema,
    verifyOtpShema
}