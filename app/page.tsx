'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Car, Users, MapPin, Clock, Star, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Hero Section */}
      <div className="flex flex-col grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-bg-primary">
        <div className="text-center mb-16">
          <div className="text-6xl mb-6">🕌</div>
          <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-6">
            <span className="text-msa-blue">السلام عليكم ورحمة الله وبركاته</span>
            <br />
            <span className="text-2xl md:text-3xl text-text-primary">Peace be upon you and the mercy of Allah and His blessings</span>
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-msa-blue mb-6">
            Join Us for Isha Prayer in Congregation
          </h2>
          <p className="text-xl text-text-primary mb-8 max-w-4xl mx-auto">
            This platform was created to help facilitate rides for the brothers to attend Jama'ah Isha prayers every Thursday at King Fahad Mosque in Culver City for the 2025-2026 school year.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/driver">
              <Button size="lg" className="w-full sm:w-auto bg-msa-blue hover:bg-blue-800 text-white">
                <Car className="mr-2 h-5 w-5" />
                Offer a Ride
              </Button>
            </Link>
            <Link href="/rider">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-msa-blue text-msa-blue hover:bg-msa-blue hover:text-white">
                <Users className="mr-2 h-5 w-5" />
                Request a Ride
              </Button>
            </Link>
          </div>
        </div>

        {/* Islamic Quotes Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-800 rounded-lg border-l-4 border-msa-yellow p-6 hover:shadow-lg transition-shadow">
            <p className="text-white italic text-lg mb-4">
              "The prayer in congregation is twenty-seven times superior to the prayer offered by a person alone."
            </p>
            <p className="text-msa-yellow font-bold">— Sahih Bukhari 645</p>
          </div>

          <div className="bg-gray-800 rounded-lg border-l-4 border-msa-yellow p-6 hover:shadow-lg transition-shadow">
            <p className="text-white italic text-lg mb-4 text-right" dir="rtl">
              وَأَقِيمُوا۟ ٱلصَّلَوٰةَ وَءَاتُوا۟ ٱلزَّكَوٰةَ وَٱرْكَعُوا۟ مَعَ ٱلرَّٰكِعِينَ
            </p>
            <p className="text-white italic text-lg mb-4">
              "And establish prayer and give zakah and bow with those who bow [in worship and obedience]."
            </p>
            <p className="text-msa-yellow font-bold">— Quran 2:43</p>
          </div>

          <div className="bg-gray-800 rounded-lg border-l-4 border-msa-yellow p-6 hover:shadow-lg transition-shadow">
            <p className="text-white italic text-lg mb-4">
              "Whoever goes to the mosque in the morning or evening, Allah will prepare for him a feast in Paradise whenever he goes in the morning or evening."
            </p>
            <p className="text-msa-yellow font-bold">— Sahih Bukhari 662</p>
          </div>
        </div>


        {/* Islamic Blessing */}
        <div className="text-center mt-16 p-8 bg-msa-blue rounded-lg text-text-secondary">
          <h2 className="text-2xl font-bold mb-4">بارك الله فيكم</h2>
          <p className="text-lg opacity-90">May Allah bless you</p>
          <p className="mt-4 text-sm opacity-75">
            Thank you for participating in our community ride-sharing program for Thursday Isha prayers. 
            May Allah reward you for your service to the community and grant you the rewards of congregational prayer.
          </p>
        </div>
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="bg-msa-blue text-text-secondary py-6 px-5 text-center">
        <div className="space-y-2">
          <p className="text-lg">📍 Destination: King Fahad Mosque, 10980 Washington Blvd, Culver City, CA 90232</p>
          <p className="text-lg">🕐 Every Thursday Evening</p>
        </div>
      </footer>
    </div>
  );
}