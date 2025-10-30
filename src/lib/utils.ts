import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Driver, Rider, Match, UnmatchedRider } from '@/types/api';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhoneNumber(phone: string): string {
  // Format phone number for display
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

export function phoneHref(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `tel:+1${digits}`;
  return `tel:${digits || phone}`;
}

export function formatTime12h(time24: string | undefined | null): string {
  if (!time24) return '—';
  const match = /^(\d{1,2}):(\d{2})$/.exec(time24.trim());
  if (!match) return time24; // fallback if unexpected format
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${hours}:${minutes} ${ampm}`;
}

// Time preference removed

export function createMatches(drivers: Driver[], riders: Rider[]): { matches: Match[], unmatchedRiders: UnmatchedRider[] } {
  const matches: Match[] = [];
  const unmatchedRiders: UnmatchedRider[] = [];
  const usedRiderIds = new Set<number>();

  // Sort drivers by pickup area to group visually
  const sortedDrivers = [...drivers].sort((a, b) => a.pickup_area.localeCompare(b.pickup_area));

  for (const driver of sortedDrivers) {
    const driverMatches: Rider[] = [];
    let remainingSeats = driver.seats_available;

    // 1) Respect manual assignments first
    const alreadyAssignedRiders = riders.filter(rider => rider.driver_id === driver.id);
    for (const rider of alreadyAssignedRiders) {
      driverMatches.push(rider);
      usedRiderIds.add(rider.id);
      remainingSeats -= rider.seats_needed;
    }

    // 2) Auto-assign riders by pickup area priority until seats fill up
    if (remainingSeats > 0) {
      const sameAreaUnassigned = riders.filter(rider =>
        !usedRiderIds.has(rider.id) && !rider.driver_id && rider.pickup_area === driver.pickup_area
      );

      for (const rider of sameAreaUnassigned) {
        if (remainingSeats - rider.seats_needed < 0) break;
        driverMatches.push(rider);
        usedRiderIds.add(rider.id);
        remainingSeats -= rider.seats_needed;
        if (remainingSeats === 0) break;
      }
    }

    matches.push({
      driver,
      riders: driverMatches,
      total_seats_used: driver.seats_available - Math.max(0, remainingSeats),
      remaining_seats: Math.max(0, remainingSeats)
    });
  }

  // Riders left unassigned become unmatched
  for (const rider of riders) {
    if (!usedRiderIds.has(rider.id) && !rider.driver_id) {
      unmatchedRiders.push({
        ...rider,
        reason: 'No compatible driver found'
      });
    }
  }

  return { matches, unmatchedRiders };
}

export function getDashboardStats(drivers: Driver[], riders: Rider[], matches: Match[], unmatchedRiders: UnmatchedRider[]) {
  return {
    total_drivers: drivers.length,
    total_riders: riders.length,
    total_matches: matches.length,
    total_unmatched: unmatchedRiders.length,
    total_seats_available: drivers.reduce((sum, driver) => sum + driver.seats_available, 0),
    total_seats_needed: riders.reduce((sum, rider) => sum + rider.seats_needed, 0),
    total_seats_matched: matches.reduce((sum, match) => sum + match.total_seats_used, 0)
  };
}

// Maps integration utilities
export function getMapsUrl(address: string, type: 'directions' | 'search' = 'directions'): string {
  const encodedAddress = encodeURIComponent(address);
  if (type === 'directions') {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
}

export function getDestinationMapsUrl(): string {
  return getMapsUrl('10980 Washington Blvd, Culver City, CA 90232');
}

export function getPickupAreaMapsUrl(pickupArea: string): string {
  // Map pickup areas to specific addresses or general UCLA locations
  const areaMappings: { [key: string]: string } = {
    'Ackerman Turnaround': '404 Westwood Plaza, Los Angeles, CA 90095',
    'De Neve & Gayley Intersection': '475 Gayley Ave, Los Angeles, CA 90024',
    'Gayley Heights': 'Gayley Heights, Los Angeles, CA',
  };
  
  const address = areaMappings[pickupArea] || `${pickupArea}, UCLA, Los Angeles, CA`;
  return getMapsUrl(address);
}
