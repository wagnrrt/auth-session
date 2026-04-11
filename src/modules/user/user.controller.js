import { signUpSchema } from "../../schemas/user.schema.js"
import { createUser } from "./user.service.js"

export const signUp = async (request, reply) => {
  const result = signUpSchema.safeParse(request.body)
  if (!result.success) return reply.code(400).send({
    error: 'validation error',
    // details: result.error.issues
  })

  await createUser(request.server.db, result.data)
  return reply.code(201).send({ message: 'user created' })
}
