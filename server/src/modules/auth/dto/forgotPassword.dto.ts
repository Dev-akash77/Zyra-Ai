import { IsEmail, IsNotEmpty } from "class-validator";


export class ForgotPassword{
    @IsNotEmpty({message:'Email is required'})
    @IsEmail({},{message:'Email must be valid'})
    email!:string
}