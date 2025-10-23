'use server';

import { cookies } from 'next/headers';
import { verifyAdminPassword, generateAdminToken, verifyAdminToken } from '@/lib/auth';

export async function loginAdmin(password: string): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('=== ADMIN LOGIN ATTEMPT ===');
    console.log('Password received:', password);
    
    if (!password) {
      return { success: false, error: 'Password is required' };
    }

    const isValidPassword = verifyAdminPassword(password);
    console.log('Password verification result:', isValidPassword);

    if (!isValidPassword) {
      console.log('Login failed: Invalid password');
      return { success: false, error: 'Invalid password' };
    }

    const token = generateAdminToken();
    console.log('Token generated successfully');
    
    const cookieStore = await cookies();
    cookieStore.set('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 // 24 hours
    });

    console.log('Cookie set successfully');
    console.log('=== LOGIN SUCCESS ===');
    return { success: true };
  } catch (error) {
    console.error('Error in loginAdmin:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function logoutAdmin(): Promise<{ success: boolean }> {
  try {
    const cookieStore = await cookies();
    cookieStore.set('adminToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0
    });

    console.log('Admin logged out successfully');
    return { success: true };
  } catch (error) {
    console.error('Error in logoutAdmin:', error);
    return { success: false };
  }
}

export async function verifyAdmin(): Promise<{ authenticated: boolean }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('adminToken')?.value;
    
    console.log('=== VERIFY ADMIN ===');
    console.log('Token found:', token ? 'YES' : 'NO');
    
    if (!token) {
      console.log('No token found');
      return { authenticated: false };
    }

    const authenticated = verifyAdminToken(token);
    console.log('Token verification result:', authenticated);
    console.log('=== VERIFY COMPLETE ===');
    return { authenticated };
  } catch (error) {
    console.error('Error in verifyAdmin:', error);
    return { authenticated: false };
  }
}