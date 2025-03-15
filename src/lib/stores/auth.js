// src/lib/stores/auth.js
import { writable } from 'svelte/store';

export const user = writable(null);

export async function logout() {
  try {
    await fetch('/api/auth/logout', { 
      method: 'POST' 
    });
    user.set(null);
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout error:', error);
  }
}