import { RegisterPayload } from '../../types/user';
import { Role, User } from "../../genereted/prisma/client"
import { auth } from '../../lib/auth';


const register = async (user: RegisterPayload) => {
    const result = await auth.api.signUpEmail({
        body: {
            name: user.name,
            email: user.email,
            needPasswordChange: false,
            password: user.password,
            role: Role.PATIENT
        }
    })

    if (!result) throw new Error("User not created")

    return result
}

export const authService = { register }
