'use server';

import { supabase } from '@/lib/supabase';
import { createMatches, getDashboardStats } from '@/lib/utils';
import { DashboardData } from '@/types/api';

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
