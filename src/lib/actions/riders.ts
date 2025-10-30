'use server';

import { supabase } from '@/lib/supabase';
import { Rider } from '@/types/api';

export async function getRiders(): Promise<Rider[]> {
  try {
    const { data, error } = await supabase
      .from('riders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching riders:', error);
      throw new Error('Failed to fetch riders');
    }

    return data || [];
  } catch (error) {
    console.error('Error in getRiders:', error);
    throw error;
  }
}

export async function createRider(riderData: {
  name: string;
  phone_number: string;
  seats_needed: number;
  pickup_area: string;
  notes?: string;
}): Promise<Rider> {
  try {
    // Validation
    if (!riderData.name || !riderData.phone_number || !riderData.pickup_area) {
      throw new Error('Missing required fields');
    }

    const seatsNeeded = riderData.seats_needed || 1;
    if (seatsNeeded < 1 || seatsNeeded > 8) {
      throw new Error('Seats needed must be between 1 and 8');
    }

    // no time preference validation

    // Insert rider
    const { data, error } = await supabase
      .from('riders')
      .insert([
        {
          name: riderData.name,
          phone_number: riderData.phone_number,
          seats_needed: seatsNeeded,
          pickup_area: riderData.pickup_area,
          notes: riderData.notes || null
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating rider:', error);
      throw new Error('Failed to create rider');
    }

    return data;
  } catch (error) {
    console.error('Error in createRider:', error);
    throw error;
  }
}

export async function deleteRider(riderId: number): Promise<void> {
  try {
    if (!riderId) {
      throw new Error('Rider ID is required');
    }

    const { error } = await supabase
      .from('riders')
      .delete()
      .eq('id', riderId);

    if (error) {
      console.error('Error deleting rider:', error);
      throw new Error('Failed to delete rider');
    }
  } catch (error) {
    console.error('Error in deleteRider:', error);
    throw error;
  }
}

export async function assignRiderToDriver(riderId: number, driverId: number): Promise<void> {
  try {
    if (!riderId || !driverId) {
      throw new Error('Rider ID and Driver ID are required');
    }

    console.log(`Assigning rider ${riderId} to driver ${driverId}`);
    const { error } = await supabase
      .from('riders')
      .update({ driver_id: driverId })
      .eq('id', riderId);

    if (error) {
      console.error('Error assigning rider to driver:', error);
      throw new Error('Failed to assign rider to driver');
    }
    
    console.log('Rider assignment successful');
  } catch (error) {
    console.error('Error in assignRiderToDriver:', error);
    throw error;
  }
}

export async function unassignRider(riderId: number): Promise<void> {
  try {
    if (!riderId) {
      throw new Error('Rider ID is required');
    }

    const { error } = await supabase
      .from('riders')
      .update({ driver_id: null })
      .eq('id', riderId);

    if (error) {
      console.error('Error unassigning rider:', error);
      throw new Error('Failed to unassign rider');
    }
  } catch (error) {
    console.error('Error in unassignRider:', error);
    throw error;
  }
}

export async function fixOverAssignments(): Promise<void> {
  try {
    console.log('Checking for over-assignments...');
    
    // Get all drivers and their assigned riders
    const { data: drivers, error: driversError } = await supabase
      .from('drivers')
      .select('*');
    
    if (driversError) {
      throw new Error('Failed to fetch drivers');
    }
    
    for (const driver of drivers || []) {
      const { data: assignedRiders, error: ridersError } = await supabase
        .from('riders')
        .select('*')
        .eq('driver_id', driver.id);
      
      if (ridersError) {
        console.error(`Error fetching riders for driver ${driver.id}:`, ridersError);
        continue;
      }
      
      const usedSeats = (assignedRiders || []).reduce((sum, rider) => sum + rider.seats_needed, 0);
      
      if (usedSeats > driver.seats_available) {
        console.log(`Driver ${driver.name} is over-assigned: ${usedSeats} seats used, ${driver.seats_available} available`);
        
        // Unassign excess riders (keep the first ones, unassign the rest)
        const sortedRiders = (assignedRiders || []).sort((a, b) => a.id - b.id);
        let remainingSeats = driver.seats_available;
        
        for (let i = 0; i < sortedRiders.length; i++) {
          const rider = sortedRiders[i];
          if (remainingSeats >= rider.seats_needed) {
            remainingSeats -= rider.seats_needed;
          } else {
            // Unassign this rider and all subsequent ones
            console.log(`Unassigning rider ${rider.name} due to over-assignment`);
            await supabase
              .from('riders')
              .update({ driver_id: null })
              .eq('id', rider.id);
          }
        }
      }
    }
    
    console.log('Over-assignment check completed');
  } catch (error) {
    console.error('Error fixing over-assignments:', error);
    throw error;
  }
}

export async function clearAllData(): Promise<void> {
  try {
    console.log('Clearing all data from database...');
    
    // First, unassign all riders from drivers (only those that have a driver_id)
    const { error: unassignError } = await supabase
      .from('riders')
      .update({ driver_id: null })
      .not('driver_id', 'is', null);
    
    if (unassignError) {
      console.error('Error unassigning riders:', unassignError);
      throw new Error('Failed to unassign riders');
    }
    
    // Delete all riders
    const { error: ridersError } = await supabase
      .from('riders')
      .delete()
      .neq('id', 0); // Delete all rows
    
    if (ridersError) {
      console.error('Error deleting riders:', ridersError);
      throw new Error('Failed to delete riders');
    }
    
    // Delete all drivers
    const { error: driversError } = await supabase
      .from('drivers')
      .delete()
      .neq('id', 0); // Delete all rows
    
    if (driversError) {
      console.error('Error deleting drivers:', driversError);
      throw new Error('Failed to delete drivers');
    }
    
    console.log('All data cleared successfully');
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
}
