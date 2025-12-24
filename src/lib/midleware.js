import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  
  if (pathname.startsWith('/dashboard')) {
    

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'], // শুধুমাত্র ড্যাশবোর্ড এরিয়াতে এই চেক চলবে
};