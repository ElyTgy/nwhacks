"use server";

import { NextResponse } from 'next/server'
import { createClient } from '../../lib/supabase/server'

export async function GET(request: Request) {
  // Get the code from URL parameters
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'  // Where to redirect after login

  if (code) {
    const supabase = await createClient()
    console.log(code);
    
    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Handle different environments (development/production)
      const forwardedHost = request.headers.get('x-forwarded-host')
      
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        // Handle production with load balancer
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // If there's an error, redirect to error page
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}