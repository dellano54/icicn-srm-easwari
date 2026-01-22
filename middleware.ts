import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/session';

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = path.startsWith('/dashboard') || path.startsWith('/admin') || path.startsWith('/reviewer');
  const isPublicRoute = path === '/login' || path === '/' || path === '/register' || path.startsWith('/system/login');

  if (isProtectedRoute) {
    const cookie = req.cookies.get('session')?.value;
    const session = await decrypt(cookie);

    if (!session?.userId) {
      return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    if (path.startsWith('/admin') && session.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', req.nextUrl)); // Or 403
    }

    if (path.startsWith('/reviewer') && session.role !== 'reviewer') {
      return NextResponse.redirect(new URL('/login', req.nextUrl));
    }
    
    // User trying to access dashboard
    if (path.startsWith('/dashboard') && session.role !== 'user' && !path.startsWith('/admin')) {
       // Allow admins to view dashboard? Usually admins have their own.
       // The /dashboard route is for TEAMS (role: user).
       // If an admin tries to go to /dashboard, maybe redirect to /admin/dashboard?
       if (session.role === 'admin') return NextResponse.redirect(new URL('/admin/dashboard', req.nextUrl));
       if (session.role === 'reviewer') return NextResponse.redirect(new URL('/reviewer/dashboard', req.nextUrl));
    }
  }

  if (isPublicRoute) {
     const cookie = req.cookies.get('session')?.value;
     const session = await decrypt(cookie);
     if (session?.userId) {
        if (session.role === 'admin') return NextResponse.redirect(new URL('/admin/dashboard', req.nextUrl));
        if (session.role === 'reviewer') return NextResponse.redirect(new URL('/reviewer/dashboard', req.nextUrl));
        if (session.role === 'user' && path !== '/') return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
     }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
