// src/hooks.server.js
import { verifyToken } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  // Get the auth token from cookies
  const authToken = event.cookies.get('authToken');
  
  // Set default authentication status
  event.locals.user = null;
  
  // Check if path starts with /dashboard
  const isProtectedRoute = event.url.pathname.startsWith('/dashboard');
  
  if (isProtectedRoute) {
    // Verify token if it exists
    if (authToken) {
      const userData = verifyToken(authToken);
      if (userData) {
        // Add user data to locals if token is valid
        event.locals.user = userData;
      } else {
        // Token is invalid, redirect to login
        throw redirect(303, '/login?redirectTo=' + encodeURIComponent(event.url.pathname));
      }
    } else {
      // No token found, redirect to login
      throw redirect(303, '/login?redirectTo=' + encodeURIComponent(event.url.pathname));
    }
  } else if (authToken) {
    // For non-protected routes, still verify and set user if token exists
    const userData = verifyToken(authToken);
    if (userData) {
      event.locals.user = userData;
    }
  }

  return await resolve(event);
}