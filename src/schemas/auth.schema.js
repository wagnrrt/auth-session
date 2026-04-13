import z from "zod"

export const signUpSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.email().max(255),
  password: z.string().min(8).max(255)
})

export const signInSchema = z.object({
  email: z.email().max(255),
  password: z.string().min(8).max(255)
})
