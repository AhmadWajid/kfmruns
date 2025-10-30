import { getDashboardData, getAppState } from '@/lib/actions/dashboard';
import DashboardClient from './dashboard-client';

export default async function DashboardPage() {
  const [{ is_finalized }, data] = await Promise.all([
    getAppState(),
    getDashboardData()
  ]);

  if (!is_finalized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Dashboard is private</h1>
          <p className="text-gray-600">The admin will publish rides once finalized. Please check back later.</p>
        </div>
      </div>
    );
  }

  return <DashboardClient initialData={data} />;
}

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic';