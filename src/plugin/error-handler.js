import { ZodError } from "zod"
import { BaseError } from "../errors/base-error.js"

export async function errorHandler(app) {
  app.setErrorHandler((err, req, res) => {
    console.error(err)

    if (err instanceof ZodError) {
      return res.code(400).send({
        error: 'invalid request data',
        // details: err.issues
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
