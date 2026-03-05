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
            Pro features require a free account and a Pro subscription.
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
            Go to <Link href="/schools" className="text-primary hover:underline">Schools</Link> and enter your zip code and search radius. The map will show FAA-certified flight schools near you, and a paginated table below includes each school&apos;s name, address, phone number, website, and distance. You can pan or zoom the map and click the &ldquo;Search This Area&rdquo; button to re-search from the new location. No account required.
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
            The <Link href="/equipment" className="text-primary hover:underline">Equipment Guide</Link> lists gear pilots commonly need — aviation headsets, flight bags, kneeboard apps, E6B calculators, sectional charts, sunglasses, sunscreen, and more. Items link to Amazon or Sporty&apos;s Pilot Shop for purchase. Pro users can rate and review items.
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
            Pro unlocks: visual progress timeline with milestone guidance, DPE finder with FAA pass rate data, the ability to rate flight schools and DPEs, pilot stories community, discussion forums, and equipment ratings. Pro also includes a free{" "}
            <a href="https://navlogpro.training" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">NavLogPro</a>{" "}
            account (FAA cross-country nav log builder, a $50/year value). See{" "}
            <Link href="/pricing" className="text-primary hover:underline">Pricing</Link> for full details.
          </>
        ),
      },
      {
        q: "How does the Progress Timeline work?",
        a: "The Progress Timeline (in Dashboard) shows a visual roadmap of all pilot certification levels. Expand any level card to see a \"What You Will Learn\" summary, a collapsible recommended gear section for that stage, step-by-step milestone guidance, and next steps. Check off milestones as you complete them. It tracks your journey from student pilot to whatever goal you set.",
      },
      {
        q: "How does the DPE Finder work?",
        a: "The DPE Finder lets you search for FAA Designated Pilot Examiners by name, certificate type, and state. Where available, it displays aggregate checkride pass rate data from FAA Civil Airmen Statistics records so you can make an informed choice. DPE directory data is sourced from public FAA records and may not reflect real-time availability — always verify directly with the examiner.",
      },
      {
        q: "What are Pilot Stories?",
        a: "Pilot Stories is a community feature where Pro users can share their personal training journey — including certification levels achieved, how long each took, total costs, and current salary. You can read stories from other pilots to set realistic expectations for your own path.",
      },
      {
        q: "What are Discussion Forums?",
        a: "Discussion forums let Pro users ask questions, share advice, and connect with other pilots by topic — license types, school experiences, DPE experiences, job searching, and more. Create posts, reply to threads, and build your pilot network.",
      },
      {
        q: "How do I claim my free NavLogPro account?",
        a: (
          <>
            Once you&apos;re on a Pro plan, go to the <Link href="/pricing" className="text-primary hover:underline">Pricing</Link> page and click &ldquo;Get your free NavLogPro code.&rdquo; You&apos;ll receive a promo code to activate a free account at{" "}
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
            Pro is $9.99/month or $99.99/year ($8.33/month, saving 17%). See{" "}
            <Link href="/pricing" className="text-primary hover:underline">Pricing</Link> for current rates. We also offer promo codes for discounted or free access.
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

export default function HelpPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
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
