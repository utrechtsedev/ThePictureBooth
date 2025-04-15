// src/routes/api/auth/login/+server.js
import { json } from '@sveltejs/kit';
import { createToken, COOKIE_OPTIONS } from '$lib/server/auth';
import bcrypt from 'bcrypt';
import { models } from '$lib/server/models/index.js'; // TODO: change to: '$lib/server/models/index'

export async function POST({ request, cookies }) {
  try {
    const { email, password } = await request.json();

    // Find user in your existing database
    const user = await models.AdminUser.findOne({ where: { email } });

    if (!user) {
      return json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    // Verify password (assuming you store hashed passwords)
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    // Create token
    const token = createToken(user);

    // Set cookie
    cookies.set('authToken', token, COOKIE_OPTIONS);

    return json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
        // Add other non-sensitive user data you want to return
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return json({ success: false, message: error.message }, { status: 500 });
  }
}
