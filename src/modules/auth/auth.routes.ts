import type { FastifyInstance } from "fastify";
import { signIn } from "./auth.controller";

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/sign-in', signIn)
}
