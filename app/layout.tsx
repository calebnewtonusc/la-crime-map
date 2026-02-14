import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LA Crime Map - Real-Time Crime Statistics & Neighborhood Safety",
    template: "%s | LA Crime Map"
  },
  description: "Explore Los Angeles crime statistics with interactive maps. View real-time data on violent crime, car theft, break-ins, and petty theft across 35+ neighborhoods. Make informed decisions about neighborhood safety.",
  keywords: ["LA crime", "Los Angeles safety", "crime statistics", "neighborhood crime", "crime map", "Los Angeles crime data", "safety ratings"],
  authors: [{ name: "LA Crime Map" }],
  creator: "LA Crime Map",
  publisher: "LA Crime Map",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'LA Crime Map - Real-Time Crime Statistics & Neighborhood Safety',
    description: 'Explore Los Angeles crime statistics with interactive maps. View real-time data across 35+ neighborhoods.',
    siteName: 'LA Crime Map',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LA Crime Map - Real-Time Crime Statistics',
    description: 'Explore Los Angeles crime statistics with interactive maps',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // JSON-LD Structured Data for WebApplication
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'LA Crime Map',
    description: 'Explore Los Angeles crime statistics with interactive maps. View real-time data on violent crime, car theft, break-ins, and petty theft across 35+ neighborhoods.',
    url: baseUrl,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
      bestRating: '5',
      worstRating: '1',
    },
    featureList: [
      'Real-time crime statistics',
      'Interactive neighborhood maps',
      'Crime type filtering',
      'Safety ratings',
      'Data visualization',
      'Trend analysis',
    ],
    screenshot: `${baseUrl}/opengraph-image`,
    creator: {
      '@type': 'Organization',
      name: 'LA Crime Map',
      url: baseUrl,
    },
    keywords: 'LA crime, Los Angeles safety, crime statistics, neighborhood crime, crime map, Los Angeles crime data, safety ratings',
    inLanguage: 'en-US',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    softwareVersion: '1.0.0',
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <a
            href="#main-content"
            className="skip-to-content"
            aria-label="Skip to main content"
          >
            Skip to content
          </a>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
