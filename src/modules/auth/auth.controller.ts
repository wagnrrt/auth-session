import type { FastifyReply, FastifyRequest } from "fastify";

export async function signIn(request: FastifyRequest, reply: FastifyReply) {
  return reply.code(200).send({ message: 'user logged in successfully' })
}
