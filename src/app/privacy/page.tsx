import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: March 2026</p>

      <div className="space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="font-semibold mb-2">Information We Collect</h2>
          <p className="text-muted-foreground mb-2">We collect the following information when you use the Service:</p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li><strong className="text-foreground">Account information:</strong> name, email address, hashed password</li>
            <li><strong className="text-foreground">Profile data:</strong> pilot goal, zip code</li>
            <li><strong className="text-foreground">Progress data:</strong> your pilot training milestone status</li>
            <li><strong className="text-foreground">User content:</strong> stories and discussion posts you create</li>
            <li><strong className="text-foreground">Payment data:</strong> processed by Stripe (we do not store card numbers)</li>
            <li><strong className="text-foreground">Authentication data:</strong> Google OAuth tokens (if using Google Sign-In)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold mb-2">How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>To provide and improve the Service</li>
            <li>To process payments and manage subscriptions</li>
            <li>To send transactional emails (verification, password reset) via Resend</li>
            <li>To display your public content (stories, discussions) to other users</li>
            <li>To enforce our Terms of Service</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Third-Party Services</h2>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li><strong className="text-foreground">Stripe:</strong> payment processing — <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">stripe.com/privacy</a></li>
            <li><strong className="text-foreground">Google OAuth:</strong> optional sign-in — <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">policies.google.com/privacy</a></li>
            <li><strong className="text-foreground">Resend:</strong> transactional email delivery</li>
            <li><strong className="text-foreground">Amazon Associates:</strong> affiliate links on the Equipment page</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Data Retention</h2>
          <p className="text-muted-foreground">
            We retain your data for as long as your account is active. You may delete your account at any time from Settings, which permanently removes all your data.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Cookies</h2>
          <p className="text-muted-foreground">
            We use session cookies for authentication. We do not use tracking or advertising cookies.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Your Rights</h2>
          <p className="text-muted-foreground">
            You may access, update, or delete your personal information at any time through your account Settings. For additional requests, contact us at support@iwanttobeapilot.online.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Contact</h2>
          <p className="text-muted-foreground">
            Privacy questions? Contact us at support@iwanttobeapilot.online.
          </p>
        </section>
      </div>
    </div>
  );
}
