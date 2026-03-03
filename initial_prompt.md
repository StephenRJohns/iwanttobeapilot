# I Want To Be A Pilot — Build Prompt

Build a freemium pilot training web app at iwanttobeapilot.online. Handle admin, users, auth tokens, and intellectual property like the NavLogPro site. Use Next.js 15 App Router, TailwindCSS v4, Prisma + PostgreSQL, NextAuth v5 JWT, Stripe, and Resend.

---

## Free Features (no account required)

### Flight School Search
- Search FAA-certified flight schools by zip code
- Show results on an interactive Leaflet map
- Show a list below the map with name, address, phone, email, and website link for each school

### Free Resources
- Links to free FAA handbooks (PHAK, AFH, Instrument Flying Handbook)
- Airman Certification Standards (ACS) for each certificate type
- FAA practice written test resources
- Sectional chart tools and other reference materials

### Equipment Guide
- Curated list of gear pilots need: aviation headsets, flight bags, kneeboard apps, E6B calculators, sectional charts, foggles, iPads, iPad holders, thigh boards, sunglasses, sunscreen, clothes, luggage, and more
- Include NavLogPro (navlogpro.training) and PlaneFacts (planefacts.online) as featured tools
- Include ForeFlight, Garmin Pilot, and other popular apps
- Product images and affiliate links via Amazon Associates and Sporty's Pilot Shop
- Infrastructure for Amazon Associates affiliate tag (tag set via NEXT_PUBLIC_AMAZON_AFFILIATE_TAG env var)
- Pro users can rate and review equipment items

### Cost & Timeline Estimator
- Show estimate time (months), cost range, and salary range for each certification level
- Two paths: Hobby Path and Career Path
- Certification levels: Private Enthusiast → Student Pilot → Private Pilot → Instrument Rating → Commercial → Multi-engine → CFI → CFII → Private Charter → Regional Airline → Major Airline → Major Cargo
- Each level shows FAA requirements and "what to do next" steps

### Pricing Page
- Free tier vs. Pro tier comparison
- Monthly ($9.99) and annual ($99.99) billing options with 17% savings callout
- NavLogPro bundle callout (free NavLogPro account included with Pro, a $99/year value)
- Promo code redemption form

---

## Pro Features (paid subscription required)

### Progress Timeline (Dashboard)
- Visual timeline of all certification levels with expand/collapse cards
- Mark milestones as complete at each level
- Step-by-step guidance at each certification level

### DPE Finder
- Search Designated Pilot Examiners by name, certificate type, and state
- Show aggregate FAA checkride pass rate data from DPE data unifier MCP service
- DPE data sourced from FAA Civil Airmen Statistics (public domain per 17 U.S.C. § 105)
- "Coming soon" banner on directory while awaiting full FAA data release

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
- Promo code management (create, toggle active)
- Audit log viewer
- Site settings

### Payments
- Stripe with monthly and annual Pro plans
- Stripe webhook for subscription lifecycle events (created, updated, deleted)
- Stripe customer portal for self-serve billing management

### Email
- Resend for transactional email
- Email verification, password reset, welcome emails

### Partner Integration
- NavLogPro promo code generation API for Pro subscribers
- Codes delivered via pricing page after subscription confirmed

### Database
- Prisma + PostgreSQL
- Models: User, Account, Session, VerificationToken, PromoCode, TermsAcceptance, AuditLog, SiteSettings, UserProgress, FlightSchool, DPERecord, Rating, Story, DiscussionCategory, DiscussionPost, DiscussionReply

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
- Terms of Service, Privacy Policy, Aviation Disclaimer, and Help pages in footer

---

## Design
- Dark theme only (html class="dark")
- TailwindCSS v4 (CSS-first config, no tailwind.config.js)
- Radix UI primitives
- Text-only navigation (no icons in nav bar)
- Responsive with mobile hamburger menu

---

## Admin Account (seed)
- Email: admin@iwanttobeapilot.online
- Password: floofs!!QQ1209
