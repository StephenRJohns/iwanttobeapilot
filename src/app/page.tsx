import Link from "next/link";
import { PILOT_LEVELS } from "@/data/pilot-levels";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 px-4 sm:px-6 bg-gradient-to-b from-card to-background border-b border-border">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full border border-primary/20 mb-6">
            Your Complete Pilot Training Guide
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            I Want To Be A Pilot
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            From weekend hobbyist to major airline captain — everything you need to start
            and advance your flying journey in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <Link
              href="/auth/register"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              href="/costs"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-md border border-border bg-secondary/30 px-6 py-3 text-sm font-medium hover:bg-secondary transition-colors"
            >
              Explore Costs & Timelines
            </Link>
          </div>

          {/* Pilot level quick selector */}
          <div className="bg-card border border-border rounded-lg p-4 max-w-lg mx-auto">
            <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">
              Where do you want to go?
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {PILOT_LEVELS.map((level) => (
                <Link
                  key={level.id}
                  href={`/costs#${level.id}`}
                  className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  {level.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Free Features Grid */}
      <section id="features" className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2">Everything You Need, Free</h2>
          <p className="text-muted-foreground text-center mb-10 text-sm">
            Core tools to start your pilot journey — no account required
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {[
              {
                href: "/schools",
                title: "Flight Schools",
                description: "Find FAA-certified flight schools near you. Search by zip code, view on a map, get contact info.",
                icon: "🏫",
              },
              {
                href: "/resources",
                title: "Free Resources",
                description: "FAA handbooks, practice tests, study guides, and reference materials — all free.",
                icon: "📚",
              },
              {
                href: "/equipment",
                title: "Equipment Guide",
                description: "Headsets, bags, apps, books, and everything a pilot needs — with ratings from real pilots.",
                icon: "🎧",
              },
              {
                href: "/costs",
                title: "Cost Estimator",
                description: "Real cost and time estimates for every certification level, from student pilot to airline captain.",
                icon: "💰",
              },
            ].map((feature) => (
              <Link
                key={feature.href}
                href={feature.href}
                className="group rounded-lg border border-border bg-card p-5 hover:border-primary/50 transition-colors"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Link>
            ))}
          </div>

          {/* Pro Features */}
          <div className="bg-gradient-to-br from-primary/5 to-card rounded-xl border border-primary/20 p-8">
            <div className="text-center mb-8">
              <div className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full border border-primary/20 mb-3">
                Pro Membership
              </div>
              <h2 className="text-xl font-bold mb-2">Accelerate Your Training</h2>
              <p className="text-sm text-muted-foreground">
                Unlock your full pilot training toolkit with a Pro account
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {[
                {
                  title: "Progress Timeline",
                  description: "Visual milestone tracker with step-by-step guidance at each certification level.",
                  icon: "📊",
                },
                {
                  title: "DPE Finder",
                  description: "Find Designated Pilot Examiners near you. View FAA pass rate data to make informed choices.",
                  icon: "🔍",
                },
                {
                  title: "Rate Schools & DPEs",
                  description: "Read and leave honest reviews for flight schools and examiners.",
                  icon: "⭐",
                },
                {
                  title: "Pilot Stories",
                  description: "Real stories from real pilots — how long it took, what it cost, what they earn.",
                  icon: "✈",
                },
                {
                  title: "Discussion Forums",
                  description: "Connect with other aspiring pilots. Ask questions, share experiences, get advice.",
                  icon: "💬",
                },
                {
                  title: "Product Ratings",
                  description: "Community ratings and reviews on headsets, bags, apps, and more.",
                  icon: "🏆",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="flex items-start gap-3 rounded-lg bg-card/50 border border-border p-4"
                >
                  <span className="text-2xl">{feature.icon}</span>
                  <div>
                    <p className="text-sm font-medium mb-0.5">{feature.title}</p>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                View Pricing
              </Link>
              <p className="text-xs text-muted-foreground mt-2">
                Cancel anytime. Start with a free account.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 sm:px-6 border-t border-border bg-card/30">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: "12", label: "Certification Levels" },
              { value: "40+", label: "Hours for PPL" },
              { value: "$8K–$15K", label: "Typical PPL Cost" },
              { value: "$500K+", label: "Airline Captain Salary" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to Start Your Journey?</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Create a free account to track your progress, connect with other pilots, and access all Pro features.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-8 py-3 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}
