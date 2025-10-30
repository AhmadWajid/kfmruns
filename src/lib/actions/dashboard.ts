'use server';

import { supabase } from '@/lib/supabase';
import { createMatches, getDashboardStats } from '@/lib/utils';
import { DashboardData } from '@/types/api';

export async function getAppState(): Promise<{ is_finalized: boolean }> {
  const { data, error } = await supabase.from('app_state').select('is_finalized').eq('id', 1).single();
  if (error) {
    console.error('Error fetching app state:', error);
    return { is_finalized: false };
  }
  return { is_finalized: data?.is_finalized ?? false };
}

export async function setFinalized(isFinalized: boolean): Promise<void> {
  const { error } = await supabase
    .from('app_state')
    .upsert({ id: 1, is_finalized: isFinalized, updated_at: new Date().toISOString() }, { onConflict: 'id' });
  if (error) {
    console.error('Error updating app state:', error);
    throw new Error('Failed to update app state');
  }
}

export async function getDashboardData(): Promise<DashboardData> {
  try {
    // Fetch drivers and riders
    const [driversResult, ridersResult] = await Promise.all([
      supabase.from('drivers').select('*').order('created_at', { ascending: false }),
      supabase.from('riders').select('*').order('created_at', { ascending: false })
    ]);

    if (driversResult.error) {
      console.error('Error fetching drivers:', driversResult.error);
      throw new Error('Failed to fetch drivers');
    }

    if (ridersResult.error) {
      console.error('Error fetching riders:', ridersResult.error);
      throw new Error('Failed to fetch riders');
    }

    const drivers = driversResult.data || [];
    const riders = ridersResult.data || [];

    // Create matches using the smart matching algorithm
    const { matches, unmatchedRiders } = createMatches(drivers, riders);

    // Get dashboard statistics
    const stats = getDashboardStats(drivers, riders, matches, unmatchedRiders);

    const dashboardData: DashboardData = {
      drivers,
      riders,
      matches,
      unmatched_riders: unmatchedRiders,
      ...stats
    };

    return dashboardData;
  } catch (error) {
    console.error('Error in getDashboardData:', error);
    throw error;
  }
}
