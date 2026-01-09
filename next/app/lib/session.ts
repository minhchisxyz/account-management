import 'server-only'

import {SessionPayload} from "@/app/lib/definitions";
import {jwtVerify, SignJWT} from "jose";
import {cookies} from "next/headers";
import prisma from "@/app/lib/prisma";

const secretKey = process.env.SECRET_KEY

if (!secretKey) throw new Error('SECRET_KEY is not defined')

const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload: SessionPayload, expirationTime: string) {
  return new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(expirationTime)
      .sign(encodedKey)
}

export async function decrypt(session: string | undefined = '') {
  try {
    const {payload} = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (e) {
    console.log('Error while decrypting session:')
  }
}

export async function generateAccessToken(payload: SessionPayload) {
  return encrypt(payload, '15m')
}

export async function generateRefreshToken(payload: SessionPayload) {
  return encrypt(payload, '7d')
}

export async function createSession(user: { id: number, username: string }) {
  const cookieStore = await cookies()
  const accessExpires = new Date(Date.now() + 15 * 60 * 1000)
  const refreshExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const [accessToken, refreshToken] = await Promise.all([
    generateAccessToken({username: user.username, expiresAt: accessExpires}),
    generateRefreshToken({username: user.username, expiresAt: refreshExpires})
  ])
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: refreshExpires
    }
  })
  cookieStore.set('accessToken', accessToken, {
    httpOnly: true,
    secure: true,
    expires: accessExpires,
    sameSite: 'lax',
    path: '/'
  })
  cookieStore.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    expires: refreshExpires,
    sameSite: 'lax',
    path: '/'
  })
}

export async function refreshSession(oldRefreshToken: string) {
  const payload = await decrypt(oldRefreshToken)
  if (payload) {
    const user = await prisma.user.findUnique({
      where: {username: payload?.username as string || ''}
    })
    if (user) {
      await Promise.all([
        prisma.refreshToken.deleteMany({where: {token: oldRefreshToken}}),
        createSession(user)
      ])
    }
  }
}