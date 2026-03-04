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
    "pilot training near me",
    "how to get a pilot license",
    "FAA written test",
    "knowledge test prep",
    "BasicMed",
    "FAA medical exam",
    "aviation medical examiner",
    "sport pilot",
    "light sport aircraft",
    "multi-engine rating",
    "CFII",
    "instrument flight rules",
    "VFR cross country",
    "Sporty's pilot training",
    "King Schools",
    "aviation career path",
    "pilot job outlook",
    "first officer salary",
    "major airline pilot",
    "cargo pilot",
    "charter pilot",
    "corporate pilot",
    "helicopter pilot",
    "rotorcraft certificate",
    "aviation scholarship",
    "GI bill flight training",
    "military pilot to civilian",
    "pilot training app",
    "aviation community",
    "free pilot resources",
    "flight school finder",
    "pilot certification tracker",
    "ground school online",
    "DPE checkride finder",
    "navlogpro",
    "cross country nav log",
    "pilot milestone tracker",
    "aviation career guide",
    "iwanttobeapilot",
    "pilot training website",
    "how to find a flight school",
    "pilot training for beginners",
    "zero to airline pilot",
    "ATP 1500 hours",
    "regional to major airline",
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
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
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
    logo: "https://iwanttobeapilot.online/images/pilot_logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      email: "support@iwanttobeapilot.online",
      contactType: "customer support",
    },
    sameAs: [],
    founder: {
      "@type": "Organization",
      name: "JJJJJ Enterprises, LLC",
    },
    description: "Founded by a parent of two pilots who wanted to build the resource that would have made their training journeys easier.",
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
