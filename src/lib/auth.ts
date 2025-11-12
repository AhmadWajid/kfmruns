import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Trim quotes and whitespace from env variables to handle parsing issues
const JWT_SECRET = process.env.JWT_SECRET?.trim().replace(/^["']|["']$/g, '') || undefined;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH?.trim().replace(/^["']|["']$/g, '') || undefined;

// Debug: Log the raw environment variable (first 50 chars only for security)
if (ADMIN_PASSWORD_HASH) {
  console.log('[AUTH DEBUG] ADMIN_PASSWORD_HASH raw length:', ADMIN_PASSWORD_HASH.length);
  console.log('[AUTH DEBUG] ADMIN_PASSWORD_HASH first 30 chars:', ADMIN_PASSWORD_HASH.substring(0, 30));
  console.log('[AUTH DEBUG] ADMIN_PASSWORD_HASH last 10 chars:', ADMIN_PASSWORD_HASH.substring(ADMIN_PASSWORD_HASH.length - 10));
  // Check if hash appears truncated (should be 60 chars for bcrypt)
  if (ADMIN_PASSWORD_HASH.length < 60) {
    console.warn('[AUTH WARNING] Hash length is less than 60 characters. Full hash may not be loaded.');
    console.warn('[AUTH WARNING] Full value received:', ADMIN_PASSWORD_HASH);
  }
}

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
  if (!ADMIN_PASSWORD_HASH) {
    console.error('ADMIN_PASSWORD_HASH environment variable is not set');
    return false;
  }
  
  // Validate hash format
  const isValidBcryptHash = ADMIN_PASSWORD_HASH.startsWith('$2') && ADMIN_PASSWORD_HASH.length === 60;
  
  if (!isValidBcryptHash) {
    console.error('❌ INVALID HASH FORMAT DETECTED!');
    console.error('Hash length:', ADMIN_PASSWORD_HASH.length, '(should be 60)');
    console.error('Hash starts with:', ADMIN_PASSWORD_HASH.substring(0, 10), '(should start with $2a$, $2b$, or $2y$)');
    console.error('⚠️  The ADMIN_PASSWORD_HASH environment variable contains an invalid bcrypt hash.');
    console.error('⚠️  Please run: node scripts/generate-password.js "your-password"');
    console.error('⚠️  Then copy the FULL hash (60 characters starting with $2) to your .env.local file');
    return false;
  }
  
  // Debug logging (without exposing full hash)
  console.log('Verifying password against hash:', ADMIN_PASSWORD_HASH.substring(0, 20) + '...');
  console.log('Hash length:', ADMIN_PASSWORD_HASH.length, '✓');
  console.log('Hash format:', ADMIN_PASSWORD_HASH.substring(0, 7), '✓');
  
  const result = verifyHashedPassword(password, ADMIN_PASSWORD_HASH);
  console.log('Bcrypt comparison result:', result);
  
  return result;
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