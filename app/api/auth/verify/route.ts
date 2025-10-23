import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/actions/auth';

export async function GET() {
  try {
    console.log('=== API VERIFY ROUTE ===');
    const { authenticated } = await verifyAdmin();
    console.log('API verification result:', authenticated);
    return NextResponse.json({ authenticated });
  } catch (error) {
    console.error('Error in verify route:', error);
    return NextResponse.json({ authenticated: false });
  }
}