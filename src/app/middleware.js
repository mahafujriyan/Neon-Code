import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const url = req.nextUrl.clone();

  // ১. লগইন করা না থাকলে লগইন পেজে পাঠিয়ে দেবে
  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const role = token.role;


  if (url.pathname.startsWith("/dashboard/admin") && role !== "admin") {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/admin/:path*"], 
};