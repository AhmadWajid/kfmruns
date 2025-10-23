import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

export interface AdminTokenPayload {
  admin: boolean;
  iat?: number;
  exp?: number;
}

export function generateAdminToken(): string {
  const payload: AdminTokenPayload = { admin: true };
  return jwt.sign(payload, JWT_SECRET!, { expiresIn: '24h' });
}

export function verifyAdminToken(token: string): boolean {
  try {
    const decoded = jwt.verify(token, JWT_SECRET!) as unknown as AdminTokenPayload;
    return decoded.admin === true;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
}

export function verifyAdminPassword(password: string): boolean {
  // Simple password comparison for now - you can enhance this later
  return password === ADMIN_PASSWORD;
}

export function getAdminTokenFromRequest(request: NextRequest): string | null {
  // Check Authorization header first
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Fallback to cookie
  return request.cookies.get('adminToken')?.value || null;
}

export function isAdminAuthenticated(request: NextRequest): boolean {
  const token = getAdminTokenFromRequest(request);
  return token ? verifyAdminToken(token) : false;
}

// Helper function to create a proper password hash (for future use)
export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

// Helper function to verify hashed password (for future use)
export function verifyHashedPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}