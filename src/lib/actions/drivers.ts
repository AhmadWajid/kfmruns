'use server';

import { supabase } from '@/lib/supabase';
import { Driver } from '@/types/api';

export async function getDrivers(): Promise<Driver[]> {
  try {
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching drivers:', error);
      throw new Error('Failed to fetch drivers');
    }

    return data || [];
  } catch (error) {
    console.error('Error in getDrivers:', error);
    throw error;
  }
}

export async function createDriver(driverData: {
  name: string;
  phone_number: string;
  seats_available: number;
  pickup_area: string;
  leave_kfm_time: string;
  leave_ucla_time: string;
  notes?: string;
}): Promise<Driver> {
  try {
    // Validation
    const missingFields = [];
    if (!driverData.name?.trim()) missingFields.push('name');
    if (!driverData.phone_number?.trim()) missingFields.push('phone number');
    if (!driverData.seats_available) missingFields.push('seats available');
    if (!driverData.pickup_area?.trim()) missingFields.push('pickup area');
    if (!driverData.leave_kfm_time?.trim()) missingFields.push('time leaving KFM');
    if (!driverData.leave_ucla_time?.trim()) missingFields.push('time leaving UCLA');
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    if (driverData.seats_available < 1 || driverData.seats_available > 8) {
      throw new Error('Seats available must be between 1 and 8');
    }

    // no time preference validation

    // Insert driver
    const { data, error } = await supabase
      .from('drivers')
      .insert([
        {
          name: driverData.name,
          phone_number: driverData.phone_number,
          seats_available: driverData.seats_available,
          pickup_area: driverData.pickup_area,
          leave_kfm_time: driverData.leave_kfm_time,
          leave_ucla_time: driverData.leave_ucla_time,
          notes: driverData.notes || null
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating driver:', error);
      throw new Error('Failed to create driver');
    }

    return data;
  } catch (error) {
    console.error('Error in createDriver:', error);
    throw error;
  }
}

export async function deleteDriver(driverId: number): Promise<void> {
  try {
    if (!driverId) {
      throw new Error('Driver ID is required');
    }

    // First, unassign any riders from this driver
    await supabase
      .from('riders')
      .update({ driver_id: null })
      .eq('driver_id', driverId);

    // Then delete the driver
    const { error } = await supabase
      .from('drivers')
      .delete()
      .eq('id', driverId);

    if (error) {
      console.error('Error deleting driver:', error);
      throw new Error('Failed to delete driver');
    }
  } catch (error) {
    console.error('Error in deleteDriver:', error);
    throw error;
  }
}
