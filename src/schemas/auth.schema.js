import z from "zod"

export const signUpRequestSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.email().max(255),
  password: z.string().min(8).max(255)
})

export const signInRequestSchema = z.object({
  email: z.email().max(255),
  password: z.string().min(8).max(255)
})
