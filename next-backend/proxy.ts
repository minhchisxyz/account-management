import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import {cookies} from "next/headers";
import {decrypt, refreshSession} from "@/app/lib/session";

const USERNAME = process.env.USER_NAME
const PASSWORD = process.env.PASSWORD

const protectedRoutes = ['/', '/currency', '/years', '/transactions']

export default async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api')) {
    const authHeader = request.headers.get('authorization')
    if (authHeader) {
      const authValue = authHeader.split(' ')[1]
      const [user, pwd] = atob(authValue).split(':')
      if (user === USERNAME && bcrypt.compareSync(pwd, PASSWORD || '')) {
        return NextResponse.next()
      }
    }

    return new NextResponse('Authentication Required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    })
  }
  const isProtectedRoute = protectedRoutes.includes(request.nextUrl.pathname)
  if (isProtectedRoute) {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value
    const accessPayload = await decrypt(accessToken)
    if (!accessPayload) {
      const refreshToken = cookieStore.get('refreshToken')?.value
      const refreshPayload = await decrypt(refreshToken)
      if (!refreshPayload || !refreshToken) return NextResponse.redirect(new URL('/login', request.nextUrl))
      await refreshSession(refreshToken)
      return NextResponse.next()
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|login|_next/static|_next/image|.*\\.png$).*)'],
}