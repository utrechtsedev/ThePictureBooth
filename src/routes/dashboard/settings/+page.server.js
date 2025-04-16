// src/routes/dashboard/settings/+page.server.js
import { models } from '$lib/server/models/index';
import { error } from '@sveltejs/kit';

export async function load({ fetch }) {
  try {
    // Fetch all admin users with password_hash excluded
    const adminUsers = await models.AdminUser.findAll({
      attributes: { exclude: ['password_hash'] }
    });

    // Map the admin users to a clean format for the frontend
    const mappedAdmins = adminUsers.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at
    }));

    return {
      adminusers: mappedAdmins
    };
  } catch (err) {
    console.error('Error loading admin users:', err);
    throw error(500, 'Er is een fout opgetreden bij het laden van gebruikers');
  }
}
