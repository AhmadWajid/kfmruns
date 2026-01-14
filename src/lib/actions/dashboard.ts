'use server';

import { supabase } from '@/lib/supabase';
import { getDashboardStats } from '@/lib/utils';
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

    // Create matches for ALL drivers, but only include riders that have been manually assigned (have driver_id set)
    // This ensures all drivers are shown, even if they have no assigned riders yet
    const confirmedMatches = drivers.map(driver => {
      const driverIdNum = typeof driver.id === 'string' ? parseInt(driver.id, 10) : driver.id;
      
      // Only include riders that have this driver's ID set in the database
      const assignedRiders = riders.filter(rider => {
        const riderDriverId = rider.driver_id ? (typeof rider.driver_id === 'string' ? parseInt(rider.driver_id, 10) : rider.driver_id) : null;
        return riderDriverId === driverIdNum;
      });

      const usedSeats = assignedRiders.reduce((sum, rider) => sum + rider.seats_needed, 0);
      const remainingSeats = Math.max(0, driver.seats_available - usedSeats);

      return {
        driver,
        riders: assignedRiders,
        total_seats_used: usedSeats,
        remaining_seats: remainingSeats
      };
    });

    // Recalculate unmatched riders - only show riders without driver_id
    const confirmedUnmatchedRiders = riders
      .filter(rider => {
        const riderDriverId = rider.driver_id ? (typeof rider.driver_id === 'string' ? parseInt(rider.driver_id, 10) : rider.driver_id) : null;
        return !riderDriverId;
      })
      .map(rider => ({
        ...rider,
        reason: 'No compatible driver found'
      }));

    // Get dashboard statistics using confirmed matches
    const stats = getDashboardStats(drivers, riders, confirmedMatches, confirmedUnmatchedRiders);

    const dashboardData: DashboardData = {
      drivers,
      riders,
      matches: confirmedMatches,
      unmatched_riders: confirmedUnmatchedRiders,
      ...stats
    };

    return dashboardData;
  } catch (error) {
    console.error('Error in getDashboardData:', error);
    throw error;
  }
}
