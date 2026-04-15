import { signIn, signUp, signOut } from "./auth.controller.js"
import { requireAuth } from "../../hooks/require-auth.js"

export async function authRoutes(app) {
  app.post('/auth/sign-in', signIn)
  app.post('/auth/sign-up', signUp)
  app.post('/auth/sign-out', { preHandler: requireAuth }, signOut)
}
