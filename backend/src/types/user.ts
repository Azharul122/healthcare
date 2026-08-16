
export interface RegisterPayload {
    name: string,
    email: string,
    password: string
    needPasswordChange?: boolean
    role?: string
    status?: string
    image?: string
}