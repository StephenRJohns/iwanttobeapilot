import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for I Want To Be A Pilot (iwanttobeapilot.online). Read our terms covering subscriptions, user content, affiliate links, and more.",
  robots: { index: true, follow: false },
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-bold mb-2">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: March 2026</p>

      <div className="space-y-8 text-sm leading-relaxed">

        <section>
          <h2 className="font-semibold text-base mb-3">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground">
            By accessing or using I Want To Be A Pilot (&ldquo;the Service,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) at iwanttobeapilot.online, you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;) and our Privacy Policy. If you do not agree to these Terms, do not use the Service.
          </p>
          <p className="text-muted-foreground mt-2">
            We may update these Terms at any time. We will notify you of significant changes by updating the &ldquo;Last updated&rdquo; date above. Continued use of the Service after any change constitutes acceptance of the revised Terms.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-3">2. Description of Service</h2>
          <p className="text-muted-foreground">
            I Want To Be A Pilot is an educational web application that provides information about pilot training, flight schools, aviation equipment, career paths, and community features for aspiring and current pilots. The Service offers both free and paid (&ldquo;Pro&rdquo;) tiers. For background on why this site was built, see the <a href="/about" className="text-primary hover:underline">About</a> page.
          </p>
          <p className="text-muted-foreground mt-2">
            <strong className="text-foreground">All content is for educational and informational purposes only.</strong> Nothing on this Service constitutes official FAA guidance, professional flight instruction, legal advice, or financial advice. See our Aviation Disclaimer for full details.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-3">3. Eligibility and Accounts</h2>
          <ul className="space-y-2 text-muted-foreground list-disc list-inside">
            <li>You must be at least 13 years of age to create an account.</li>
            <li>You must provide accurate, complete, and current registration information.</li>
            <li>You are responsible for maintaining the security of your account credentials.</li>
            <li>You are responsible for all activity that occurs under your account.</li>
            <li>You must notify us immediately of any unauthorized use of your account.</li>
            <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-3">4. Subscriptions and Payments</h2>
          <p className="text-muted-foreground mb-2">
            Pro subscriptions are available on monthly or annual billing cycles. All payments are processed securely by Stripe. By subscribing, you authorize recurring charges to your payment method.
          </p>
          <ul className="space-y-2 text-muted-foreground list-disc list-inside">
            <li><strong className="text-foreground">Auto-renewal:</strong> Subscriptions renew automatically at the end of each billing period unless cancelled.</li>
            <li><strong className="text-foreground">Cancellation:</strong> You may cancel at any time through your account Settings or by contacting us. Cancellation takes effect at the end of the current billing period; you retain Pro access until then.</li>
            <li><strong className="text-foreground">No refunds for partial periods:</strong> We do not offer refunds for unused portions of any billing period. Refunds are issued at our sole discretion for billing errors only. Contact <a href="mailto:support@iwanttobeapilot.online" className="text-primary hover:underline">support@iwanttobeapilot.online</a> within 7 days of a charge if you believe a refund is warranted.</li>
            <li><strong className="text-foreground">Price changes:</strong> We may change subscription prices with at least 30 days&apos; notice. Continued use after a price change constitutes acceptance of the new pricing.</li>
            <li><strong className="text-foreground">Promo codes:</strong> Promotional codes are one-time use, non-transferable, and may have expiration dates. We reserve the right to revoke codes used fraudulently.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-3">5. Partner Benefits (NavLogPro)</h2>
          <p className="text-muted-foreground">
            Pro subscribers may be eligible for a complimentary NavLogPro account as a bundled partner benefit. This benefit is subject to availability, the terms of the NavLogPro service (navlogpro.training), and may be modified or discontinued at any time. The NavLogPro service is operated independently; its terms and privacy policy govern your use of that service.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-3">6. User Content</h2>
          <p className="text-muted-foreground mb-2">
            The Service allows you to post stories, discussion posts, replies, ratings, and other content (&ldquo;User Content&rdquo;).
          </p>
          <ul className="space-y-2 text-muted-foreground list-disc list-inside">
            <li>You retain ownership of User Content you create.</li>
            <li>By posting User Content, you grant us a non-exclusive, royalty-free, worldwide license to display, reproduce, and distribute that content within the Service.</li>
            <li>You represent that your User Content does not violate any applicable laws or third-party rights.</li>
            <li>We reserve the right to remove User Content at our discretion, without notice, for any reason including violation of these Terms.</li>
          </ul>
          <p className="text-muted-foreground mt-3 font-medium text-foreground">You agree not to post content that:</p>
          <ul className="space-y-1 text-muted-foreground list-disc list-inside mt-1">
            <li>Is false, misleading, or fraudulent</li>
            <li>Is defamatory, abusive, harassing, or threatening</li>
            <li>Infringes any patent, trademark, copyright, or other proprietary right</li>
            <li>Contains spam, advertisements, or unsolicited promotions</li>
            <li>Violates any applicable law or regulation</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-3">7. Intellectual Property</h2>
          <p className="text-muted-foreground">
            The Service, including its design, code, text, graphics, logos, and compilation of content (excluding User Content), is the property of JJJJJ Enterprises, LLC and protected by applicable intellectual property laws. You may not copy, reproduce, distribute, modify, or create derivative works of any part of the Service without our express written permission.
          </p>
          <p className="text-muted-foreground mt-2">
            FAA data, civil airmen statistics, and other government records used in this Service are public domain under 17 U.S.C. § 105. Third-party product names, logos, and trademarks are the property of their respective owners and are used for identification purposes only.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-3">8. Affiliate Links and Sponsored Content</h2>
          <p className="text-muted-foreground">
            The Equipment page contains affiliate links to Amazon and Sporty&apos;s Pilot Shop. When you click an affiliate link and make a qualifying purchase, we may earn a small commission at no additional cost to you. We only recommend products we believe are useful for pilots. Affiliate relationships do not influence our editorial content. All product images on the Equipment page are either self-hosted with permission or replaced with a &ldquo;No Image Available&rdquo; placeholder; we do not hotlink third-party product CDNs.
          </p>
          <p className="text-muted-foreground mt-2">
            Interactive maps on this site use the Leaflet open-source library and OpenStreetMap tile data, which is &copy; OpenStreetMap contributors and made available under the Open Database License (ODbL). Map data is used for display purposes only and is not reproduced, redistributed, or modified by us.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-3">9. Prohibited Conduct</h2>
          <p className="text-muted-foreground mb-2">You agree not to:</p>
          <ul className="space-y-1 text-muted-foreground list-disc list-inside">
            <li>Use the Service for any unlawful purpose</li>
            <li>Attempt to gain unauthorized access to any part of the Service</li>
            <li>Scrape, crawl, or data-mine the Service without our written permission</li>
            <li>Interfere with or disrupt the integrity or performance of the Service</li>
            <li>Impersonate any person or entity</li>
            <li>Use automated bots or scripts to interact with the Service</li>
            <li>Share your account credentials or allow others to use your account</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-3">10. Disclaimer of Warranties</h2>
          <p className="text-muted-foreground">
            THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-3">11. Limitation of Liability</h2>
          <p className="text-muted-foreground">
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR GOODWILL. OUR TOTAL LIABILITY FOR ANY CLAIM ARISING OUT OF THESE TERMS OR YOUR USE OF THE SERVICE IS LIMITED TO THE AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE CLAIM, OR $10.00, WHICHEVER IS GREATER.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-3">12. Indemnification</h2>
          <p className="text-muted-foreground">
            You agree to indemnify, defend, and hold harmless JJJJJ Enterprises, LLC and its agents from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorneys&apos; fees, arising out of or in any way connected with your access to or use of the Service, your violation of these Terms, or your User Content.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-3">13. Governing Law and Disputes</h2>
          <p className="text-muted-foreground">
            These Terms are governed by the laws of the United States. Any dispute arising from these Terms or your use of the Service shall first be addressed through good-faith negotiation. If unresolved, disputes shall be submitted to binding arbitration in accordance with the American Arbitration Association&apos;s rules. You waive any right to a jury trial or to participate in a class action.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-3">14. Termination</h2>
          <p className="text-muted-foreground">
            We may suspend or terminate your access to the Service at any time, with or without cause, with or without notice. Upon termination, your right to use the Service ceases immediately. Sections 7, 10, 11, 12, and 13 survive termination.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-3">15. Contact</h2>
          <p className="text-muted-foreground">
            Questions about these Terms? Contact us at{" "}
            <a href="mailto:support@iwanttobeapilot.online" className="text-primary hover:underline">
              support@iwanttobeapilot.online
            </a>
            .
          </p>
        </section>

      </div>
    </div>
  );
}
