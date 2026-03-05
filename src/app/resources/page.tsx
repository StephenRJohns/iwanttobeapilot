import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Pilot Training Resources",
  description: "Free FAA handbooks, practice tests, study guides, and reference materials for student pilots.",
  alternates: { canonical: "/resources" },
  openGraph: {
    title: "Free Pilot Training Resources | I Want To Be A Pilot",
    description: "Free FAA handbooks, practice tests, study guides, and reference materials for student pilots.",
  },
};

interface Resource {
  name: string;
  description: string;
  href: string;
  badge?: string;
}

interface ResourceSection {
  title: string;
  icon: string;
  resources: Resource[];
}

const RESOURCE_SECTIONS: ResourceSection[] = [
  {
    title: "FAA Official Handbooks",
    icon: "📖",
    resources: [
      {
        name: "Pilot's Handbook of Aeronautical Knowledge (PHAK)",
        description: "FAA-H-8083-25C. The foundational textbook for all pilots. Covers aircraft systems, aerodynamics, weather, navigation, and more.",
        href: "https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/phak",
        badge: "Essential",
      },
      {
        name: "Airplane Flying Handbook (AFH)",
        description: "FAA-H-8083-3C. Procedures for flying airplanes — from basic maneuvers to emergency operations.",
        href: "https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/airplane_handbook",
        badge: "Essential",
      },
      {
        name: "Instrument Flying Handbook (IFH)",
        description: "FAA-H-8083-15B. Complete guide to instrument flying, approaches, and IFR procedures.",
        href: "https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/instrument_procedures_handbook",
      },
      {
        name: "Aviation Instructor's Handbook (AIH)",
        description: "FAA-H-8083-9B. Essential for CFI candidates and those who want to understand how aviation instruction works.",
        href: "https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/aviation_instructors_handbook",
      },
      {
        name: "Instrument Procedures Handbook (IPH)",
        description: "FAA-H-8083-16B. Advanced instrument procedures for IFR operations.",
        href: "https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/instrument_procedures_handbook",
      },
      {
        name: "Aeronautical Information Manual (AIM)",
        description: "The official guide to flying in the National Airspace System. Air traffic control, airspace, charts, and procedures.",
        href: "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/",
        badge: "Essential",
      },
    ],
  },
  {
    title: "FAA Regulations",
    icon: "⚖",
    resources: [
      {
        name: "FAR/AIM Online",
        description: "Full text of Federal Aviation Regulations (14 CFR). Search Parts 61, 91, 135, and 141 online.",
        href: "https://www.ecfr.gov/current/title-14",
      },
      {
        name: "Part 61 — Certification of Pilots",
        description: "Pilot certificate requirements, privileges, and limitations. The rules that govern what you can and can't do.",
        href: "https://www.ecfr.gov/current/title-14/chapter-I/subchapter-D/part-61",
      },
      {
        name: "Part 91 — General Operating and Flight Rules",
        description: "Rules of the road for general aviation. Weather minimums, equipment, right of way, and more.",
        href: "https://www.ecfr.gov/current/title-14/chapter-I/subchapter-F/part-91",
      },
      {
        name: "Part 141 — Pilot Schools",
        description: "Requirements for FAA-approved flight schools. Understand the difference between Part 61 and Part 141 training.",
        href: "https://www.ecfr.gov/current/title-14/chapter-I/subchapter-H/part-141",
      },
    ],
  },
  {
    title: "Practice Tests & Study Tools",
    icon: "✏",
    resources: [
      {
        name: "FAA Practice Tests (FAASafety.gov)",
        description: "Official FAA practice knowledge tests. Free and comprehensive coverage of all test areas.",
        href: "https://www.faasafety.gov/gslac/ALC/course_catalog.aspx",
        badge: "Free",
      },
      {
        name: "Sporty's Free Online Courses",
        description: "Free introductory courses for private pilot, instrument, and more. Great starting point for any level.",
        href: "https://www.sportys.com/learn-to-fly/free-online-courses.html",
        badge: "Free",
      },
      {
        name: "ASA Test Prep (Online)",
        description: "Comprehensive question banks for all pilot knowledge tests. Trusted by thousands of student pilots.",
        href: "https://asa2fly.com/test-prep-online/",
      },
      {
        name: "Gleim Online Ground School",
        description: "Industry-leading test prep with video ground school. High pass rate for the written test.",
        href: "https://www.gleim.com/aviation/online-ground-school/",
      },
    ],
  },
  {
    title: "Weather & Navigation Resources",
    icon: "🌤",
    resources: [
      {
        name: "Aviation Weather Center",
        description: "Official FAA/NOAA aviation weather. METARs, TAFs, PIREPs, AIRMETs, SIGMETs, and more.",
        href: "https://aviationweather.gov",
        badge: "Free",
      },
      {
        name: "SkyVector Flight Planning",
        description: "Free web-based VFR/IFR planning with sectional charts. Great for planning cross-country flights.",
        href: "https://skyvector.com",
        badge: "Free",
      },
      {
        name: "1800wxbrief.com (DUATS/LMFS)",
        description: "Official FAA weather briefings and flight planning service. Get official weather briefings here.",
        href: "https://www.1800wxbrief.com",
        badge: "Free",
      },
      {
        name: "ADDS (Aviation Digital Data Service)",
        description: "Advanced aviation weather graphics, winds aloft, icing, turbulence, and more from NOAA.",
        href: "https://aviationweather.gov/adds/",
      },
    ],
  },
  {
    title: "FAA Medical & Certification",
    icon: "🏥",
    resources: [
      {
        name: "FAA MedXPress (Medical Application)",
        description: "Apply for your FAA medical certificate online. Required before your solo flight.",
        href: "https://medxpress.faa.gov",
        badge: "Required",
      },
      {
        name: "IACRA (Student/Pilot Cert Application)",
        description: "Integrated Airman Certification and Rating Application. Apply for student pilot certificates and track endorsements.",
        href: "https://iacra.faa.gov",
        badge: "Required",
      },
      {
        name: "Find an Aviation Medical Examiner (AME)",
        description: "Locate a doctor authorized to perform FAA medical exams near you.",
        href: "https://designee.faa.gov/#/designeeLocator",
      },
      {
        name: "BasicMed Information",
        description: "An alternative to the 3rd class medical for many private pilots. Learn if you qualify.",
        href: "https://www.aopa.org/go-fly/aircraft-and-ownership/special-light-sport-aircraft-slsa/basicmed",
      },
    ],
  },
  {
    title: "Career Resources",
    icon: "✈",
    resources: [
      {
        name: "AOPA (Aircraft Owners and Pilots Association)",
        description: "Advocacy, member benefits, legal services, and the largest pilot community in the world.",
        href: "https://www.aopa.org",
      },
      {
        name: "Regional Airline Minimum Requirements (RAA)",
        description: "Requirements and hiring minimums for regional airlines. Know what you need before applying.",
        href: "https://www.raa.org/workforce/pilots/",
      },
      {
        name: "FAA Pilot Career Center",
        description: "Official FAA resources for pilots seeking careers in aviation.",
        href: "https://www.faa.gov/jobs/",
      },
      {
        name: "AviationHire.com",
        description: "Aviation job board for pilots, controllers, and aviation professionals.",
        href: "https://aviationhire.com",
      },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Free Pilot Training Resources</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Official FAA publications, practice tests, and essential tools — all free
        </p>
      </div>

      <div className="space-y-10">
        {RESOURCE_SECTIONS.map((section) => (
          <section key={section.title}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">{section.icon}</span>
              <h2 className="text-lg font-semibold">{section.title}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {section.resources.map((resource) => (
                <Link
                  key={resource.href}
                  href={resource.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-lg border border-border bg-card p-4 hover:border-primary/50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-medium group-hover:text-primary transition-colors leading-snug">
                      {resource.name}
                    </h3>
                    {resource.badge && (
                      <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                        resource.badge === "Essential" || resource.badge === "Required"
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "bg-muted text-muted-foreground border border-border"
                      }`}>
                        {resource.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {resource.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 rounded-lg border border-border bg-card/50 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          All external links open official sources or reputable aviation resources.
          Always cross-reference with your CFI and current FAA publications.
        </p>
      </div>
    </div>
  );
}
