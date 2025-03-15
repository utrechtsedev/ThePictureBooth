// src/routes/dashboard/+layout.server.js
export async function load({ locals }) {
    // The user data from the JWT is already in locals.user from our hooks
    return {
      user: locals.user || null
    };
  }