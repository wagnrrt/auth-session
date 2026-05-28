import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { ZodError } from "zod"

export class BaseError extends Error {
  statusCode: number

  constructor(message: string, statusCode: number = 400) {
    super(message)
    this.statusCode = statusCode
  }
}

export function errorHandler(app: FastifyInstance) {
  app.setErrorHandler((err, request, reply) => {

    if (err instanceof ZodError) {
      return reply.code(400).send({
        error: 'invalid request data',
      })
    }

    if (err instanceof BaseError) {
      return reply.code(err.statusCode).send({
        error: err.message
      })
    }

    return reply.code(500).send({
      error: 'internal server error'
    })
  })
}
