import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    if (
      req.nextUrl.pathname.startsWith("/crm") &&
      req.nextauth.token?.role !== "admin" &&
      req.nextauth.token?.role !== "sales"
    ) {
      return NextResponse.rewrite(new URL("/auth/unauthorized", req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
)

export const config = { matcher: ["/crm/:path*"] }

