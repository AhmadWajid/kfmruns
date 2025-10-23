import { getDashboardData } from '@/lib/actions/dashboard';
import DashboardClient from './dashboard-client';

export default async function DashboardPage() {
  const data = await getDashboardData();

  return <DashboardClient initialData={data} />;
}

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic';