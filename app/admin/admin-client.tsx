'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, LogOut, RefreshCw, Trash2, Car, Users, MapPin, X, ArrowRightLeft, UserMinus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DashboardData } from '@/types/api';
import { formatPhoneNumber, formatTimePreference, getTimePreferenceColor, getPickupAreaMapsUrl } from '@/lib/utils';
import { loginAdmin, logoutAdmin, verifyAdmin } from '@/lib/actions/auth';
import { getDashboardData } from '@/lib/actions/dashboard';
import { deleteDriver } from '@/lib/actions/drivers';
import { deleteRider, assignRiderToDriver, unassignRider, fixOverAssignments, clearAllData } from '@/lib/actions/riders';

interface AdminClientProps {
  initialData: DashboardData;
}

export default function AdminClient({ initialData }: AdminClientProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [data, setData] = useState<DashboardData>(initialData);
  const [refreshing, setRefreshing] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedRiderId, setSelectedRiderId] = useState<number | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [moveRiderId, setMoveRiderId] = useState<number | null>(null);
  const [moveDriverId, setMoveDriverId] = useState<string>('');
  const [showClearModal, setShowClearModal] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log('Checking authentication...');
      const result = await verifyAdmin();
      console.log('Auth check result:', result);
      if (result.authenticated) {
        setIsAuthenticated(true);
        console.log('User is authenticated');
      } else {
        console.log('User is not authenticated');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      console.log('Attempting login...');
      const result = await loginAdmin(password);
      console.log('Login result:', result);
      
      if (result.success) {
        setIsAuthenticated(true);
        await fetchData();
        console.log('Login successful');
      } else {
        setLoginError(result.error || 'Login failed');
        console.log('Login failed:', result.error);
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Login failed. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      setIsAuthenticated(false);
      setPassword('');
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const fetchData = async () => {
    try {
      console.log('Fetching dashboard data...');
      
      // First, fix any over-assignments
      try {
        await fixOverAssignments();
        console.log('Over-assignments checked and fixed');
      } catch (error) {
        console.error('Error fixing over-assignments:', error);
        // Continue even if this fails
      }
      
      const newData = await getDashboardData();
      console.log('New data received:', {
        drivers: newData.drivers.length,
        riders: newData.riders.length,
        unmatchedRiders: newData.unmatched_riders.length,
        matches: newData.matches.length
      });
      
      // Force a new object reference to ensure React re-renders
      setData({ ...newData });
      console.log('Data state updated');
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
  };

  const handleDeleteDriver = async (driverId: number) => {
    if (!confirm('Are you sure you want to delete this driver? This will unassign all their riders.')) {
      return;
    }

    try {
      await deleteDriver(driverId);
      await fetchData();
    } catch (error) {
      console.error('Error deleting driver:', error);
      alert('Failed to delete driver');
    }
  };

  const handleDeleteRider = async (riderId: number) => {
    if (!confirm('Are you sure you want to delete this rider?')) {
      return;
    }

    try {
      await deleteRider(riderId);
      await fetchData();
    } catch (error) {
      console.error('Error deleting rider:', error);
      alert('Failed to delete rider');
    }
  };

  const handleMoveRider = (riderId: number) => {
    setMoveRiderId(riderId);
    setMoveDriverId('');
    setShowMoveModal(true);
    
    // Debug: Check available drivers
    const availableDrivers = data.drivers.filter(driver => {
      const assignedRiders = data.riders.filter(rider => rider.driver_id === driver.id);
      const usedSeats = assignedRiders.reduce((sum, rider) => sum + rider.seats_needed, 0);
      return usedSeats < driver.seats_available;
    });
    console.log('Available drivers for move:', availableDrivers.length, availableDrivers);
  };

  const handleMoveConfirm = async () => {
    if (!moveRiderId || !moveDriverId) return;

    // Get the rider and driver to check capacity
    const rider = data.riders.find(r => r.id === moveRiderId);
    const driver = data.drivers.find(d => d.id === parseInt(moveDriverId));
    
    if (!rider || !driver) {
      alert('Invalid rider or driver selection');
      return;
    }

    // Check if assignment would exceed capacity
    const assignedRiders = data.riders.filter(r => r.driver_id === driver.id);
    const usedSeats = assignedRiders.reduce((sum, r) => sum + r.seats_needed, 0);
    
    if (usedSeats + rider.seats_needed > driver.seats_available) {
      alert(`Cannot move rider: would exceed driver's capacity (${usedSeats + rider.seats_needed} seats needed, ${driver.seats_available} available)`);
      return;
    }

    try {
      console.log('Moving rider', moveRiderId, 'to driver', moveDriverId);
      await assignRiderToDriver(moveRiderId, parseInt(moveDriverId));
      console.log('Move successful, fetching updated data...');
      await fetchData();
      console.log('Data refreshed, closing modal');
      setShowMoveModal(false);
      setMoveRiderId(null);
      setMoveDriverId('');
    } catch (error) {
      console.error('Error moving rider:', error);
      alert('Failed to move rider');
    }
  };

  const handleMoveCancel = () => {
    setShowMoveModal(false);
    setMoveRiderId(null);
    setMoveDriverId('');
  };

  const handleRemoveRider = async (riderId: number) => {
    if (!confirm('Are you sure you want to remove this rider from their current driver?')) {
      return;
    }

    try {
      await unassignRider(riderId);
      await fetchData();
    } catch (error) {
      console.error('Error removing rider:', error);
      alert('Failed to remove rider');
    }
  };

  const handleAssignRider = (riderId: number) => {
    setSelectedRiderId(riderId);
    setSelectedDriverId('');
    setShowAssignModal(true);
  };

  const handleAssignConfirm = async () => {
    if (!selectedRiderId || !selectedDriverId) return;

    // Get the rider and driver to check capacity
    const rider = data.riders.find(r => r.id === selectedRiderId);
    const driver = data.drivers.find(d => d.id === parseInt(selectedDriverId));
    
    if (!rider || !driver) {
      alert('Invalid rider or driver selection');
      return;
    }

    // Check if assignment would exceed capacity
    const assignedRiders = data.riders.filter(r => r.driver_id === driver.id);
    const usedSeats = assignedRiders.reduce((sum, r) => sum + r.seats_needed, 0);
    const totalCapacity = 1 + driver.seats_available; // Driver + passenger seats
    
    if (usedSeats + rider.seats_needed > driver.seats_available) {
      alert(`Cannot assign rider: would exceed driver's capacity (${usedSeats + rider.seats_needed} seats needed, ${driver.seats_available} available)`);
      return;
    }

    try {
      console.log('Assigning rider', selectedRiderId, 'to driver', selectedDriverId);
      await assignRiderToDriver(selectedRiderId, parseInt(selectedDriverId));
      console.log('Assignment successful, fetching updated data...');
      await fetchData();
      console.log('Data refreshed, closing modal');
      setShowAssignModal(false);
      setSelectedRiderId(null);
      setSelectedDriverId('');
    } catch (error) {
      console.error('Error assigning rider:', error);
      alert('Failed to assign rider');
    }
  };

  const handleAssignCancel = () => {
    setShowAssignModal(false);
    setSelectedRiderId(null);
    setSelectedDriverId('');
  };

  const handleFixOverAssignments = async () => {
    if (!confirm('This will unassign riders from drivers who are over capacity. Continue?')) {
      return;
    }

    try {
      await fixOverAssignments();
      await fetchData();
      alert('Over-assignments have been fixed');
    } catch (error) {
      console.error('Error fixing over-assignments:', error);
      alert('Failed to fix over-assignments');
    }
  };

  const handleClearAllData = async () => {
    try {
      await clearAllData();
      await fetchData();
      setShowClearModal(false);
      
      // Force a hard refresh to clear any cached data
      window.location.reload();
      
      alert('All data has been cleared successfully');
    } catch (error) {
      console.error('Error clearing all data:', error);
      alert('Failed to clear all data');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border-blue-200">
          <CardHeader className="text-center bg-blue-50 border-b border-blue-200">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl text-blue-900">Admin Login</CardTitle>
            <CardDescription className="text-blue-700">
              Enter the admin password to access the management panel
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-white">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-blue-900 font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              {loginError && (
                <p className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">{loginError}</p>
              )}
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4">
        {/* Header with Stats and Clear Data Button */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
          {/* Responsive Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3">
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
                  <span className="text-lg font-bold text-purple-600">{data.total_matches}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">Matches</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-3 text-center">
                <div className="flex items-center justify-center">
                  <span className="text-lg font-bold text-orange-600">{data.total_unmatched}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">Unmatched</p>
              </CardContent>
            </Card>
          </div>

          {/* Clear Data Button */}
          <div className="flex justify-center lg:justify-end">
            <Button
              onClick={() => setShowClearModal(true)}
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Data
            </Button>
          </div>
        </div>

        {/* Compact All Drivers Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            🚗 All Drivers ({data.drivers.length})
          </h2>
          <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
            {data.drivers.map((driver) => {
              const assignedRiders = data.riders.filter(rider => rider.driver_id === driver.id);
              const usedSeats = assignedRiders.reduce((sum, rider) => sum + rider.seats_needed, 0);
              const totalPeople = 1 + usedSeats; // Driver + passengers
              const totalCapacity = 1 + driver.seats_available; // Driver + available passenger seats
              const remainingSeats = Math.max(0, driver.seats_available - usedSeats); // Ensure never negative
              
              return (
                <Card key={driver.id} className="border-0 shadow-sm bg-blue-50/30">
                  <CardContent className="p-4">
                    {/* Responsive Driver Info */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-3 space-y-2 lg:space-y-0">
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <span className="text-lg flex-shrink-0">🚗</span>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 truncate text-sm">{driver.name}</h3>
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 text-xs text-gray-600">
                            <span className="font-medium">{formatPhoneNumber(driver.phone_number)}</span>
                            <span className="hidden sm:inline">•</span>
                            <div className="flex items-center space-x-1">
                              <span className="truncate">📍 {driver.pickup_area}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(getPickupAreaMapsUrl(driver.pickup_area), '_blank')}
                                className="h-3 w-3 p-0 text-blue-600 hover:bg-blue-100"
                              >
                                <MapPin className="h-2 w-2" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between lg:justify-end space-x-2">
                        <div className="flex items-center space-x-2">
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
                          <Badge className={`text-xs ${getTimePreferenceColor(driver.time_preference)}`}>
                            {formatTimePreference(driver.time_preference)}
                          </Badge>
                        </div>
                        <Button
                          onClick={() => handleDeleteDriver(driver.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
                          title="Delete Driver"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Compact Driver Notes */}
                    {driver.notes && (
                      <div className="mt-2 p-2 bg-blue-100 rounded text-xs text-blue-800">
                        {driver.notes}
                      </div>
                    )}

                    {/* Compact Assigned Riders */}
                    {assignedRiders.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-xs font-medium text-gray-700 mb-2">
                          Passengers ({assignedRiders.length})
                        </h4>
                        <div className="space-y-1">
                          {assignedRiders.map((rider) => (
                            <div key={rider.id} className="bg-white rounded p-2 border border-gray-200">
                              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-2 lg:space-y-0">
                                <div className="flex items-center space-x-2 flex-1 min-w-0">
                                  <span className="text-sm flex-shrink-0">👤</span>
                                  <div className="min-w-0 flex-1">
                                    <p className="font-medium text-gray-900 truncate text-xs">{rider.name}</p>
                                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 text-xs text-gray-600">
                                      <span className="font-medium">📞 {formatPhoneNumber(rider.phone_number)}</span>
                                      <span className="hidden sm:inline">•</span>
                                      <span className="truncate">📍 {rider.pickup_area}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                                      <span>Seats: {rider.seats_needed}</span>
                                      <span>•</span>
                                      <span className={getTimePreferenceColor(rider.time_preference)}>
                                        {formatTimePreference(rider.time_preference)}
                                      </span>
                                    </div>
                                    {rider.notes && (
                                      <p className="text-xs text-gray-500 mt-1 break-words">{rider.notes}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1 flex-shrink-0">
                                  <Button
                                    onClick={() => handleMoveRider(rider.id)}
                                    variant="outline"
                                    size="sm"
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-6 w-6 p-0"
                                    title="Move to different driver"
                                  >
                                    <ArrowRightLeft className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    onClick={() => handleRemoveRider(rider.id)}
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
                                    title="Remove from driver"
                                  >
                                    <UserMinus className="h-3 w-3" />
                                  </Button>
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

        {/* Compact Unmatched Riders Section */}
        {data.unmatched_riders.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              ⚠️ Unmatched Riders ({data.unmatched_riders.length})
            </h2>
            <div className="grid gap-2 lg:grid-cols-2 xl:grid-cols-3">
              {data.unmatched_riders.map((rider) => (
                <Card key={rider.id} className="border-0 shadow-sm bg-orange-50/30">
                  <CardContent className="p-3">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-2 lg:space-y-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">👤</span>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{rider.name}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 text-xs text-gray-600">
                            <span className="font-medium">📞 {formatPhoneNumber(rider.phone_number)}</span>
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
                            <span>•</span>
                            <span className={getTimePreferenceColor(rider.time_preference)}>
                              {formatTimePreference(rider.time_preference)}
                            </span>
                          </div>
                          {rider.notes && (
                            <p className="text-xs text-gray-500 mt-1">{rider.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => handleAssignRider(rider.id)}
                          variant="outline"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-6 w-6 p-0"
                          title="Assign to driver"
                        >
                          <Users className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteRider(rider.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
                          title="Delete rider"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Compact No Data State */}
        {data.drivers.length === 0 && data.riders.length === 0 && (
          <Card className="text-center border-0 shadow-sm">
            <CardContent className="py-8">
              <div className="text-4xl mb-3">🕌</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
              <p className="text-sm text-gray-600">
                No drivers or riders have registered yet.
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Driver Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative z-[101] shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Assign Rider to Driver</h3>
              <button
                onClick={handleAssignCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-4 relative">
              <Label htmlFor="driver-select" className="text-sm font-medium text-gray-700">
                Select driver to assign rider to:
              </Label>
              <Select value={selectedDriverId} onValueChange={setSelectedDriverId}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Choose a driver..." />
                </SelectTrigger>
                <SelectContent className="z-[9999] bg-white border shadow-lg" position="popper">
                  {data.drivers
                    .filter(driver => {
                      const assignedRiders = data.riders.filter(rider => rider.driver_id === driver.id);
                      const usedSeats = assignedRiders.reduce((sum, rider) => sum + rider.seats_needed, 0);
                      return usedSeats < driver.seats_available;
                    })
                    .map(driver => {
                      const assignedRiders = data.riders.filter(rider => rider.driver_id === driver.id);
                      const usedSeats = assignedRiders.reduce((sum, rider) => sum + rider.seats_needed, 0);
                      const availableSeats = driver.seats_available - usedSeats;
                      
                      return (
                        <SelectItem key={driver.id} value={driver.id.toString()}>
                          {driver.name} ({availableSeats} passenger seats available)
                        </SelectItem>
                      );
                    })}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={handleAssignCancel}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAssignConfirm}
                disabled={!selectedDriverId}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Assign
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Move Rider Modal */}
      {showMoveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative z-[101] shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Move Rider to Different Driver</h3>
              <button
                onClick={handleMoveCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-4 relative">
              <Label htmlFor="move-driver-select" className="text-sm font-medium text-gray-700">
                Select driver to move rider to:
              </Label>
              <Select value={moveDriverId} onValueChange={setMoveDriverId}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Choose a driver..." />
                </SelectTrigger>
                <SelectContent className="z-[9999] bg-white border shadow-lg" position="popper">
                  {data.drivers
                    .filter(driver => {
                      const assignedRiders = data.riders.filter(rider => rider.driver_id === driver.id);
                      const usedSeats = assignedRiders.reduce((sum, rider) => sum + rider.seats_needed, 0);
                      return usedSeats < driver.seats_available;
                    })
                    .map(driver => {
                      const assignedRiders = data.riders.filter(rider => rider.driver_id === driver.id);
                      const usedSeats = assignedRiders.reduce((sum, rider) => sum + rider.seats_needed, 0);
                      const availableSeats = driver.seats_available - usedSeats;
                      
                      return (
                        <SelectItem key={driver.id} value={driver.id.toString()}>
                          {driver.name} ({availableSeats} passenger seats available)
                        </SelectItem>
                      );
                    })}
                  {data.drivers.filter(driver => {
                    const assignedRiders = data.riders.filter(rider => rider.driver_id === driver.id);
                    const usedSeats = assignedRiders.reduce((sum, rider) => sum + rider.seats_needed, 0);
                    return usedSeats < driver.seats_available;
                  }).length === 0 && (
                    <SelectItem value="no-drivers" disabled>
                      No drivers with available seats
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={handleMoveCancel}
              >
                Cancel
              </Button>
              <Button
                onClick={handleMoveConfirm}
                disabled={!moveDriverId}
                className="bg-green-600 hover:bg-green-700"
              >
                Move
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Data Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative z-[101] shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Clear All Data</h3>
              <button
                onClick={() => setShowClearModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">⚠️ This action cannot be undone!</h4>
                  <p className="text-sm text-gray-600">This will permanently delete all drivers and riders from the database.</p>
                </div>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h5 className="font-medium text-red-800 mb-2">What will be deleted:</h5>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• All drivers ({data.total_drivers})</li>
                  <li>• All riders ({data.total_riders})</li>
                  <li>• All matches and assignments</li>
                  <li>• All notes and preferences</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowClearModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleClearAllData}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All Data
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}