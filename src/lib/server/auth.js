// src/lib/server/auth.js
import jwt from 'jsonwebtoken';
import { dev } from '$app/environment';
import dotenv from 'dotenv'; dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export const COOKIE_OPTIONS = {
  httpOnly: true,
  path: '/',
  secure: !dev,
  sameSite: 'strict',
  maxAge: 60 * 60 * 24 * 7 // 1 week
};
