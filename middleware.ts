import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse, NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // if user is signed in and the current path is /, redirect the user to /home
  if (user && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/home', req.url))
  }

  // if user is not signed in and the current path is not / or starts with /forms, redirect the user to /auth 
  // Note: This'll match /forms/new, which isn't what we want. We'll fix this later.
  if (!user && req.nextUrl.pathname !== '/' && !req.nextUrl.pathname.startsWith('/forms')) {
    return NextResponse.redirect(new URL('/auth', req.url))
  }

  return res
}

export const config = {
  matcher: ['/', '/home', '/forms'],
}