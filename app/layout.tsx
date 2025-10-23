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
