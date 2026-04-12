import { signUp } from "../auth/auth.controller.js"

export async function authRoutes(app) {
  // app.post('/auth/sign-in', signIn)
  app.post('/auth/sign-up', signUp)
  // app.post('/auth/sign-out', signUp)
}
