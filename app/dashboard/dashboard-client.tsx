'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Car, Users, MapPin, Clock, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DashboardData } from '@/types/api';
import { formatPhoneNumber, phoneHref, formatTime12h, getPickupAreaMapsUrl } from '@/lib/utils';
import { getDashboardData } from '@/lib/actions/dashboard';

interface DashboardClientProps {
  initialData: DashboardData;
}

export default function DashboardClient({ initialData }: DashboardClientProps) {
  const [data, setData] = useState<DashboardData>(initialData);
  const [refreshing, setRefreshing] = useState(false);

  // Auto-refresh data on component mount to ensure fresh data
  useEffect(() => {
    const refreshData = async () => {
      try {
        const newData = await getDashboardData();
        setData(newData);
      } catch (error) {
        console.error('Error auto-refreshing dashboard data:', error);
      }
    };
    
    refreshData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const newData = await getDashboardData();
      setData(newData);
    } catch (error) {
      console.error('Error refreshing dashboard data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4">
        {/* Responsive Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 mb-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 text-center">
              <div className="flex items-center justify-center">
                <Car className="h-4 w-4 text-blue-600 mr-1" />
                <span className="text-lg font-bold text-blue-600">{data.total_drivers}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">Drivers</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 text-center">
              <div className="flex items-center justify-center">
                <Users className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-lg font-bold text-green-600">{data.total_riders}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">Riders</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 text-center">
              <div className="flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-purple-600 mr-1" />
                <span className="text-lg font-bold text-purple-600">{data.total_matches}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">Matches</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 text-center">
              <div className="flex items-center justify-center">
                <AlertCircle className="h-4 w-4 text-orange-600 mr-1" />
                <span className="text-lg font-bold text-orange-600">{data.total_unmatched}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">Unmatched</p>
            </CardContent>
          </Card>
        </div>

        {/* Compact Matches Section - styled similar to Admin page */}
        {data.matches.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Matches</h2>
            <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
              {data.matches.map((match: any, index: number) => {
                const usedSeats = match.riders.reduce((sum: number, r: any) => sum + r.seats_needed, 0);
                const totalPeople = 1 + usedSeats; // Driver + passengers
                const totalCapacity = 1 + (match.driver.seats_available ?? 0);
                return (
                  <Card key={index} className="border-0 shadow-sm bg-blue-50/30">
                    <CardContent className="p-4 relative">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-3 space-y-2 lg:space-y-0 pr-28">
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 truncate text-sm">{match.driver.name}</h3>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 text-xs text-gray-600">
                              <a href={phoneHref(match.driver.phone_number)} className="font-medium text-blue-700 hover:underline">{formatPhoneNumber(match.driver.phone_number)}</a>
                              <span className="hidden sm:inline">•</span>
                              <div className="flex items-center space-x-1">
                                <span className="truncate">📍 {match.driver.pickup_area}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => window.open(getPickupAreaMapsUrl(match.driver.pickup_area), '_blank')}
                                  className="h-3 w-3 p-0 text-blue-600 hover:bg-blue-100"
                                >
                                  <MapPin className="h-2 w-2" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between lg:justify-end space-x-2">
                          <Badge className="text-xs">
                            KFM: {formatTime12h(match.driver.leave_kfm_time)} • UCLA: {formatTime12h(match.driver.leave_ucla_time)}
                          </Badge>
                          <div className="flex items-center space-x-2 absolute top-3 right-3">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${totalPeople > totalCapacity 
                                ? "text-red-700 border-red-300 bg-red-50" 
                                : "text-blue-700 border-blue-300"
                              }`}
                            >
                              {totalPeople}/{totalCapacity}
                              {totalPeople > totalCapacity && " ⚠️"}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {match.riders.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-xs font-medium text-gray-700 mb-2">
                            Passengers ({match.riders.length})
                          </h4>
                          <div className="space-y-1">
                            {match.riders.map((rider: any, riderIndex: number) => (
                              <div key={riderIndex} className="bg-blue-50 rounded p-2 border border-blue-100 relative">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center space-x-1 min-w-0">
                                        <Users className="h-3 w-3 text-blue-600 shrink-0" />
                                        <p className="font-medium text-gray-900 truncate text-xs">{rider.name}</p>
                                      </div>
                                      <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 text-xs text-gray-600">
                                        <a href={phoneHref(rider.phone_number)} className="font-medium text-blue-700 hover:underline">📞 {formatPhoneNumber(rider.phone_number)}</a>
                                        <span className="hidden sm:inline">•</span>
                                        <div className="flex items-center space-x-1 truncate">
                                          <span>📍 {rider.pickup_area}</span>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => window.open(getPickupAreaMapsUrl(rider.pickup_area), '_blank')}
                                            className="h-3 w-3 p-0 text-blue-600 hover:bg-blue-100"
                                          >
                                            <MapPin className="h-2 w-2" />
                                          </Button>
                                        </div>
                                      </div>
                                      {rider.seats_needed > 1 && (
                                        <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                                          <span>Seats: {rider.seats_needed}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Compact Unmatched Riders - styled similar to Admin page */}
        {data.unmatched_riders.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Unmatched Riders</h2>
            <div className="grid gap-2 lg:grid-cols-2 xl:grid-cols-3">
              {data.unmatched_riders.map((rider: any, index: number) => (
                <Card key={index} className="border-0 shadow-sm bg-orange-50/30">
                  <CardContent className="p-3 relative">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-2 lg:space-y-0 pr-14">
                      <div className="flex items-center space-x-2">
                        <div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4 text-gray-700" />
                            <p className="font-medium text-gray-900 text-sm">{rider.name}</p>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 text-xs text-gray-600">
                            <a href={phoneHref(rider.phone_number)} className="font-medium text-blue-700 hover:underline">📞 {formatPhoneNumber(rider.phone_number)}</a>
                            <span className="hidden sm:inline">•</span>
                            <div className="flex items-center space-x-1">
                              <span>📍 {rider.pickup_area}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(getPickupAreaMapsUrl(rider.pickup_area), '_blank')}
                                className="h-3 w-3 p-0 text-blue-600 hover:bg-blue-100"
                              >
                                <MapPin className="h-2 w-2" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                            <span>Seats: {rider.seats_needed}</span>
                          </div>
                          {/* reason hidden on public dashboard */}
                        </div>
                      </div>
                      {rider.seats_needed > 1 && (
                        <div className="flex items-center space-x-2 absolute top-3 right-3">
                          <Badge variant="outline" className="text-xs text-orange-700 border-orange-300">
                            {rider.seats_needed} seats
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Compact No Data State */}
        {data.matches.length === 0 && data.unmatched_riders.length === 0 && (
          <Card className="text-center border-0 shadow-sm">
            <CardContent className="py-8">
              <div className="text-4xl mb-3">🕌</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Rides</h3>
              <p className="text-sm text-gray-600 mb-4">
                No drivers or riders have registered yet. Be the first to offer or request a ride!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="sm" onClick={() => window.location.href = '/driver'}>
                  <Car className="mr-2 h-4 w-4" />
                  Offer a Ride
                </Button>
                <Button size="sm" variant="outline" onClick={() => window.location.href = '/rider'}>
                  <Users className="mr-2 h-4 w-4" />
                  Request a Ride
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

