import { getDashboardData } from '@/lib/actions/dashboard';
import AdminClient from './admin-client';

export default async function AdminPage() {
  const data = await getDashboardData();

  return (
    <div className="admin-light-mode">
      <AdminClient initialData={data} />
    </div>
  );
}