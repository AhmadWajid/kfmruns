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
  title: "UCLA MSA - Thursday Isha Ride Matching",
  description: "UCLA Thursday Isha prayer rides to King Fahad Mosque. Find drivers and riders for convenient transportation.",
  keywords: "UCLA, MSA, Muslim, ride sharing, transportation, King Fahad Mosque, Isha prayer",
  authors: [{ name: "UCLA Muslim Student Association" }],
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    url: "https://kfmrunz.netlify.app",
    type: "website",
    title: "UCLA MSA - Thursday Isha Ride Matching",
    description: "UCLA Thursday Isha prayer rides to King Fahad Mosque. Find drivers and riders for convenient transportation.",
    images: [
      {
        url: "https://opengraph.b-cdn.net/production/images/b9aeb9f1-bb6e-42c9-9551-db15b7ef7034.png?token=D-5m_lIaLOiG0sdcT9frOGj8kFr4jdbkDR00jXKPgSc&height=626&width=1200&expires=33297106583",
        width: 1200,
        height: 626,
        alt: "UCLA MSA - Thursday Isha Ride Matching",
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
        <!-- HTML Meta Tags -->
    <title>UCLA MSA - Isha Ride Matching</title>
    <meta name="description" content="UCLA Isha prayer rides to King Fahad Mosque. Find drivers and riders for convenient transportation.">
    
    <!-- Facebook Meta Tags -->
    <meta property="og:url" content="https://kfmruns.netlify.app">
    <meta property="og:type" content="website">
    <meta property="og:title" content="UCLA MSA - Isha Ride Matching">
    <meta property="og:description" content="UCLA Isha prayer rides to King Fahad Mosque. Find drivers and riders for convenient transportation.">
    <meta property="og:image" content="https://opengraph.b-cdn.net/production/images/772e43a7-89d8-4749-9ab3-f68a4f8e9171.png?token=BMRLIqLB6p1iUNAztv7QgNu4vzsomGz2HAdkegdfCDQ&height=681&width=1200&expires=33297240693">
    
    <!-- Twitter Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta property="twitter:domain" content="kfmruns.netlify.app">
    <meta property="twitter:url" content="https://kfmruns.netlify.app">
    <meta name="twitter:title" content="UCLA MSA - Isha Ride Matching">
    <meta name="twitter:description" content="UCLA Isha prayer rides to King Fahad Mosque. Find drivers and riders for convenient transportation.">
    <meta name="twitter:image" content="https://opengraph.b-cdn.net/production/images/772e43a7-89d8-4749-9ab3-f68a4f8e9171.png?token=BMRLIqLB6p1iUNAztv7QgNu4vzsomGz2HAdkegdfCDQ&height=681&width=1200&expires=33297240693">
    
    <!-- Meta Tags Generated via https://www.opengraph.xyz -->
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
