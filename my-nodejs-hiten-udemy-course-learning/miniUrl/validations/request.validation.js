import { email, z } from 'zod';

export const signupPostRequestBodySchema = z.object({
    firstname: z.string(),
    lastname: z.string().optional(),
    email: z.email(),
    password: z.string().min(3).max(100)
})

export const loginPostRequestBodySchema = z.object({
    email: z.email(),
    password: z.string().min(3).max(100)
})