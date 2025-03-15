// src/routes/api/auth/logout/+server.js
import { json } from '@sveltejs/kit';
import { COOKIE_OPTIONS } from '$lib/server/auth';

export async function POST({ cookies }) {
  cookies.delete('authToken', { path: '/' });
  return json({ success: true });
}