import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/components/layout/Providers";
import Header from "@/components/layout/Header";
import Banner from "@/components/layout/Banner";
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
    "Everything you need to become a pilot. Find flight schools near you, estimate pilot training costs and timelines, prep for FAA knowledge tests, locate a DPE, and track your progress — from student pilot to airline captain. Free tools, no account required.",
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
    "NavLog Pro",
    "NavLog Pro upgrade",
    "NavLog Pro pilot training bundle",
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
    "FAA knowledge test practice",
    "PAR practice test",
    "IRA practice test",
    "commercial pilot practice test",
    "ATP practice test",
    "FAA written exam practice",
    "pilot knowledge test study",
    "FAA test bank",
    "private pilot practice exam",
    "instrument rating practice exam",
    "CFI written exam practice",
    "FOI practice test",
    "flight instructor written exam",
    "study for FAA written test",
    "pilot training progress tracker app",
    "aviation study app",
    "discovery flight near me",
    "first flight lesson",
    "recreational pilot certificate",
    "ab initio flight training",
    "zero to hero pilot",
    "pilot biennial flight review",
    "BFR requirements",
    "instrument currency requirements",
    "complex aircraft endorsement",
    "high performance endorsement",
    "tailwheel endorsement",
    "night flight training",
    "solo flight requirements",
    "student pilot solo",
    "FAA knowledge test 2026",
    "free pilot training resources 2026",
    "pilot training checklist",
    "aviation study guide 2026",
    "free ground school",
    "pilot training community",
    "aviation career 2026",
    "airline pilot shortage",
    "pilot career outlook 2026",
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
    images: [
      {
        url: "/images/IWTBAP_logo.png",
        width: 512,
        height: 512,
        alt: "I Want To Be A Pilot",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "I Want To Be A Pilot — Your Path to the Cockpit",
    description:
      "Find flight schools, explore pilot training costs, locate a DPE, and track your progress to the cockpit.",
    site: "@iwanttobeapilot",
    images: ["/images/IWTBAP_logo.png"],
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
    logo: "https://iwanttobeapilot.online/images/IWTBAP_logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      email: "support@iwanttobeapilot.online",
      contactType: "customer support",
    },
    founder: {
      "@type": "Organization",
      name: "JJJJJ Enterprises, LLC",
    },
    description: "Everything you need to become a pilot — flight school search, cost estimator, FAA knowledge test prep, DPE finder, and pilot community.",
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
          <Banner />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
