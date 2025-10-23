'use client';

import { useState } from 'react';
import { RefreshCw, Car, Users, MapPin, Clock, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DashboardData } from '@/types/api';
import { formatPhoneNumber, formatTimePreference, getTimePreferenceColor, getPickupAreaMapsUrl } from '@/lib/utils';
import { getDashboardData } from '@/lib/actions/dashboard';

interface DashboardClientProps {
  initialData: DashboardData;
}

export default function DashboardClient({ initialData }: DashboardClientProps) {
  const [data, setData] = useState<DashboardData>(initialData);
  const [refreshing, setRefreshing] = useState(false);

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

        {/* Compact Matches Section */}
        {data.matches.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Matches</h2>
            <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
              {data.matches.map((match: any, index: number) => (
                <Card key={index} className={`border-0 shadow-sm ${match.riders.length > 0 ? "bg-green-50" : "bg-blue-50"}`}>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 space-y-2 sm:space-y-0">
                      <div className="flex items-center space-x-2">
                        <Car className={`h-4 w-4 ${match.riders.length > 0 ? 'text-green-600' : 'text-blue-600'}`} />
                        <span className="font-medium text-gray-900">{match.driver.name}</span>
                        <span className="hidden sm:inline text-sm text-gray-600">•</span>
                        <div className="hidden sm:flex items-center space-x-1">
                          <span className="text-sm text-gray-600">{match.driver.pickup_area}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(getPickupAreaMapsUrl(match.driver.pickup_area), '_blank')}
                            className="h-4 w-4 p-0 text-blue-600 hover:bg-blue-100"
                          >
                            <MapPin className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end space-x-2">
                        <div className="flex items-center space-x-1 sm:hidden">
                          <span className="text-sm text-gray-600">{match.driver.pickup_area}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(getPickupAreaMapsUrl(match.driver.pickup_area), '_blank')}
                            className="h-4 w-4 p-0 text-blue-600 hover:bg-blue-100"
                          >
                            <MapPin className="h-3 w-3" />
                          </Button>
                        </div>
                        <Badge variant="outline" className={`text-xs ${match.riders.length > 0 ? "text-green-700 border-green-300" : "text-blue-700 border-blue-300"}`}>
                          {match.remaining_seats} seats
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600 mb-2 space-y-1 sm:space-y-0">
                      <span className="font-medium">{formatPhoneNumber(match.driver.phone_number)}</span>
                      <Badge className={`text-xs ${getTimePreferenceColor(match.driver.time_preference)}`}>
                        {formatTimePreference(match.driver.time_preference)}
                      </Badge>
                    </div>
                    
                    {match.riders.length > 0 ? (
                      <div className="border-t pt-2">
                        <p className="text-xs font-medium text-gray-700 mb-2">
                          Passengers ({match.riders.length}):
                        </p>
                        <div className="space-y-1">
                          {match.riders.map((rider: any, riderIndex: number) => (
                            <div key={riderIndex} className="bg-white p-2 rounded text-sm">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
                                <div className="flex items-center space-x-2">
                                  <Users className="h-3 w-3 text-blue-600" />
                                  <span className="font-medium">{rider.name}</span>
                                  <span className="text-xs text-gray-500">({rider.seats_needed} seat{rider.seats_needed > 1 ? 's' : ''})</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                                  <span className="text-xs text-gray-500 font-medium">{formatPhoneNumber(rider.phone_number)}</span>
                                  <Badge variant="outline" className="text-xs w-fit">
                                    {formatTimePreference(rider.time_preference)}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="border-t pt-2">
                        <p className="text-xs text-gray-600 italic">
                          No riders matched yet
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Compact Unmatched Riders */}
        {data.unmatched_riders.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Unmatched Riders</h2>
            <div className="grid gap-2 lg:grid-cols-2 xl:grid-cols-3">
              {data.unmatched_riders.map((rider: any, index: number) => (
                <Card key={index} className="border-0 shadow-sm bg-orange-50">
                  <CardContent className="p-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-orange-600" />
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{rider.name}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 text-xs text-gray-600">
                            <span className="font-medium">{formatPhoneNumber(rider.phone_number)}</span>
                            <span className="hidden sm:inline">•</span>
                            <div className="flex items-center space-x-1">
                              <span>{rider.pickup_area}</span>
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
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs text-orange-700 border-orange-300">
                          {rider.seats_needed} seat{rider.seats_needed > 1 ? 's' : ''}
                        </Badge>
                        <Badge className={`text-xs ${getTimePreferenceColor(rider.time_preference)}`}>
                          {formatTimePreference(rider.time_preference)}
                        </Badge>
                      </div>
                    </div>
                    {rider.reason && (
                      <p className="text-xs text-orange-600 mt-2">{rider.reason}</p>
                    )}
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
