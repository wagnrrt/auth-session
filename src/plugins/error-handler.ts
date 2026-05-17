import type { FastifyInstance } from "fastify"
import { ZodError } from "zod"

export class BaseError extends Error {
  statusCode: number

  constructor(message: string, statusCode: number = 400) {
    super(message)
    this.statusCode = statusCode
  }
}

export async function errorHandler(app: FastifyInstance) {
  app.setErrorHandler((err, req, res) => {

    if (err instanceof ZodError) {
      return res.code(400).send({
        error: 'invalid request data',
      })
    }

    if (err instanceof BaseError) {
      return res.code(err.statusCode).send({
        error: err.message
      })
    }

    return res.code(500).send({
      error: 'internal server error'
    })
  })
}
