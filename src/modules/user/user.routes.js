import { signUp } from "./user.controller.js"

export async function userRoutes(app) {
  // app.get('/users/me', {})
  app.post('/users', signUp)
}
