// src/routes/api/auth/password/+server.js
import { json } from '@sveltejs/kit';
import { models } from '$lib/server/models/index';
import bcrypt from 'bcrypt';

/**
 * PATCH handler for changing a user's password
 * Expects request body with:
 * - userId: The ID of the user
 * - currentPassword: The current password for verification
 * - newPassword: The new password to set
 */
export async function PATCH({ request }) {
  try {
    const data = await request.json();
    const { userId, currentPassword, newPassword, confirmPassword } = data;

    // Validate required fields
    if (!userId || !currentPassword || !newPassword) {
      return json({
        success: false,
        error: 'Alle velden zijn verplicht'
      }, { status: 400 });
    }

    // Verify passwords match if confirmation is provided
    if (confirmPassword && newPassword !== confirmPassword) {
      return json({
        success: false,
        error: 'Nieuwe wachtwoorden komen niet overeen'
      }, { status: 400 });
    }

    // Find the user
    const user = await models.AdminUser.findByPk(userId);
    if (!user) {
      return json({
        success: false,
        error: 'Gebruiker niet gevonden'
      }, { status: 404 });
    }

    // Verify current password
    const passwordValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!passwordValid) {
      return json({
        success: false,
        error: 'Huidig wachtwoord is onjuist'
      }, { status: 401 });
    }

    // Hash the new password with proper salt rounds
    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update the password
    user.password_hash = newPasswordHash;
    await user.save();

    return json({
      success: true,
      message: 'Wachtwoord succesvol bijgewerkt'
    });

  } catch (error) {
    console.error('Error changing password:', error);
    return json({
      success: false,
      error: 'Er is een fout opgetreden bij het wijzigen van het wachtwoord'
    }, { status: 500 });
  }
}
