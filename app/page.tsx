'use client';

import Link from 'next/link';
import { Car, Users, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Hero Section */}
      <div className="flex flex-col grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-bg-primary">
        <div className="text-center mb-16">
          <img 
            src="/uclabrothers.jpg" 
            alt="UCLA Brothers Logo" 
            className="h-20 w-20 md:h-24 md:w-24 mx-auto mb-6 rounded-full object-cover border-2 border-msa-yellow shadow-lg"
            onError={(e) => {
              // Fallback to emoji if image doesn't exist
              e.currentTarget.style.display = 'none';
              const fallback = document.createElement('div');
              fallback.className = 'text-5xl mb-4';
              fallback.textContent = '🕌';
              e.currentTarget.parentNode?.insertBefore(fallback, e.currentTarget);
            }}
          />
          <h1 className="text-3xl md:text-5xl font-bold text-msa-blue mb-3">
            <span className="text-4xl md:text-6xl">السلام عليكم ورحمة الله وبركاته</span>
            <br />
            <span className="text-xl md:text-2xl text-text-primary">Peace be upon you and the mercy of Allah and His blessings</span>
          </h1>
          <p className="text-lg text-text-primary mb-8 max-w-2xl mx-auto">
            Ride-sharing platform for Isha prayers at King Fahad Mosque, Culver City
          </p>
          
          {/* Main Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/driver">
              <Button size="lg" className="bg-msa-blue hover:bg-blue-800 text-white min-w-[200px]">
                <Car className="mr-2 h-5 w-5" />
                Offer a Ride
              </Button>
            </Link>
            <Link href="/rider">
              <Button size="lg" variant="outline" className="border-2 border-msa-blue text-msa-blue hover:bg-msa-blue hover:text-white min-w-[200px]">
                <Users className="mr-2 h-5 w-5" />
                Request a Ride
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="bg-gray-100 text-gray-900 hover:bg-gray-200 min-w-[200px]">
                <Search className="mr-2 h-5 w-5" />
                View Rides
              </Button>
            </Link>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-msa-blue mb-8">
            How It Works
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* For Drivers */}
            <Card className="border-2 border-msa-blue">
              <CardHeader>
                <CardTitle className="text-2xl text-msa-blue flex items-center gap-2">
                  <Car className="h-6 w-6" />
                  For Drivers
                </CardTitle>
                <CardDescription className="text-base">
                  Offer rides to help brothers attend prayer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-msa-blue text-white flex items-center justify-center font-bold">1</div>
                    <div>
                      <p className="font-semibold">Click "I'm a Driver"</p>
                      <p className="text-sm text-gray-600">Fill out your driver information and available seats</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-msa-blue text-white flex items-center justify-center font-bold">2</div>
                    <div>
                      <p className="font-semibold">Set Your Details</p>
                      <p className="text-sm text-gray-600">Provide your pickup location, departure time, and contact info</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-msa-blue text-white flex items-center justify-center font-bold">3</div>
                    <div>
                      <p className="font-semibold">Help Others</p>
                      <p className="text-sm text-gray-600">Your ride will appear on the dashboard for riders to find</p>
                    </div>
                  </li>
                </ol>
              </CardContent>
            </Card>

            {/* For Riders */}
            <Card className="border-2 border-msa-yellow">
              <CardHeader>
                <CardTitle className="text-2xl text-msa-yellow flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  For Riders
                </CardTitle>
                <CardDescription className="text-base">
                  Find a ride to attend Isha prayer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-msa-yellow text-msa-blue flex items-center justify-center font-bold">1</div>
                    <div>
                      <p className="font-semibold">Click "Request a Ride"</p>
                      <p className="text-sm text-gray-600">Fill out your rider information and pickup location</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-msa-yellow text-msa-blue flex items-center justify-center font-bold">2</div>
                    <div>
                      <p className="font-semibold">Browse Available Rides</p>
                      <p className="text-sm text-gray-600">Check the dashboard to see drivers offering rides</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-msa-yellow text-msa-blue flex items-center justify-center font-bold">3</div>
                    <div>
                      <p className="font-semibold">Connect with Drivers</p>
                      <p className="text-sm text-gray-600">Contact drivers directly to coordinate your ride</p>
                    </div>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Islamic Quotes Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16 max-w-6xl mx-auto">
          <Card className="bg-gradient-to-br from-msa-blue/10 to-msa-blue/5 border-2 border-msa-blue/20 shadow-md">
            <CardContent className="pt-6">
              <p className="text-text-primary italic text-base leading-relaxed mb-4">
                "The prayer in congregation is twenty-seven times superior to the prayer offered by a person alone."
              </p>
              <p className="text-msa-blue font-semibold text-sm">— Sahih Bukhari 645</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-msa-yellow/10 to-msa-yellow/5 border-2 border-msa-yellow/20 shadow-md">
            <CardContent className="pt-6">
              <p className="text-text-primary text-xl mb-3 text-right leading-relaxed" dir="rtl" style={{ fontFamily: 'serif' }}>
                وَأَقِيمُوا۟ ٱلصَّلَوٰةَ وَءَاتُوا۟ ٱلزَّكَوٰةَ وَٱرْكَعُوا۟ مَعَ ٱلرَّٰكِعِينَ
              </p>
              <p className="text-text-primary italic text-base leading-relaxed mb-4">
                "And establish prayer and give zakah and bow with those who bow [in worship and obedience]."
              </p>
              <p className="text-msa-yellow font-semibold text-sm">— Quran 2:43</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-msa-blue/10 to-msa-blue/5 border-2 border-msa-blue/20 shadow-md">
            <CardContent className="pt-6">
              <p className="text-text-primary italic text-base leading-relaxed mb-4">
                "Whoever goes to the mosque in the morning or evening, Allah will prepare for him a feast in Paradise whenever he goes in the morning or evening."
              </p>
              <p className="text-msa-blue font-semibold text-sm">— Sahih Bukhari 662</p>
            </CardContent>
          </Card>
        </div>


        {/* Islamic Blessing */}
        <div className="text-center mt-16 p-8 bg-msa-blue rounded-lg text-text-secondary">
          <h2 className="text-2xl font-bold mb-4">بارك الله فيكم</h2>
          <p className="text-lg opacity-90">May Allah bless you</p>
          <p className="mt-4 text-sm opacity-75">
            Thank you for participating in our community ride-sharing program for Isha prayers. 
            May Allah reward you for your service to the community and grant you the rewards of congregational prayer.
          </p>
        </div>
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="bg-msa-blue text-text-secondary py-6 px-5 text-center">
        <div className="space-y-2">
          <p className="text-lg">Destination: King Fahad Mosque, 10980 Washington Blvd, Culver City, CA 90232</p>
          <p className="text-lg">Every Evening</p>
        </div>
      </footer>
    </div>
  );
}