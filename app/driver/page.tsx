'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Car, ArrowLeft, CheckCircle, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PICKUP_AREAS, TIME_PREFERENCES } from '@/types/api';
import { createDriver } from '@/lib/actions/drivers';
import { getDestinationMapsUrl, getPickupAreaMapsUrl } from '@/lib/utils';

export default function DriverPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    seats_available: 1,
    pickup_area: 'Ackerman Turnaround',
    custom_pickup_area: '',
    time_preference: 'flexible',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Client-side validation
    const missingFields = [];
    if (!formData.name.trim()) missingFields.push('name');
    if (!formData.phone_number.trim()) missingFields.push('phone number');
    if (!formData.seats_available) missingFields.push('seats available');
    if (!formData.pickup_area.trim()) missingFields.push('pickup area');
    if (formData.pickup_area === 'Other' && !formData.custom_pickup_area.trim()) missingFields.push('custom pickup location');
    if (!formData.time_preference.trim()) missingFields.push('time preference');

    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      setIsSubmitting(false);
      return;
    }

    try {
      // Use custom pickup area if "Other" is selected
      const driverData = {
        ...formData,
        pickup_area: formData.pickup_area === 'Other' ? formData.custom_pickup_area : formData.pickup_area
      };
      
      await createDriver(driverData);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting driver information:', error);
      alert(`Failed to submit driver information: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-800">جزاك الله خيراً</CardTitle>
            <CardDescription className="text-lg">
              May Allah reward you with good
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Thank you for offering to drive! Your information has been submitted successfully.
            </p>
            <p className="text-sm text-gray-500">
              We'll match you with riders who need transportation to King Fahad Mosque.
            </p>
            <div className="flex flex-col gap-2">
              <Button onClick={() => router.push('/dashboard')} className="w-full">
                View Dashboard
              </Button>
              <Button variant="outline" onClick={() => router.push('/')} className="w-full">
                Return Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-green-50">
      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Destination Info */}
        <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">📍</span>
              <div>
                <h2 className="font-semibold text-gray-900">Destination: King Fahad Mosque</h2>
                <p className="text-sm text-gray-600 mt-1">
                  10980 Washington Blvd, Culver City, CA 90232
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(getDestinationMapsUrl(), '_blank')}
              className="flex items-center space-x-1 text-blue-600 border-blue-300 hover:bg-blue-50"
            >
              <MapPin className="h-4 w-4" />
              <span>Directions</span>
            </Button>
          </div>
        </div>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-900 font-medium">Your Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your name"
                  className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number" className="text-gray-900 font-medium">Phone Number *</Label>
                <Input
                  id="phone_number"
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) => handleInputChange('phone_number', e.target.value)}
                  placeholder="(555) 123-4567"
                  className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seats_available" className="text-gray-900 font-medium">Passenger Seats Available *</Label>
                <Input
                  id="seats_available"
                  type="number"
                  min="1"
                  max="8"
                  value={formData.seats_available}
                  onChange={(e) => handleInputChange('seats_available', parseInt(e.target.value))}
                  className="bg-white border-gray-300 text-gray-900"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="pickup_area" className="text-gray-900 font-medium">Pickup Area *</Label>
                  {formData.pickup_area && formData.pickup_area !== 'Other' && (
                    <button
                      type="button"
                      onClick={() => window.open(getPickupAreaMapsUrl(formData.pickup_area), '_blank')}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">View on Maps</span>
                    </button>
                  )}
                </div>
                <Select value={formData.pickup_area} onValueChange={(value) => handleInputChange('pickup_area', value)}>
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                    <SelectValue placeholder="Select pickup area" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    {PICKUP_AREAS.map((area) => (
                      <SelectItem key={area} value={area} className="text-gray-900">
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {formData.pickup_area === 'Other' && (
                  <div className="mt-2">
                    <Label htmlFor="custom_pickup_area" className="text-gray-900 font-medium">Custom Pickup Location *</Label>
                    <Input
                      id="custom_pickup_area"
                      value={formData.custom_pickup_area}
                      onChange={(e) => handleInputChange('custom_pickup_area', e.target.value)}
                      placeholder="Enter your pickup location"
                      className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      required
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="time_preference" className="text-gray-900 font-medium">Timing Preference *</Label>
                <Select value={formData.time_preference} onValueChange={(value) => handleInputChange('time_preference', value)}>
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                    <SelectValue placeholder="Select timing preference" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    {TIME_PREFERENCES.map((pref) => (
                      <SelectItem key={pref.value} value={pref.value} className="text-gray-900">
                        {pref.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-gray-900 font-medium">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Any additional info or preferences..."
                  className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  rows={2}
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full bg-msa-blue hover:bg-blue-800 text-white" size="lg">
                {isSubmitting ? 'Submitting...' : 'Submit ✨'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
