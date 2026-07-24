import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const supabaseResponse = NextResponse.next({ request });

    const pathname = request.nextUrl.pathname;

    // Allow public routes and static assets
    const publicRoutes = ['/login', '/register', '/forgot-password'];
    const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

    // Only check auth for protected routes
    const isProtectedRoute = pathname.startsWith('/profile');

    // If it's a public route or not a protected route, skip auth check
    if (isPublicRoute || !isProtectedRoute) {
        return supabaseResponse;
    }

    // Try to get the user from Supabase
    try {
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            supabaseResponse.cookies.set(name, value, options)
                        );
                    },
                },
            }
        );

        const {
            data: { user },
        } = await supabase.auth.getUser();

        // Redirect unauthenticated users to login
        if (!user) {
            const url = request.nextUrl.clone();
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }

        // Redirect authenticated users away from login/register
        if (isPublicRoute && user) {
            const url = request.nextUrl.clone();
            url.pathname = '/';
            return NextResponse.redirect(url);
        }
    } catch (err) {
        // If Supabase fails, allow the request to proceed
        // (fail open — don't block users due to auth service issues)
        console.error('Middleware auth error:', err);
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
