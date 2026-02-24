export interface Registration {
    name: string,
    email: string,
    password: string,
    role: 'user' | 'admin',
    otp: string,
    phoneNumber: string,
    updatedAt?: Date
}