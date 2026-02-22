import {z} from 'zod';


export const registerSchema = z.object({
    name:z.string().min(1,"Name is required"),
    email:z
        .string()
        .min(1,"Email is required")
        .email("Invalid email format"),
    
    password:z
        .string()
        .min(8,"Password must be at least 8 characters")
        .regex(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/,
            "Password must contain uppercase , lowecase , number and special character"
        ),
    confirmPassword:z.string()
}).refine((data)=>data.password===data.confirmPassword,{
    message:"Password do not match",
    path:["confirmPassword"]
})


export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});