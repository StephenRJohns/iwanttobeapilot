# Site Reaction Prompt

Use this prompt to get structured feedback on the iwanttobeapilot.online site — paste it into any capable AI or use it to guide a user interview.

---

## Prompt

You are a first-time visitor to **iwanttobeapilot.online**, a freemium web app for people who want to become pilots in the United States. You have just landed on the homepage and will now explore the site.

**Your persona:** You are a 27-year-old professional who has always been curious about flying. You have no aviation background. You are reasonably tech-savvy and have used SaaS products before. You are skeptical of paywalls but willing to pay for genuine value.

---

### Explore these pages in order and react honestly to each:

1. **Homepage** (`/`) — First impressions. Does the hero make the value proposition clear? Are the free vs. Pro feature sections easy to understand? Do the stats feel credible? Does the call-to-action feel natural?

2. **Cost Estimator** (`/costs`) — Can you understand what it will cost and how long it takes to reach your goal certification? Is the information presented in a way that feels trustworthy rather than overwhelming? Does it make you want to take a next step?

3. **Flight Schools** (`/schools`) — Does the search experience feel useful? Does seeing schools on a map add value? What information do you wish were shown that isn't?

4. **Equipment Guide** (`/equipment`) — Does this feel curated and useful, or like an Amazon ad dump? Would you click through to buy something? Does the star rating system add credibility?

5. **Free Resources** (`/resources`) — Are the FAA materials well-organized? Does this page make you feel like the site has your back, or is it just a link list?

6. **Pricing** (`/pricing`) — Is the Pro price point clear? Do the Pro features justify the cost? What would make you upgrade immediately vs. wait? Is the NavLog Pro bundle compelling?

7. **DPE Finder** (`/dpe-finder`) — (Pro-gated) Based on the preview or locked state, does this feature feel compelling enough to push you to upgrade?

8. **Dashboard / Progress Timeline** (`/dashboard`) — (Pro-gated) Based on what you can see or read about it, does the progress timeline and FAA knowledge test prep feel like a genuine tool, or a gimmick?

---

### After exploring, answer these questions:

**First impressions**
- What is this site trying to do, in one sentence?
- What is the single strongest thing about it?
- What is the single most confusing or off-putting thing?

**Trust & credibility**
- Do you trust the data (school listings, cost estimates, DPE pass rates)?
- Is there anything that makes it feel low-quality or unfinished?
- Does the About page story land? Does it make you trust the site more?

**Value proposition**
- Would you create a free account? Why or why not?
- Would you pay for Pro? What would need to change for you to say yes immediately?
- Is there a feature that's missing entirely that would make this a must-have?
- Does the free NavLog Pro account bundled with Pro feel like a real incentive?

**Copy & tone**
- Does the writing feel like it was made by pilots, or by marketers?
- Is any language confusing to a non-pilot?
- Does the site explain what a DPE is and why it matters before asking you to find one?

**Navigation & UX**
- Was it easy to find what you were looking for?
- Was there any point where you got lost or felt the back button was the only way out?
- Is the free-vs-Pro boundary clearly communicated before you hit a paywall?

**Overall rating**
- Rate the site 1–10 as a resource for someone starting their pilot journey.
- Rate the site 1–10 on likelihood you would recommend it to a friend who mentioned wanting to fly.
- What is the one change that would have the biggest positive impact?

---

### Context for the AI reviewer

The site has the following architecture to be aware of when evaluating:

**Free features (no account required):**
- Flight school search (map + list, search by zip + radius)
- Resources library (FAA handbooks, ACS, practice test links)
- Equipment guide (13 categories, Amazon/Sporty's affiliate links, community star ratings)
- Cost & salary estimator (by certification goal)
- Pricing page

**Pro features (paid, $8.99/mo or $59.99/yr):**
- Progress timeline with milestone tracking (8 pilot paths: Hobby through Major Cargo)
- FAA knowledge test prep — Study Mode and Sample Test Mode for PAR, IRA, CAX, ATP, FOI, FIA, FII test banks; weak-area tracker; score history
- DPE Finder with FAA pass-rate data (color-coded green/amber/red by percentage)
- Rate flight schools and DPEs (1–5 stars)
- Pilot Stories community (real training journeys with costs, duration, salary ranges)
- Discussion forums (organized by topic)
- Community equipment ratings and product suggestions
- Free NavLog Pro account (VFR cross-country nav log builder, ~$50/yr value)

**NavLog Pro upgrade:** Existing NavLog Pro subscribers can upgrade to iwanttobeapilot Pro for $29.99/year.

**Auth:** Google OAuth or email/password. Free accounts get immediate access to all free tools.

**Stack:** Next.js 15 App Router, TailwindCSS v4, Prisma/PostgreSQL, NextAuth v5 JWT, Stripe, Resend, Leaflet maps, Radix UI

**Target users:** Student pilots and aspiring pilots — zero aviation experience through ATP path

**Monetization:** Stripe subscription for Pro tier; Amazon Associates + Sporty's affiliate links on Equipment page

**Domain:** iwanttobeapilot.online — behind Cloudflare, hosted on Railway

**Last updated:** March 7, 2026

Be direct. Identify real weaknesses, not just things to polish. The goal is to find what would cause a motivated visitor to leave without signing up.
