import { signInSchema, signUpSchema } from "../../schemas/auth.schema.js"
import { parseUserAgent } from "../../utils/user-agent.parser.js";
import * as authService from "./auth.service.js";

export async function signUp(request, reply) {
  const data = signUpSchema.parse(request.body)
  const ua = parseUserAgent(request.headers['user-agent'])

  const session = await authService.signUp(request.server.db, {
    name: data.name,
    email: data.email,
    password: data.password,
    ipAddress: request.ip,
    os: ua.os,
    browser: ua.browser,
    device: ua.device,
  })

  reply.setCookie('session', session, {
    signed: true,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'strict'
  })

  return reply.code(201).send({ message: 'user created' })
}

export async function signIn(request, reply) {
  const data = signInSchema.parse(request.body)
  const ua = parseUserAgent(request.headers['user-agent'])

  const session = await authService.signIn(request.server.db, {
    email: data.email,
    password: data.password,
    ipAddress: request.ip,
    os: ua.os,
    browser: ua.browser,
    device: ua.device,
  })

  reply.setCookie('session', session, {
    signed: true,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'strict'
  })

  return reply.code(201).send({ message: 'login successful' })
}
