import { authenticate } from "../../hooks/auth.hook.js"
import { signIn, signUp, signOut } from "./auth.controller.js"

export async function authRoutes(app) {
  app.post('/auth/sign-in', signIn)
  app.post('/auth/sign-up', signUp)
  app.post('/auth/sign-out', { preHandler: authenticate }, signOut)
}
