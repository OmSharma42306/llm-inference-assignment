import z from "zod";


export const SignUpScheama = z.object({
    name : z.string(),
    email : z.email(),
    password : z.string().min(8)
});

export const SignInSchema = z.object({
    email : z.email(),
    password : z.string().min(8)
});