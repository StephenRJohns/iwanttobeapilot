import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Help & FAQ",
  description: "Get help using I Want To Be A Pilot — flight school search, cost estimator, DPE finder, progress tracker, and more.",
  alternates: { canonical: "/help" },
  openGraph: {
    title: "Help & FAQ | I Want To Be A Pilot",
    description: "Get help using I Want To Be A Pilot — flight school search, cost estimator, DPE finder, progress tracker, and more.",
  },
};

interface FAQItem {
  q: string;
  a: React.ReactNode;
}

const sections: { title: string; items: FAQItem[] }[] = [
  {
    title: "Getting Started",
    items: [
      {
        q: "What is I Want To Be A Pilot?",
        a: (
          <>
            I Want To Be A Pilot is a free educational resource for anyone who wants to pursue aviation. It covers everything from finding a flight school near you to estimating the full cost of becoming an airline captain. A Pro subscription unlocks additional tools like the progress timeline, DPE finder, community forums, and pilot stories. Read more on the{" "}
            <Link href="/about" className="text-primary hover:underline">About</Link> page.
          </>
        ),
      },
      {
        q: "Who built this site?",
        a: (
          <>
            The site was built by a parent who watched two kids go through pilot training and wanted to create a resource that would have made their journeys easier — clear information about costs, timelines, schools, examiners, and careers, all in one place. See the{" "}
            <Link href="/about" className="text-primary hover:underline">About</Link> page for the full story.
          </>
        ),
      },
      {
        q: "How do I get help on a specific page?",
        a: "Every page has a contextual help panel. Click the question mark icon (?) in the top-right corner of the navigation bar — next to Sign In or Sign Out — to open a panel with tips specific to the page you're on.",
      },
      {
        q: "Do I need an account to use the site?",
        a: (
          <>
            No. The following features are free and require no account:{" "}
            <Link href="/schools" className="text-primary hover:underline">Flight School Search</Link>,{" "}
            <Link href="/resources" className="text-primary hover:underline">Free Resources</Link>,{" "}
            <Link href="/equipment" className="text-primary hover:underline">Equipment Guide</Link>,{" "}
            <Link href="/costs" className="text-primary hover:underline">Cost & Timeline Estimator</Link>, and{" "}
            <Link href="/pricing" className="text-primary hover:underline">Pricing</Link>.
            Pro features — including the progress timeline, FAA knowledge test prep, DPE finder, pilot stories, and discussion forums — require a free account and a Pro subscription.
          </>
        ),
      },
      {
        q: "How do I create an account?",
        a: (
          <>
            Click <Link href="/auth/register" className="text-primary hover:underline">Get Started</Link> in the top-right corner. You can register with your email and a password, or sign in instantly with Google.
          </>
        ),
      },
      {
        q: "I forgot my password. How do I reset it?",
        a: (
          <>
            On the{" "}
            <Link href="/auth/signin" className="text-primary hover:underline">Sign In</Link> page, click &ldquo;Forgot your password?&rdquo; and enter your email address. We&apos;ll send you a password reset link. Check your spam folder if it doesn&apos;t arrive within a few minutes.
          </>
        ),
      },
    ],
  },
  {
    title: "Free Features",
    items: [
      {
        q: "How does the flight school search work?",
        a: (
          <>
            Go to <Link href="/schools" className="text-primary hover:underline">Schools</Link>, enter your zip code, select a search radius (25, 50, 100, or 200 miles), and click Search. Results appear on an interactive map and in a paginated table showing each school&apos;s name, address, phone number (clickable to call), website link, and distance from you. Pan or zoom the map and click &ldquo;Search here&rdquo; to re-search around a new location. Use the pagination controls to adjust how many results are shown per page. No account required.
          </>
        ),
      },
      {
        q: "How accurate are the cost and timeline estimates?",
        a: (
          <>
            The figures on the <Link href="/costs" className="text-primary hover:underline">Cost Estimator</Link> are national averages based on publicly available data. Actual costs vary significantly by location, aircraft type, instructor rates, and how often you fly. Use them for rough planning only, and always get quotes directly from local flight schools. See our <Link href="/disclaimer" className="text-primary hover:underline">Aviation Disclaimer</Link> for full details.
          </>
        ),
      },
      {
        q: "What free resources are available?",
        a: (
          <>
            The <Link href="/resources" className="text-primary hover:underline">Resources</Link> page links to free FAA handbooks (Pilot&apos;s Handbook of Aeronautical Knowledge, Airplane Flying Handbook), the Airman Certification Standards, practice written test services, sectional chart tools, and more — all free from official sources.
          </>
        ),
      },
      {
        q: "What is on the Equipment Guide?",
        a: (
          <>
            The <Link href="/equipment" className="text-primary hover:underline">Equipment Guide</Link> lists gear pilots commonly need across 13 categories — headsets, flight bags, electronics, kneeboards, charts, apps, and more. Use the category filter buttons or search box to find specific products. Each card shows the product image, description, community star rating, and a link to buy on Amazon or Sporty&apos;s. Pro users can rate items 1–5 stars and suggest products we&apos;re missing via the &ldquo;Suggest Equipment&rdquo; button.
          </>
        ),
      },
    ],
  },
  {
    title: "Pro Features",
    items: [
      {
        q: "What does Pro include?",
        a: (
          <>
            Pro unlocks: visual progress timeline with milestone tracking, FAA knowledge test prep (study mode with instant feedback and full-length sample tests with score history and weak-area tracking), DPE finder with FAA pass rate data, the ability to rate flight schools and DPEs, pilot stories community, discussion forums, and equipment ratings. Pro also includes a free{" "}
            <a href="https://navlogpro.training" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">NavLog Pro</a>{" "}
            account (FAA cross-country nav log builder, a $50/year value). See{" "}
            <Link href="/pricing" className="text-primary hover:underline">Pricing</Link> for full details.
          </>
        ),
      },
      {
        q: "How does the Progress Timeline work?",
        a: "The Progress Timeline shows a visual roadmap customized to your pilot goal (choose from 8 paths, Hobby Pilot through Major Cargo). Each milestone card expands to show \"What You Will Learn,\" recommended gear for that stage, step-by-step next actions, and links to FAA knowledge test prep. Yellow badges indicate which FAA tests are required (e.g., PAR, IRA, CAX). Mark milestones as In Progress or Complete — your progress is saved automatically with visual indicators (pulsing amber for in-progress, green checkmark for complete).",
      },
      {
        q: "How do the FAA Knowledge Test practice exams work?",
        a: (
          <>
            From your <Link href="/dashboard" className="text-primary hover:underline">Progress Timeline</Link>, click the yellow test badge on any milestone (e.g., &ldquo;PAR Required&rdquo;) to access two modes: <strong className="text-foreground">Study Mode</strong> lets you pick specific Areas of Knowledge, set a question count (10–100), and get instant feedback with explanations after every answer — great for learning. <strong className="text-foreground">Sample Test Mode</strong> generates a full-length exam matching the real FAA test (e.g., 60 questions for PAR) with no peeking — results are saved to your history with a score breakdown by subject area. The &ldquo;Questions to Work On&rdquo; tab automatically tracks questions you&apos;ve missed 2+ times so you can drill your weak spots with a focused mini-test. All questions are synced from the official FAA test data banks. Pro subscription required.
          </>
        ),
      },
      {
        q: "How does the DPE Finder work?",
        a: "Enter your zip code, select a search radius (25–200 miles), and optionally filter by certificate type. Results appear on an interactive map and in a paginated table with name, location, distance, phone, email, and community star rating. Pro users can rate DPEs 1–5 stars. The pass rate panel shows aggregate FAA checkride statistics by year and certificate type, color-coded green (80%+), amber (60–79%), or red (below 60%). DPE data is sourced from public FAA records — always verify directly with the examiner.",
      },
      {
        q: "What are Pilot Stories?",
        a: "Pilot Stories is a community feature where Pro users share their real training journeys. Each story includes certification levels achieved, training duration, total cost, and current salary range. Use the pilot level filter to find stories from private pilots, instrument-rated pilots, commercial pilots, or airline captains. Click any story card to read the full account. You can share your own story and edit or delete it anytime.",
      },
      {
        q: "What are Discussion Forums?",
        a: "Discussion forums let Pro users ask questions, share advice, and connect with other pilots. Categories are organized by topic — license types, flight school experiences, DPE reviews, career advice, and more. Each category shows post count and latest activity. Click into a category to browse posts, then click any thread to read replies. You can create new posts with descriptive titles and reply to existing threads.",
      },
      {
        q: "How do I claim my free NavLog Pro account?",
        a: (
          <>
            Once you&apos;re on a Pro plan, go to the <Link href="/pricing" className="text-primary hover:underline">Pricing</Link> page and click &ldquo;Get your free NavLog Pro code.&rdquo; You&apos;ll receive a promo code to activate a free account at{" "}
            <a href="https://navlogpro.training/pricing" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">navlogpro.training/pricing</a>.
          </>
        ),
      },
    ],
  },
  {
    title: "Billing & Account",
    items: [
      {
        q: "How much does Pro cost?",
        a: (
          <>
            Pro is $8.99/month or $59.99/year ($5.00/month, saving 44%). NavLog Pro subscribers can upgrade for $29.99/year — a special rate available on the{" "}
            <Link href="/pricing" className="text-primary hover:underline">Pricing</Link> page. We also offer promo codes for discounted or free access.
          </>
        ),
      },
      {
        q: "I already have a NavLog Pro account. Can I use it to sign up here?",
        a: (
          <>
            Yes. On the <Link href="/pricing" className="text-primary hover:underline">Pricing</Link> page, scroll to &ldquo;Already have a NavLog Pro account?&rdquo; and enter your NavLog Pro email. You&apos;ll be taken to Stripe checkout for the $29.99/year NavLog Pro upgrade price. After payment, your iwanttobeapilot account is created automatically using your NavLog Pro email. Check your inbox for a welcome email with instructions to set your password.
          </>
        ),
      },
      {
        q: "How do I cancel my subscription?",
        a: (
          <>
            Go to <Link href="/settings" className="text-primary hover:underline">Settings</Link> and click &ldquo;Manage Subscription&rdquo; to access the Stripe billing portal, where you can cancel your subscription. Your Pro access continues through the end of the current billing period.
          </>
        ),
      },
      {
        q: "Do you offer refunds?",
        a: (
          <>
            Subscriptions auto-renew and can be canceled anytime from{" "}
            <Link href="/settings" className="text-primary hover:underline">Settings</Link>.
            We do not offer refunds for partial billing periods. If you believe a charge was made in error, contact{" "}
            <a href="mailto:support@iwanttobeapilot.online" className="text-primary hover:underline">support@iwanttobeapilot.online</a>{" "}
            within 7 days. By subscribing, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>{" "}
            and{" "}
            <Link href="/disclaimer" className="text-primary hover:underline">Aviation Disclaimer</Link>.
          </>
        ),
      },
      {
        q: "I have a promo code. How do I use it?",
        a: (
          <>
            Go to the <Link href="/pricing" className="text-primary hover:underline">Pricing</Link> page and scroll to the &ldquo;Have a promo code?&rdquo; section. Enter your code and click Apply. If valid, your account will be upgraded to Pro immediately.
          </>
        ),
      },
      {
        q: "How do I switch between light and dark mode?",
        a: (
          <>
            Go to <Link href="/settings" className="text-primary hover:underline">Settings</Link> and find the &ldquo;Appearance&rdquo; section at the top. Click &ldquo;Light&rdquo; or &ldquo;Dark&rdquo; to switch themes. Your preference is saved in your browser and persists across visits.
          </>
        ),
      },
      {
        q: "How do I change my password or email?",
        a: (
          <>
            Go to <Link href="/settings" className="text-primary hover:underline">Settings</Link> to update your name, email, or password. If you signed up with Google, use your Google account settings to manage your email.
          </>
        ),
      },
      {
        q: "How do I delete my account?",
        a: (
          <>
            You can permanently delete your account from <Link href="/settings" className="text-primary hover:underline">Settings</Link>. This removes all your personal data, stories, posts, and progress. This action cannot be undone.
          </>
        ),
      },
    ],
  },
  {
    title: "Contact & Support",
    items: [
      {
        q: "How do I contact support?",
        a: (
          <>
            Click the <strong className="text-foreground">Contact Support</strong> icon (life buoy) in the navigation bar to send us a message directly from the site. You can also email us at{" "}
            <a href="mailto:support@iwanttobeapilot.online" className="text-primary hover:underline">
              support@iwanttobeapilot.online
            </a>
            . We typically respond within 1–2 business days.
          </>
        ),
      },
      {
        q: "I found a bug or have a feature request.",
        a: (
          <>
            Use the <strong className="text-foreground">Contact Support</strong> button in the navigation bar, or email{" "}
            <a href="mailto:support@iwanttobeapilot.online" className="text-primary hover:underline">
              support@iwanttobeapilot.online
            </a>{" "}
            with as much detail as possible. Bug reports with steps to reproduce are especially helpful.
          </>
        ),
      },
    ],
  },
];

/* Build FAQPage JSON-LD from the sections array (plain-text answers only) */
function faqJsonLd() {
  const items = sections.flatMap((s) =>
    s.items.map((item) => ({
      "@type": "Question" as const,
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: typeof item.a === "string" ? item.a : item.q, // fallback for JSX answers
      },
    }))
  );
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items,
  };
}

export default function HelpPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }}
      />
      <div className="mb-10">
        <h1 className="text-2xl font-bold mb-2">Help & FAQ</h1>
        <p className="text-sm text-muted-foreground">
          Answers to common questions about using I Want To Be A Pilot.
        </p>
      </div>

      {/* Quick links */}
      <div className="flex flex-wrap gap-2 mb-10">
        {sections.map((s) => (
          <a
            key={s.title}
            href={`#${s.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
            className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
          >
            {s.title}
          </a>
        ))}
      </div>

      <div className="space-y-12">
        {sections.map((section) => (
          <div key={section.title} id={section.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}>
            <h2 className="text-base font-semibold mb-5 pb-2 border-b border-border">
              {section.title}
            </h2>
            <div className="space-y-6">
              {section.items.map((item) => (
                <div key={item.q}>
                  <p className="font-medium text-sm mb-1.5">{item.q}</p>
                  <div className="text-sm text-muted-foreground leading-relaxed">{item.a}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-border text-sm text-muted-foreground text-center">
        <p>Still have questions? Use the Contact Support button in the navigation bar or email us at</p>
        <a
          href="mailto:support@iwanttobeapilot.online"
          className="text-primary hover:underline font-medium"
        >
          support@iwanttobeapilot.online
        </a>
      </div>
    </div>
  );
}
