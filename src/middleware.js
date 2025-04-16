import { NextResponse } from 'next/server'

export function middleware(request) {
  const url = request.nextUrl.clone()
  
  // Check if this is a Midtrans redirect with success parameters
  if (url.search.includes('transaction_status=settlement') || 
      url.search.includes('transaction_status=capture') ||
      url.search.includes('status=success')) {
    
    // Redirect to our payment handler
    return NextResponse.redirect(new URL('/payment-handler', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}