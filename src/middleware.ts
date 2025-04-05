import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const refreshTokenCookie = cookieStore.get('refresh_token');
  const token = await getToken({ req: request });
  const pathname = request.nextUrl.pathname;
  const response = NextResponse.next();

  if (refreshTokenCookie?.value) {
    response.headers.set('Cookie', `refresh_token=${refreshTokenCookie.value}`);
  }

  if (pathname === "/" || pathname === "/signup") {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return response;
  }

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/api/v1/")) {
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (pathname.startsWith("/api/v1/")) {
      try {
        const apiHeaders = {
          ...Object.fromEntries(request.headers),
          Cookie: response.headers.get('Cookie') || '',
        };

        const apiResponse = await fetch(request.url, {
          method: request.method,
          headers: apiHeaders,
          body: request.body,
          credentials: 'include',
        });

        return new Response(apiResponse.body, {
          status: apiResponse.status,
          statusText: apiResponse.statusText,
          headers: response.headers
        });
      } catch {
        return response;
      }
    }
    return response;
  }
  return response;
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/signup',
    '/api/v1/:path*'
  ]
};
