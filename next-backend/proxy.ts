import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const USERNAME = process.env.USER_NAME
const PASSWORD = process.env.PASSWORD

export default function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api')) {
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      const authValue = authHeader.split(' ')[1];
      console.log(USERNAME)
      const [user, pwd] = atob(authValue).split(':');
      console.log(user, USERNAME)
      console.log(user === USERNAME)
      console.log(pwd === PASSWORD)
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