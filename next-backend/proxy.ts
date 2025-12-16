import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const USERNAME = process.env.USER_NAME
const PASSWORD = process.env.PASSWORD

export default function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api')) {
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      const authValue = authHeader.split(' ')[1];
      const [user, pwd] = atob(authValue).split(':');
      if (user === USERNAME && pwd === PASSWORD) {
        return NextResponse.next();
      }
    }

    return new NextResponse('Authentication Required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};