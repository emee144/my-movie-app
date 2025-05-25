import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken'; // You can use any JWT package here

export async function middleware(req) {
  const token = req.cookies.get('token')?.value; // Get the token from HTTP-only cookies

  // If there's no token, redirect to the login page
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    // Verify the JWT token using your secret key
    jwt.verify(token, process.env.JWT_SECRET); // Replace with your actual secret key
  } catch (err) {
    // If the token is invalid or expired, redirect to the login page
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // If everything is good, let the request continue
  return NextResponse.next();
}

// Define which routes this middleware should run on
export const config = {
  matcher: ['/dashboard', '/profile', '/settings'], // Protected routes
};
