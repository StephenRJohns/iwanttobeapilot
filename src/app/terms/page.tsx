import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-bold mb-2">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: March 2026</p>

      <div className="space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="font-semibold mb-2">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground">
            By accessing or using I Want To Be A Pilot (&ldquo;the Service&rdquo;), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">2. Educational Use Only</h2>
          <p className="text-muted-foreground">
            The Service provides educational information about pilot training, flight schools, and aviation careers. All content is for informational purposes only and does not constitute professional aviation, legal, or financial advice. Always consult qualified aviation professionals and refer to official FAA publications for regulatory guidance.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">3. User Accounts</h2>
          <p className="text-muted-foreground">
            You are responsible for maintaining the confidentiality of your account credentials. You must be at least 13 years of age to use the Service. You agree to provide accurate information during registration.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">4. Subscriptions and Payments</h2>
          <p className="text-muted-foreground">
            Pro subscriptions are billed monthly or annually via Stripe. Subscriptions renew automatically unless cancelled. Refunds are handled at our discretion. You may cancel at any time through your account settings or by contacting us.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">5. User Content</h2>
          <p className="text-muted-foreground">
            By posting stories, discussions, or other content, you grant us a non-exclusive license to display that content on the Service. You are responsible for ensuring your content does not violate any laws or third-party rights. We reserve the right to remove content at our discretion.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">6. Affiliate Links</h2>
          <p className="text-muted-foreground">
            The Equipment page contains Amazon affiliate links. We may earn a commission on qualifying purchases at no extra cost to you. These commissions help support the Service.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">7. Limitation of Liability</h2>
          <p className="text-muted-foreground">
            The Service is provided &ldquo;as is&rdquo; without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the Service. Our total liability is limited to the amount you paid us in the last 12 months.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">8. Changes to Terms</h2>
          <p className="text-muted-foreground">
            We may update these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">9. Contact</h2>
          <p className="text-muted-foreground">
            Questions about these Terms? Contact us at support@iwanttobeapilot.online.
          </p>
        </section>
      </div>
    </div>
  );
}
