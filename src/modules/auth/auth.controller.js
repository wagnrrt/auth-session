import { signUpSchema } from "../../schemas/user.schema.js"
import { parseUserAgent } from "../../utils/user-agent.parser.js";
import * as authService from "./auth.service.js";

export const signUp = async (request, reply) => {
  const result = signUpSchema.safeParse(request.body)
  if (!result.success) return reply.code(400).send({
    error: 'validation error',
    // details: result.error.issues
  })

  const ua = parseUserAgent(request.headers['user-agent'])

  const session = await authService.signUp(request.server.db, {
    name: result.data.name,
    email: result.data.email,
    password: result.data.password,
    ipAddress: request.ip,
    os: ua.os,
    browser: ua.browser,
    device: ua.device,
  })

  reply.setCookie('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'strict'
  })

  return reply.code(201).send({ message: 'user created' })
}
