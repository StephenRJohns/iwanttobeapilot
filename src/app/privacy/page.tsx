import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for I Want To Be A Pilot (iwanttobeapilot.online). Learn how we collect, use, and protect your personal information.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: false },
  openGraph: {
    title: "Privacy Policy | I Want To Be A Pilot",
    description: "Privacy Policy for I Want To Be A Pilot — how we collect, use, and protect your personal information.",
  },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: March 7, 2026</p>

      <p className="text-sm text-muted-foreground mb-8">
        This Privacy Policy describes how I Want To Be A Pilot (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) collects, uses, and shares information about you when you use our website at iwanttobeapilot.online (the &ldquo;Service&rdquo;). By using the Service, you agree to the practices described in this policy.
      </p>

      <div className="space-y-8 text-sm leading-relaxed">

        <section>
          <h2 className="font-semibold text-base mb-3">1. Information We Collect</h2>
          <p className="text-muted-foreground mb-3">We collect the following categories of information:</p>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Information you provide directly</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li><strong className="text-foreground">Account data:</strong> name, email address, hashed password</li>
                <li><strong className="text-foreground">Profile data:</strong> pilot goal, zip code, pilot level</li>
                <li><strong className="text-foreground">User content:</strong> pilot stories, discussion posts, replies, equipment ratings</li>
                <li><strong className="text-foreground">Support communications:</strong> emails you send us and messages submitted through the in-app Contact Support form</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-1">Information collected automatically</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li><strong className="text-foreground">Progress data:</strong> your pilot training milestone completion status, FAA knowledge test study session scores, sample test attempt history (date, score, answers), and weak-area tracking data</li>
                <li><strong className="text-foreground">Session data:</strong> authentication tokens stored in secure HTTP-only cookies</li>
                <li><strong className="text-foreground">Log data:</strong> server logs may include IP address, browser type, pages visited, and timestamps</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-1">Information from third parties</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li><strong className="text-foreground">Google OAuth:</strong> name and email address if you choose Google Sign-In</li>
                <li><strong className="text-foreground">Stripe:</strong> subscription status and billing metadata (we never see or store your full card number)</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-3">2. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>To create and manage your account</li>
            <li>To provide, operate, and improve the Service</li>
            <li>To process payments and manage your subscription via Stripe</li>
            <li>To send transactional emails (account verification, password reset, welcome) via Resend</li>
            <li>To display your public content (stories, posts) to other Pro users</li>
            <li>To track your pilot training progress and milestones</li>
            <li>To detect and prevent fraud, abuse, and violations of our Terms</li>
            <li>To respond to your support requests</li>
            <li>To comply with legal obligations</li>
          </ul>
          <p className="text-muted-foreground mt-3">
            We do not sell your personal information to third parties. We do not use your data for advertising or share it with data brokers.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-3">3. How We Share Your Information</h2>
          <p className="text-muted-foreground mb-2">We share your information only in the following circumstances:</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong className="text-foreground">Service providers:</strong> We use Stripe for payment processing, Resend for email delivery, and Railway (railway.app) for cloud hosting and managed PostgreSQL database storage. These providers process data on our behalf under contractual obligations.</li>
            <li><strong className="text-foreground">Public content:</strong> Stories and discussion posts you mark as public are visible to other logged-in Pro users.</li>
            <li><strong className="text-foreground">Legal requirements:</strong> We may disclose your information if required by law, court order, or governmental authority.</li>
            <li><strong className="text-foreground">Business transfers:</strong> If we sell or transfer the Service, your information may be transferred as part of that transaction, with advance notice to you.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-3">4. Third-Party Services</h2>
          <p className="text-muted-foreground mb-2">The following third parties process data in connection with the Service:</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>
              <strong className="text-foreground">Stripe</strong> — payment processing.{" "}
              <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">stripe.com/privacy</a>
            </li>
            <li>
              <strong className="text-foreground">Google</strong> — optional OAuth sign-in.{" "}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">policies.google.com/privacy</a>
            </li>
            <li>
              <strong className="text-foreground">Resend</strong> — transactional email delivery.{" "}
              <a href="https://resend.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">resend.com/privacy</a>
            </li>
            <li>
              <strong className="text-foreground">Leaflet / OpenStreetMap</strong> — interactive maps for flight school and DPE locations use the Leaflet library with OpenStreetMap tile data. No account or API key is required; map tiles are fetched directly from OpenStreetMap servers. See{" "}
              <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">openstreetmap.org/copyright</a>.
            </li>
            <li>
              <strong className="text-foreground">Amazon Associates / Sporty&apos;s</strong> — affiliate links on the Equipment page and training timeline. Clicking these links may set third-party cookies subject to their privacy policies.
            </li>
            <li>
              <strong className="text-foreground">Railway</strong> — cloud application hosting and PostgreSQL database.{" "}
              <a href="https://railway.app/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">railway.app/legal/privacy</a>
            </li>
            <li>
              <strong className="text-foreground">Cloudflare</strong> — DNS, CDN, and DDoS protection. Cloudflare processes network traffic data including IP addresses.{" "}
              <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">cloudflare.com/privacypolicy</a>
            </li>
            <li>
              <strong className="text-foreground">NavLog Pro (navlogpro.training)</strong> — companion service operated by the same team. When you use the NavLog Pro Upgrade flow on the Pricing page, we verify your email against NavLog Pro solely to confirm account existence — no passwords or payment data are exchanged between services. When you are a Pro subscriber, we send your email to NavLog Pro to generate a complimentary account promo code. See{" "}
              <a href="https://navlogpro.training/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">navlogpro.training/privacy</a>.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-3">5. Cookies and Tracking</h2>
          <p className="text-muted-foreground mb-2">We use the following types of cookies:</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong className="text-foreground">Session cookies:</strong> Secure, HTTP-only cookies used exclusively for authentication. These are required for the Service to function.</li>
            <li><strong className="text-foreground">CSRF tokens:</strong> Short-lived tokens to prevent cross-site request forgery.</li>
            <li><strong className="text-foreground">Theme preference:</strong> Your light/dark mode choice is stored in your browser&apos;s <code className="text-xs bg-muted px-1 py-0.5 rounded">localStorage</code> under the key <code className="text-xs bg-muted px-1 py-0.5 rounded">theme</code>. This is local to your device and is never transmitted to our servers.</li>
          </ul>
          <p className="text-muted-foreground mt-2">
            We do not use advertising cookies, tracking pixels, or third-party analytics services. Third-party affiliate links (Amazon, Sporty&apos;s) may set their own cookies when you click them; we do not control those cookies.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-3">6. Data Security</h2>
          <p className="text-muted-foreground">
            We implement industry-standard security measures including HTTPS encryption in transit, bcrypt password hashing, HTTP-only session cookies, and access controls on our database. No method of transmission over the internet is 100% secure; we cannot guarantee absolute security of your data.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-3">7. Data Retention</h2>
          <p className="text-muted-foreground">
            We retain your account data for as long as your account is active. If you delete your account from Settings, all personal data associated with your account — including profile data, progress data, stories, and posts — is permanently deleted within 30 days. Anonymized aggregate data may be retained indefinitely.
          </p>
          <p className="text-muted-foreground mt-2">
            Stripe retains billing records as required by their policies and applicable law, independent of your account deletion.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-3">8. Your Rights and Choices</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong className="text-foreground">Access and correction:</strong> You can view and update your profile information in Settings at any time.</li>
            <li><strong className="text-foreground">Deletion:</strong> You can delete your account in Settings. This permanently removes all your personal data.</li>
            <li><strong className="text-foreground">Data portability:</strong> Contact us to request an export of your data.</li>
            <li><strong className="text-foreground">Opt-out of emails:</strong> Transactional emails (verification, password reset) are required for account security and cannot be opted out of while you have an active account.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-3">9. Children&apos;s Privacy</h2>
          <p className="text-muted-foreground">
            The Service is not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us immediately and we will delete it.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-3">10. California Residents (CCPA)</h2>
          <p className="text-muted-foreground">
            California residents have additional rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information we collect, the right to delete your personal information, and the right to opt out of the sale of personal information. We do not sell personal information. To exercise your rights, contact us at privacy@iwanttobeapilot.online.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-3">11. International Users</h2>
          <p className="text-muted-foreground">
            The Service is operated in the United States. If you access the Service from outside the United States, your information will be transferred to and processed in the United States, where data protection laws may differ from those in your country. By using the Service, you consent to this transfer.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-3">12. Changes to This Policy</h2>
          <p className="text-muted-foreground">
            We may update this Privacy Policy from time to time. We will notify you of material changes by updating the &ldquo;Last updated&rdquo; date at the top of this page. Your continued use of the Service after changes constitutes acceptance of the revised policy.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-3">13. Contact</h2>
          <p className="text-muted-foreground">
            Privacy questions or requests? Contact us at{" "}
            <a href="mailto:privacy@iwanttobeapilot.online" className="text-primary hover:underline">
              privacy@iwanttobeapilot.online
            </a>
            .
          </p>
        </section>

      </div>
    </div>
  );
}
