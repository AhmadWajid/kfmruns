import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UCLA Brothers - Isha Ride Matching",
  description: "UCLA Isha prayer rides to King Fahad Mosque. Find drivers and riders for convenient transportation.",
  keywords: "UCLA, Brothers, Muslim, ride sharing, transportation, King Fahad Mosque, Isha prayer",
  authors: [{ name: "UCLA Brothers" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover",
  icons: {
    icon: '/uclabrothers.ico',
    apple: '/uclabrothers.ico',
  },
  openGraph: {
    url: "https://kfmruns.netlify.app",
    type: "website",
    title: "UCLA Brothers - Isha Ride Matching",
    description: "UCLA Isha prayer rides to King Fahad Mosque. Find drivers and riders for convenient transportation.",
    images: [
      {
        url: "https://opengraph.b-cdn.net/production/images/772e43a7-89d8-4749-9ab3-f68a4f8e9171.png?token=BMRLIqLB6p1iUNAztv7QgNu4vzsomGz2HAdkegdfCDQ&height=681&width=1200&expires=33297240693",
        width: 1200,
        height: 626,
        alt: "UCLA Brothers - Isha Ride Matching",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="__className_da75cc">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      <body className="flex flex-col min-h-screen">
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
