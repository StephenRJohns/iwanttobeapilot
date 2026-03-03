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
    "Everything you need to become a pilot. Find flight schools near you, explore pilot training costs and timelines, locate a DPE, track your milestone progress, and connect with other pilots — from student pilot to airline captain.",
  keywords: [
    "become a pilot",
    "how to become a pilot",
    "flight school near me",
    "flight school search",
    "pilot training cost",
    "how much does pilot training cost",
    "how long does it take to become a pilot",
    "private pilot license",
    "private pilot certificate",
    "student pilot certificate",
    "sport pilot license",
    "instrument rating",
    "commercial pilot certificate",
    "airline transport pilot",
    "ATP requirements",
    "CFI training",
    "flight instructor certificate",
    "airline pilot career",
    "pilot salary",
    "regional airline pilot",
    "DPE finder",
    "designated pilot examiner",
    "FAA checkride",
    "checkride prep",
    "aviation ground school",
    "pilot study guide",
    "student pilot",
    "flight training",
    "flight hours required",
    "FAA medical certificate",
    "pilot equipment",
    "aviation headset",
    "ForeFlight alternative",
    "pilot training progress tracker",
    "pilot community forums",
    "pilot stories",
    "DPE pass rate",
    "checkride pass rate",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://iwanttobeapilot.online"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "I Want To Be A Pilot — Your Path to the Cockpit",
    description:
      "Find flight schools near you, explore real pilot training costs, locate a DPE, and track every milestone from student pilot to airline captain. Free tools for aspiring pilots.",
    siteName: "I Want To Be A Pilot",
    url: "https://iwanttobeapilot.online",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "I Want To Be A Pilot — Your Path to the Cockpit",
    description:
      "Find flight schools, explore pilot training costs, locate a DPE, and track your progress to the cockpit.",
    site: "@iwanttobeapilot",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/captains-hat.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
};

const jsonLd = [
  {
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
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "I Want To Be A Pilot",
    url: "https://iwanttobeapilot.online",
    logo: "https://iwanttobeapilot.online/captains-hat.svg",
    contactPoint: {
      "@type": "ContactPoint",
      email: "support@iwanttobeapilot.online",
      contactType: "customer support",
    },
    sameAs: [],
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Prevent flash of wrong theme on load */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('theme');document.documentElement.classList.toggle('dark',t!=='light');})()` }} />
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
