// src/routes/dashboard/settings/+server.js
import { json } from '@sveltejs/kit';
import { models } from '$lib/server/models/index';
import bcrypt from 'bcrypt';

/**
 * GET handler for fetching all users or a single user
 * - GET /api/users - Returns all users
 * - GET /api/users?id=123 - Returns a specific user
 */
export async function GET({ url }) {
  const userId = url.searchParams.get('id');
  // If an ID is provided, fetch a specific user
  if (userId) {
    try {
      const user = await models.AdminUser.findByPk(userId);
      if (!user) {
        return json({ error: 'Gebruiker niet gevonden' }, { status: 404 });
      }
      // Return user data without password_hash
      const userData = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        created_at: user.created_at
      };
      return json(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
      return json({ error: 'Er is een fout opgetreden bij het ophalen van de gebruiker' }, { status: 500 });
    }
  }
  // Otherwise, fetch all users
  else {
    try {
      const users = await models.AdminUser.findAll({
        attributes: ['id', 'username', 'email', 'role', 'created_at']
      });
      return json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      return json({ error: 'Er is een fout opgetreden bij het ophalen van gebruikers' }, { status: 500 });
    }
  }
}

/**
 * POST handler for creating a new user
 * Expects request body with user data
 */
export async function POST({ request }) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.username || !data.email || !data.password) {
      return json({
        error: 'Gebruikersnaam, e-mailadres en wachtwoord zijn verplicht'
      }, { status: 400 });
    }

    // Check if username already exists
    const existingUser = await models.AdminUser.findOne({
      where: { username: data.username }
    });

    if (existingUser) {
      return json({
        error: 'Gebruikersnaam bestaat al'
      }, { status: 400 });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(data.password, saltRounds);

    // Create new user
    const newUser = await models.AdminUser.create({
      username: data.username,
      email: data.email,
      password_hash: passwordHash,
      role: data.role || 'moderator'
    });

    // Return new user data without password_hash
    const userData = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      created_at: newUser.created_at
    };

    return json(userData, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return json({
      error: 'Er is een fout opgetreden bij het aanmaken van de gebruiker'
    }, { status: 500 });
  }
}

/**
 * PATCH handler for updating a user
 * Expects request body with user data including ID
 */
export async function PATCH({ request }) {
  try {
    const data = await request.json();
    const userId = data.id;
    // Validate request data
    if (!userId) {
      return json({ error: 'Gebruiker ID is vereist' }, { status: 400 });
    }
    // Find the user
    const user = await models.AdminUser.findByPk(userId);
    if (!user) {
      return json({ error: 'Gebruiker niet gevonden' }, { status: 404 });
    }
    // Update user fields if provided
    if (data.username) user.username = data.username;
    if (data.email) user.email = data.email;
    if (data.role) user.role = data.role;
    // Handle password update if provided
    if (data.password) {
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(data.password, saltRounds);
      user.password_hash = passwordHash;
    }
    // Save changes
    await user.save();
    // Return updated user data without password_hash
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      created_at: user.created_at
    };
    return json(userData);
  } catch (error) {
    console.error('Error updating user:', error);
    return json({ error: 'Er is een fout opgetreden bij het bijwerken van de gebruiker' }, { status: 500 });
  }
}

/**
 * DELETE handler for removing a user
 * - DELETE /api/users?id=123 - Deletes a specific user
 */
export async function DELETE({ url }) {
  try {
    const userId = url.searchParams.get('id');
    if (!userId) {
      return json({ error: 'Gebruiker ID is vereist' }, { status: 400 });
    }
    // Find the user
    const user = await models.AdminUser.findByPk(userId);
    if (!user) {
      return json({ error: 'Gebruiker niet gevonden' }, { status: 404 });
    }
    // Delete the user (soft delete since paranoid: true is set in the model)
    await user.destroy();
    return json({
      success: true,
      message: 'Gebruiker succesvol verwijderd'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return json({ error: 'Er is een fout opgetreden bij het verwijderen van de gebruiker' }, { status: 500 });
  }
}
