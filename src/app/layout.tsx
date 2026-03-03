import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/components/layout/Providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "I Want To Be A Pilot — Your Path to the Cockpit",
    template: "%s | I Want To Be A Pilot",
  },
  description:
    "Everything you need to become a pilot. Find flight schools near you, explore costs and timelines, connect with DPEs, and track your progress from student pilot to airline captain.",
  keywords: [
    "become a pilot",
    "flight school near me",
    "how to become a pilot",
    "pilot training cost",
    "private pilot license",
    "instrument rating",
    "commercial pilot",
    "CFI training",
    "airline pilot career",
    "DPE finder",
    "FAA checkride",
    "pilot study guide",
    "student pilot",
    "flight training",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://iwanttobeapilot.online"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "I Want To Be A Pilot — Your Path to the Cockpit",
    description:
      "Find flight schools, explore costs, track your pilot training progress, and connect with DPEs. Your complete guide to becoming a pilot.",
    siteName: "I Want To Be A Pilot",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "I Want To Be A Pilot — Your Path to the Cockpit",
    description:
      "Find flight schools, explore costs, track your pilot training progress, and connect with DPEs.",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/captains-hat.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "I Want To Be A Pilot",
  url: "https://iwanttobeapilot.online",
  description:
    "Everything you need to become a pilot. Find flight schools, explore costs and timelines, connect with DPEs, and track your progress.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://iwanttobeapilot.online/schools?zip={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} min-h-screen bg-background text-foreground antialiased font-sans`}
      >
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
