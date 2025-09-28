import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { db } from '@workspace/db';

const PROTECTED = ['/app', '/api/chat'];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  if (!PROTECTED.some(p => path.startsWith(p))) {
    return NextResponse.next();
  }

  const token = await getToken({ req });
  if (!token?.sub) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  const sub = await db.subscription.findUnique({ 
    where: { userId: token.sub } 
  });
  
  const now = new Date();
  const active = sub && sub.status === 'active' && sub.currentPeriodEnd && sub.currentPeriodEnd > now;
  const inGrace = sub?.graceUntil && sub.graceUntil > now;

  if (!active && !inGrace) {
    return NextResponse.redirect(new URL('/billing/locked', req.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};
