import { ZodError } from "zod"

export async function errorHandler(app) {
  app.setErrorHandler((err, req, res) => {
    console.error(err)

    if (err instanceof ZodError) {
      return res.code(400).send({
        error: 'invalid request data',
        // details: err.issues
      })
    }

    return res.code(500).send({
      error: 'internal server error'
    })
  })
}
