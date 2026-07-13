import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login'
  const isSociosDashboardRoute = pathname.startsWith('/socios/dashboard')

  // No hay usuario logueado y la ruta requiere sesión
  if (!user && (isAdminRoute || isSociosDashboardRoute)) {
    const redirectUrl = new URL(
      isAdminRoute ? '/admin/login' : '/socios/login',
      request.url
    )
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Si la ruta es de admin, comprobar que el email está en la lista de admins
  if (user && isAdminRoute) {
    const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)

    if (!user.email || !adminEmails.includes(user.email.toLowerCase())) {
      const redirectUrl = new URL('/', request.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Si ya está logueado y va a login, redirigir a su dashboard
  if (user && (pathname === '/socios/login' || pathname === '/admin/login')) {
    const redirectUrl = new URL(
      pathname === '/admin/login' ? '/admin' : '/socios/dashboard',
      request.url
    )
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/socios/dashboard/:path*',
    '/socios/login',
  ],
}
