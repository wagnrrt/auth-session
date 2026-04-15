import { signInRequestSchema, signUpRequestSchema } from "../../schemas/auth.schema.js"
import { parseUserAgent } from "../../utils/user-agent.parser.js"
import * as authService from "./auth.service.js"

const COOKIE_OPTIONS = {
  signed: true,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
}

function setSessionCookie(reply, token) {
  reply.setCookie('session', token, {
    ...COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60 * 1000
  })
}

export async function signUp(request, reply) {
  const data = signUpRequestSchema.parse(request.body)
  const ua = parseUserAgent(request.headers['user-agent'])

  const token = await authService.signUp(request.server.db, {
    ...data,
    ipAddress: request.ip,
    ...ua
  })

  setSessionCookie(reply, token)
  return reply.code(201).send({ message: 'User registered successfully' })
}

export async function signIn(request, reply) {
  const data = signInRequestSchema.parse(request.body)
  const ua = parseUserAgent(request.headers['user-agent'])

  const token = await authService.signIn(request.server.db, {
    ...data,
    ipAddress: request.ip,
    ...ua
  })

  setSessionCookie(reply, token)
  return reply.code(200).send({ message: 'User logged in successfully' })
}

export async function signOut(request, reply) {
  console.log(request.user)
  await authService.signOut(request.server.db, request.user.sessionId)
  reply.clearCookie('session')
  return reply.code(200).send({ message: 'User logged out successfully' })
}
