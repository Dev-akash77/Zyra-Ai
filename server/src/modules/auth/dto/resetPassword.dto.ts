import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from "class-validator";



export class ResetPasswordDto{
    @IsNotEmpty({message:"email must be provided"})
    @IsEmail({},{message:"Email must be valid"})
    email!:string

    @IsNotEmpty({message:'OTP must be Provided'})
    @IsString()
    @Length(6,6,{message:'OTP must be 6 length o character'})
    otp!:string

    @IsNotEmpty({message:'Password must be provided'})
    @IsString()
    @MinLength(8,{message:'password must be 8 or more character'})
    newPassword!:string
}