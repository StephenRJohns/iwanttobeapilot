# I Want To Be A Pilot — Build Prompt

Build a freemium pilot training web app at iwanttobeapilot.online. Handle admin, users, auth tokens, and intellectual property like the NavLogPro site. Use Next.js 15 App Router, TailwindCSS v4, Prisma + PostgreSQL, NextAuth v5 JWT, Stripe, and Resend.

---

## Free Features (no account required)

### Flight School Search
- Search FAA-certified flight schools by zip code and radius (25 / 50 / 100 / 200 mi)
- Show results on an interactive Leaflet map with a "Search This Area" button that activates when the map is panned or zoomed
- Paginated results table below the map: name, address, phone, website, distance
- Page size selector (10 / 25 / 50 / 100, default 10) and first / prev / next / last navigation
- Google Places (New) API with automatic fallback to Prisma DB when API is unavailable
- API accepts zip code (geocoded via zippopotam.us) or direct lat/lng coordinates (for map-based search)

### Free Resources
- Links to free FAA handbooks (PHAK, AFH, Instrument Flying Handbook)
- Airman Certification Standards (ACS) for each certificate type
- FAA practice written test resources
- Sectional chart tools and other reference materials

### Equipment Guide
- Curated list of gear pilots need: aviation headsets, flight bags, kneeboard apps, E6B calculators, sectional charts, foggles, iPads, iPad holders, thigh boards, sunglasses, sunscreen, clothes, luggage, and more
- Category filter pills and text search (filters by name and description)
- Result count display; "Suggest Equipment" modal for community submissions
- Include NavLogPro (navlogpro.training) and PlaneFacts (planefacts.online) as featured tools
- Include ForeFlight, Garmin Pilot, and other popular apps
- Product images: ONLY self-hosted images under /public/images/ (owner-permitted). Never hotlink Amazon CDN, Sporty's BigCommerce CDN, or any third-party retailer CDN — TOS violation. Items without a licensed image show a styled "No Image Available" placeholder.
- Affiliate links via Amazon Associates and Sporty's Pilot Shop
- Amazon affiliate tag via NEXT_PUBLIC_AMAZON_AFFILIATE_TAG env var (no hardcoded fallback)
- Pro users can rate equipment items (1–5 stars)

### Cost & Timeline Estimator
- Show estimate time (months), cost range, and salary range for each certification level
- Two paths: Hobby Path and Career Path
- Certification levels: Private Enthusiast → Student Pilot → Private Pilot → Instrument Rating → Commercial → Multi-engine → CFI → CFII → Private Charter → Regional Airline → Major Airline → Major Cargo
- Each level shows FAA requirements and "what to do next" steps

### Pricing Page
- Free tier vs. Pro tier comparison
- Monthly ($8.99) and annual ($59.99/year, $5.00/mo, 44% savings) billing options
- NavLogPro bundle callout (free NavLogPro account included with Pro, a $50/year value)
- NavLogPro Upgrade Pack: existing NavLogPro users can upgrade to iwanttobeapilot Pro for $29.99/year — enter NavLogPro email, verify via partner API, Stripe checkout, account auto-created
- Promo code redemption form

---

## Pro Features (paid subscription required)

### Progress Timeline (Dashboard)
- Visual timeline of all certification levels with expand/collapse cards
- Mark milestones as complete at each level
- Step-by-step guidance at each certification level
- FAA knowledge test badges (yellow) link to test prep for each milestone

### FAA Knowledge Test Prep
- Study Mode: pick specific Areas of Knowledge, set question count (10–100), instant feedback with explanations after every answer
- Sample Test Mode: full-length exam matching real FAA test (e.g., 60 questions for PAR), no peeking, results saved to history with score breakdown by subject
- "Questions to Work On" tab: tracks questions missed 2+ times, focused mini-test to drill weak spots
- Test banks: PAR, IRA, CAX, ATP, FOI, FIA, FII, and others synced from official FAA data
- Accessible via yellow test badges on Progress Timeline milestones

### DPE Finder
- Search Designated Pilot Examiners by name, certificate type, and state
- Show aggregate FAA checkride pass rate data from DPE data unifier MCP service
- DPE data sourced from FAA Civil Airmen Statistics (public domain per 17 U.S.C. § 105)

### Rate Schools & DPEs
- Pro users can leave star ratings and written reviews for flight schools and DPEs
- Ratings visible to all Pro users

### Pilot Stories
- Pro users can post their personal training story: certification levels, time, cost, current salary
- Stories browsable and searchable by other Pro users

### Discussion Forums
- Categorized discussion boards: by license type, school experience, DPE experience, job finding, current jobs, etc.
- Create posts, reply to threads
- Pro users only

### Equipment Ratings
- Pro users can rate equipment items (1–5 stars)

---

## Infrastructure

### Auth
- NextAuth v5 with JWT strategy (not DB sessions)
- Email/password credentials + Google OAuth
- Email verification on registration
- Password reset via email
- Session displacement (sign out other sessions on password change)
- Admin role separate from user tier

### Admin Panel
- User management (view, edit tier/role, ban)
- Promo code management: create single codes or batch blocks, revoke/un-revoke, view redeemers per code, assign codes to distributor users, bulk assign/unassign, force-delete redeemed codes
  - `GET /api/admin/promo-codes/[id]/users` — list users who redeemed a specific code
  - `POST /api/admin/promo-codes/assign` — assign/unassign codes to distributor by email; supports codeId or blockName (batch)
- Audit log viewer
- Site settings

### Payments
- Stripe with monthly ($8.99) and annual ($59.99) Pro plans
- NavLogPro upgrade plan ($29.99/year) via STRIPE_NAVLOGPRO_UPGRADE_PRICE_ID
- `src/lib/stripe.ts` exports `PLANS` object: `pro_monthly`, `pro_yearly`, `navlogpro_upgrade` — all priceIds from env vars
- Stripe API version: `2026-02-25.clover`
- Stripe webhook for subscription lifecycle events (created, updated, deleted)
- NavLogPro upgrade webhook path: find or create user by navlogpro_email metadata; new users get auto-created account + welcome email with forgot-password link
- Stripe customer portal for self-serve billing management
- NavLogPro upgrade checkout at /api/stripe/checkout/navlogpro (no auth required); verifies email via NavLogPro partner API before creating session; graceful degradation if NavLogPro is unreachable

### Email
- Resend for transactional email
- Email verification, password reset, welcome emails
- NavLogPro upgrade welcome email for newly created accounts

### Partner Integration
- NavLogPro promo code generation API for Pro subscribers (POST /api/partner/navlogpro-code → NavLogPro generates PILOT-XXXXXX code)
- NavLogPro email verification API for upgrade flow (POST /api/partner/navlogpro-verify → NavLogPro /api/partner/verify-user)
- Partner calls authenticated via x-partner-secret header (PARTNER_API_SECRET env var)
- Codes delivered via pricing page after subscription confirmed
- NavLogPro upgrade checkout at /api/stripe/checkout/navlogpro (no auth required)

### Database
- Prisma + PostgreSQL
- Models: User, Account, Session, VerificationToken, PromoCode (with assignedToUserId distributor relation), TermsAcceptance, AuditLog, SiteSettings, UserProgress, FlightSchool, DPERecord, Rating, Story, DiscussionCategory, DiscussionPost, DiscussionReply, PassRateCache, TestBankAttempt, TestBankWrongAnswer

### DPE Data
- MCP service at ~/github/dpe_data_unifier reads FAA Civil Airmen Statistics
- Cache file at ~/.cache/dpe-data-unifier/data.json
- API reads cache directly (bypasses MCP stdio in Next.js ESM environment)
- Cron job syncs data at 2am CDT (7am UTC)

---

## IP & Legal
- License: UNLICENSED (proprietary)
- Author: Stephen Johns
- Amazon affiliate tag via env var only (no hardcoded fallback)
- NavLogPro and PlaneFacts screenshots permitted (owner of both sites)
- FAA data: public domain per 17 U.S.C. § 105
- Equipment images: self-hosted only under /public/images/ — all external CDN hotlinks removed
- Third-party trademarks (Garmin, Sporty's, ForeFlight, etc.): nominative use only for product identification; covered in Terms
- react-leaflet: Hippocratic License 2.1 (ethics clause, non-copyleft, low risk for legitimate use)
- IP audit completed March 2026, re-confirmed with new endpoints — overall COMPLIANT (new routes: /api/stripe/checkout/navlogpro, /api/admin/promo-codes/[id]/users, /api/admin/promo-codes/assign)
- Footer: Terms of Service, Privacy Policy, Aviation Disclaimer links; copyright auto-increments from 2026
- Full Help & FAQ at /help; contextual per-page help via HelpPanel.tsx (HelpCircle icon in header)

---

## Navigation & UI
- Light/dark theme toggle (class-based, stored in localStorage under "theme"; dark is default)
- TailwindCSS v4 (CSS-first config, no tailwind.config.js)
- Radix UI primitives
- Global focus-visible ring (2px primary/50) and ::selection color (primary/20) in globals.css
- Body transitions for smooth theme switching
- Compact header: h-16, logo h-10, single-row horizontal nav with text-xs links and h-3.5 icons
- Free nav items (Pricing, Schools, Resources, Costs, Equipment) on the left
- Pricing link styled text-primary (not amber); all header icons use text-muted-foreground hover:text-foreground
- bg-border vertical divider + "Pro:" label separates free from pro nav items
- Pro nav items (Progress, DPEs, Stories, Forums) styled white/70, visible only when logged in
- Pricing link hidden for pro/admin users
- Right-side: HelpCircle (?), Contact Support (LifeBuoy), admin icon (if admin), Sign In / avatar+Sign Out
- HelpCircle opens contextual slide-in help panel (HelpPanel.tsx) with page-specific content based on usePathname()
- Contact Support icon opens modal that sends message to support@iwanttobeapilot.online via /api/contact
- Responsive mobile hamburger drawer with same free/pro split, bg-black/40 backdrop
- Sign Out uses window.location.origin + "/" as callbackUrl (avoids NEXTAUTH_URL port mismatch in dev)
- Lucide icons throughout — no emoji icons on homepage, resources, costs, or equipment pages
- Homepage feature cards and pro feature cards use Lucide icons (GraduationCap, BookOpen, Headphones, DollarSign, BarChart3, Search, Star, Plane, MessageCircle, Trophy)
- Resources section icons via ResourceIcon.tsx client component (BookOpen, Scale, PenTool, Cloud, Heart, Plane)
- Costs page: tab underline indicator (not background), ChevronDown/ChevronUp for expand/collapse
- Equipment: bg-muted product image backgrounds (dark-mode compatible), Lucide Star icons for ratings
- Card hover: hover:shadow-lg hover:border-primary/40 (no translate)
- Card component: shadow-sm with dark:shadow-md dark:shadow-black/20 for depth
- Input component: focus:ring-1 focus:ring-primary/30 for clearer focus state
- Auth pages: logo image instead of text, Google SVG icon on OAuth button, max-w-md forms, ring-1 ring-border on inputs
- Micro-animations: active:scale-[0.97] on CTA buttons
- Loading skeletons (animate-pulse) replace spinners for page-level loading states
- Reusable EmptyState component for zero-result states
- Custom error.tsx (global error boundary with "Try Again" + "Go Home") and not-found.tsx (aviation-themed 404)
- Footer: 4-column grid (Brand, Product, Legal, Support) with text-sm links + compact bottom copyright bar
- Founder section: Quote icon accent above testimonial text

---

## Admin Account (seed)
- Email and password read from ADMIN_EMAIL and ADMIN_PASSWORD environment variables
- Never hardcode credentials in source files — scripts/fix-admin.ts, scripts/check-admin.ts, and prisma/seed.ts all read from env
- Admin deletion guard in API routes also uses process.env.ADMIN_EMAIL
