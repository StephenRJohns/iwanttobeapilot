import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Our Story",
  description:
    "The story behind I Want To Be A Pilot — built by a parent who watched two kids navigate flight training and wanted to make the journey easier for every aspiring pilot.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About — Our Story | I Want To Be A Pilot",
    description:
      "Built by a parent who watched two kids navigate flight training and wanted to make the journey easier for every aspiring pilot. Free tools, FAA knowledge test prep, DPE finder, and more.",
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <div className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full border border-primary/20 mb-4">
          Our Story
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">Why This Exists</h1>
        <p className="text-muted-foreground text-sm">
          A parent&apos;s experience turned into a complete platform for every aspiring pilot.
        </p>
      </div>

      <div className="prose prose-sm max-w-none space-y-6 text-foreground/90 leading-relaxed">
        <p>
          I built this site because I watched two of my kids go through pilot training, and I saw
          firsthand how hard it is to find clear, organized information about what to expect —
          the costs, the timelines, the schools, the exams, the career paths. There&apos;s no shortage
          of information out there, but it&apos;s scattered across forums, FAA PDFs, YouTube channels,
          and word of mouth. Both of my kids had to piece it all together the hard way.
        </p>

        <p>
          When they were going through training, I kept thinking: someone should just put all of
          this in one place. A straightforward guide that walks you through every stage — from
          deciding you want to fly, to understanding what a Private Pilot certificate actually costs
          and takes, to knowing what a DPE is and how to find a good one, to seeing what
          a career in aviation actually looks like financially.
        </p>

        <p>
          So I built it. Not as a business, but because it would have genuinely helped my kids — and
          I hope it helps yours, or you, or whoever is at the start of this journey.
        </p>

        <p>
          Everything on this site is designed around the questions I heard asked most: How much will
          this cost? How long will it take? Where do I find a flight school? What do I actually need
          to buy? Who should I take my checkride with? What does life look like after I get my
          certificate? Those are the questions that matter, and that&apos;s what this site is built to answer.
        </p>

        <div className="border-l-2 border-primary/30 pl-5 py-1 my-8">
          <p className="text-sm italic text-muted-foreground">
            &ldquo;Aviation is not just a career or a hobby — it&apos;s one of the most demanding and rewarding things
            a person can pursue. The least we can do is make the path a little clearer.&rdquo;
          </p>
        </div>

        <h2 className="text-lg font-semibold text-foreground mt-10 mb-2">What We Offer</h2>

        <p>
          <strong className="text-foreground">Free tools</strong> — our{" "}
          <Link href="/schools" className="text-primary hover:underline">flight school search</Link>,{" "}
          <Link href="/costs" className="text-primary hover:underline">cost &amp; timeline estimator</Link>,{" "}
          <Link href="/equipment" className="text-primary hover:underline">equipment guide</Link>, and{" "}
          <Link href="/resources" className="text-primary hover:underline">free resources</Link>{" "}
          are available to everyone, no account required. These are free because they should be.
        </p>

        <p>
          <strong className="text-foreground">FAA knowledge test prep</strong> — our{" "}
          <Link href="/dashboard" className="text-primary hover:underline">
            study and sample test system
          </Link>{" "}
          uses the official FAA test data banks — the same question pools used to create the actual
          FAA knowledge exams. We sync these directly from the FAA so your practice
          questions are always current and authentic. Study mode gives instant feedback on every question.
          Sample test mode simulates the real exam with full-length tests, score tracking, and a
          weak-area analyzer that targets the questions you miss most.
        </p>

        <p>
          <strong className="text-foreground">Pro features</strong> — the progress timeline, DPE finder with pass rate data,
          pilot stories, discussion forums, and equipment ratings exist to keep the lights on and fund continued
          development. Pro also includes a free{" "}
          <a href="https://navlogpro.training" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">NavLog Pro</a>{" "}
          account for VFR cross-country flight planning — our companion tool, also operated by us. If this site has helped you, a Pro account is
          the best way to say thanks and make sure it stays around.
        </p>

        <p>
          <strong className="text-foreground">Already a NavLog Pro user?</strong> You can upgrade to iwanttobeapilot Pro for{" "}
          <strong className="text-foreground">$29.99/year</strong> using your existing NavLog Pro email — your account is set up automatically. See the{" "}
          <Link href="/pricing" className="text-primary hover:underline">Pricing</Link> page for details.
        </p>

        <h2 className="text-lg font-semibold text-foreground mt-10 mb-2">Who We Are</h2>

        <p>
          I Want To Be A Pilot and NavLog Pro are both operated by JJJJJ Enterprises, LLC. We&apos;re an independent
          educational resource — not a flight school, not an FAA authority, and not affiliated with any
          airline or training organization. Our goal is simple: give aspiring pilots the clearest
          possible picture of what the journey looks like, from first flight to career.
        </p>
      </div>

      <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Link
          href="/costs"
          className="inline-flex items-center justify-center rounded-md border border-border bg-secondary/30 px-5 py-2.5 text-sm font-medium hover:bg-secondary transition-colors active:scale-[0.97]"
        >
          Explore Costs &amp; Timelines
        </Link>
        <Link
          href="/auth/register"
          className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors active:scale-[0.97]"
        >
          Create a Free Account
        </Link>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Questions or feedback?{" "}
        <a
          href="mailto:support@iwanttobeapilot.online"
          className="text-primary hover:underline"
        >
          support@iwanttobeapilot.online
        </a>
      </p>
    </div>
  );
}
