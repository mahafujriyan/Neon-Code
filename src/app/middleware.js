import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const url = req.nextUrl.clone();

  // Not logged in
  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const role = token.role;

  // Role-based access
  if (url.pathname.startsWith("/dashboard/admin") && role !== "admin") {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (url.pathname.startsWith("/dashboard/manager") && role !== "manager") {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
