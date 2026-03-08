import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @page { margin: 0.75in 1in; }
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #1a1a2e;
    line-height: 1.6;
    font-size: 11pt;
  }
  .cover {
    text-align: center;
    padding-top: 2.5in;
    page-break-after: always;
  }
  .cover h1 {
    font-size: 36pt;
    color: #0f3460;
    margin-bottom: 0.2em;
    letter-spacing: -0.5px;
  }
  .cover .subtitle {
    font-size: 18pt;
    color: #16213e;
    margin-bottom: 0.5em;
  }
  .cover .url {
    font-size: 14pt;
    color: #e94560;
    margin-bottom: 2em;
  }
  .cover .meta {
    font-size: 11pt;
    color: #555;
    margin-top: 2em;
    line-height: 2;
  }
  .cover .meta strong { color: #1a1a2e; }
  .confidential {
    margin-top: 3em;
    font-size: 9pt;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  h2 {
    font-size: 18pt;
    color: #0f3460;
    border-bottom: 2px solid #e94560;
    padding-bottom: 4px;
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    page-break-after: avoid;
  }
  h3 {
    font-size: 13pt;
    color: #16213e;
    margin-top: 1.2em;
    margin-bottom: 0.3em;
    page-break-after: avoid;
  }
  h4 {
    font-size: 11pt;
    color: #0f3460;
    margin-top: 1em;
    margin-bottom: 0.2em;
    page-break-after: avoid;
  }
  p, li { margin-bottom: 0.3em; }
  ul { padding-left: 1.2em; }
  li { margin-bottom: 0.25em; }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 0.8em 0;
    font-size: 10pt;
  }
  th {
    background: #0f3460;
    color: white;
    padding: 8px 10px;
    text-align: left;
    font-weight: 600;
  }
  td {
    padding: 6px 10px;
    border-bottom: 1px solid #ddd;
  }
  tr:nth-child(even) td { background: #f8f9fa; }

  .highlight-box {
    background: #eef2ff;
    border-left: 4px solid #e94560;
    padding: 12px 16px;
    margin: 1em 0;
    border-radius: 0 6px 6px 0;
  }
  .kpi-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;
    margin: 1em 0;
  }
  .kpi-card {
    background: #f0f4ff;
    border: 1px solid #c8d6e5;
    border-radius: 8px;
    padding: 14px;
    text-align: center;
  }
  .kpi-card .number {
    font-size: 20pt;
    font-weight: 700;
    color: #0f3460;
  }
  .kpi-card .label {
    font-size: 9pt;
    color: #555;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .timeline {
    position: relative;
    padding-left: 20px;
    border-left: 3px solid #e94560;
    margin: 1em 0;
  }
  .timeline .phase {
    margin-bottom: 1em;
    position: relative;
  }
  .timeline .phase::before {
    content: '';
    width: 12px;
    height: 12px;
    background: #e94560;
    border-radius: 50%;
    position: absolute;
    left: -27px;
    top: 4px;
  }
  .timeline .phase-title {
    font-weight: 700;
    color: #0f3460;
  }
  .page-break { page-break-before: always; }
  .toc { margin: 1em 0; }
  .toc li { margin-bottom: 0.4em; list-style: none; }
  .toc li::before { content: none; }
  .section-num { color: #e94560; font-weight: 700; margin-right: 6px; }
</style>
</head>
<body>

<!-- COVER PAGE -->
<div class="cover">
  <h1>Marketing Plan</h1>
  <div class="subtitle">I Want To Be A Pilot</div>
  <div class="url">iwanttobeapilot.online</div>
  <div class="meta">
    <strong>Prepared:</strong> March 2026<br>
    <strong>Plan Period:</strong> Q2 2026 &ndash; Q1 2027 (12 Months)<br>
    <strong>Version:</strong> 1.0
  </div>
  <div class="confidential">Confidential &mdash; Internal Use Only</div>
</div>

<!-- TABLE OF CONTENTS -->
<h2>Table of Contents</h2>
<ul class="toc">
  <li><span class="section-num">1</span> Executive Summary</li>
  <li><span class="section-num">2</span> Situation Analysis</li>
  <li><span class="section-num">3</span> Target Market &amp; Personas</li>
  <li><span class="section-num">4</span> Competitive Landscape</li>
  <li><span class="section-num">5</span> Goals &amp; KPIs</li>
  <li><span class="section-num">6</span> Brand Positioning &amp; Messaging</li>
  <li><span class="section-num">7</span> Marketing Channels &amp; Tactics</li>
  <li><span class="section-num">8</span> Content Strategy</li>
  <li><span class="section-num">9</span> Partnerships &amp; Influencer Strategy</li>
  <li><span class="section-num">10</span> 12-Month Execution Timeline</li>
  <li><span class="section-num">11</span> Budget Allocation</li>
  <li><span class="section-num">12</span> Measurement &amp; Optimization</li>
  <li><span class="section-num">13</span> Risk Mitigation</li>
</ul>

<div class="page-break"></div>

<!-- 1. EXECUTIVE SUMMARY -->
<h2><span class="section-num">1</span> Executive Summary</h2>
<p><strong>I Want To Be A Pilot</strong> (iwanttobeapilot.online) is a freemium web platform that guides aspiring pilots from first interest through airline career. Built by a parent who watched two children earn their wings, the site combines free tools&mdash;flight school search, cost estimator, equipment guide, and FAA resources&mdash;with a Pro subscription ($9.99/mo or $99.99/yr) that unlocks a progress tracker, DPE finder with FAA pass rates, community features, and a free NavLog Pro account.</p>

<p>This 12-month marketing plan targets <strong>5,000 registered users</strong> and <strong>500 Pro subscribers</strong> by Q1 2027, generating approximately <strong>$50,000&ndash;$60,000 in ARR</strong> from subscriptions plus supplemental affiliate revenue from Amazon Associates and Sporty's Pilot Shop partnerships.</p>

<div class="highlight-box">
  <strong>Key Differentiator:</strong> Unlike scattered forums and outdated FAA pages, iwanttobeapilot.online provides a single, honest, parent-tested resource covering costs, timelines, schools, examiners, and gear&mdash;with a clear career roadmap and real community stories.
</div>

<!-- 2. SITUATION ANALYSIS -->
<h2><span class="section-num">2</span> Situation Analysis</h2>

<h3>2.1 Market Opportunity</h3>
<ul>
  <li>The FAA issued <strong>~70,000 new student pilot certificates</strong> in 2024, a number that has grown steadily year-over-year</li>
  <li>The airline industry projects a need for <strong>600,000+ new pilots globally</strong> by 2040 (Boeing Pilot Outlook)</li>
  <li>Flight training is a <strong>$2.5B+ annual market</strong> in the US alone</li>
  <li>New student pilots are overwhelmingly digital-native and seek online guidance before committing tens of thousands of dollars</li>
</ul>

<h3>2.2 SWOT Analysis</h3>
<table>
  <tr><th style="width:50%">Strengths</th><th>Weaknesses</th></tr>
  <tr>
    <td>
      &bull; Authentic founder story (parent of two pilots)<br>
      &bull; Comprehensive free toolset drives organic discovery<br>
      &bull; Real FAA data (schools, DPEs, pass rates)<br>
      &bull; Affiliate revenue supplements subscriptions<br>
      &bull; NavLog Pro bundle adds tangible Pro value<br>
      &bull; Direct family connections to active CFIs and charter pilots
    </td>
    <td>
      &bull; New brand, low awareness<br>
      &bull; Small team / lean resources<br>
      &bull; No mobile app (web only)<br>
      &bull; Community content requires critical mass
    </td>
  </tr>
  <tr><th>Opportunities</th><th>Threats</th></tr>
  <tr>
    <td>
      &bull; Pilot shortage creates growing demand<br>
      &bull; Partnerships with flight schools and DPEs<br>
      &bull; Women in Aviation / 99s community outreach<br>
      &bull; CFI referral network (family connections)<br>
      &bull; SEO for high-intent "how to become a pilot" queries<br>
      &bull; YouTube / TikTok aviation content trend
    </td>
    <td>
      &bull; AOPA and established aviation orgs have large audiences<br>
      &bull; Flight school aggregators (Flight School List, etc.)<br>
      &bull; Economic downturns reduce recreational flight training<br>
      &bull; Regulatory changes to FAA certification
    </td>
  </tr>
</table>

<h3>2.3 Unique Assets</h3>
<div class="highlight-box">
  <strong>Family aviation network:</strong> One child is an active CFI (Certified Flight Instructor) and the other is a private charter pilot, former CFI, and active member of <strong>Women in Aviation International</strong> and <strong>The Ninety-Nines</strong>. These connections provide authentic content, credibility, instructor referral networks, and direct access to two of aviation's most engaged communities.
</div>

<div class="page-break"></div>

<!-- 3. TARGET MARKET & PERSONAS -->
<h2><span class="section-num">3</span> Target Market &amp; Personas</h2>

<h3>3.1 Primary Segments</h3>
<table>
  <tr><th>Segment</th><th>Description</th><th>Size / Priority</th></tr>
  <tr><td><strong>Pre-Student Researchers</strong></td><td>Adults 18&ndash;45 actively Googling "how to become a pilot," costs, and timelines. High intent, high information need.</td><td>Largest segment. #1 priority.</td></tr>
  <tr><td><strong>Active Student Pilots</strong></td><td>Currently in training, looking for DPE info, exam prep tools, community support, and gear recommendations.</td><td>High-value. Best Pro conversion.</td></tr>
  <tr><td><strong>Career Changers</strong></td><td>Professionals 25&ndash;45 considering aviation as a second career. Need honest cost/timeline info and career path clarity.</td><td>High willingness to pay.</td></tr>
  <tr><td><strong>Parents of Aspiring Pilots</strong></td><td>Parents researching training for their children. Want trusted, transparent cost and safety information.</td><td>Emotional resonance with founder story.</td></tr>
  <tr><td><strong>Women in Aviation</strong></td><td>Women considering or actively pursuing pilot careers. Underrepresented (~7% of US pilots) and actively supported by WAI and the 99s.</td><td>Strategic growth segment.</td></tr>
</table>

<h3>3.2 Detailed Personas</h3>

<h4>Persona A: &ldquo;Discovery Dan&rdquo; &mdash; Pre-Student Researcher</h4>
<ul>
  <li><strong>Age:</strong> 28 | <strong>Income:</strong> $55K | <strong>Location:</strong> Suburban</li>
  <li><strong>Goal:</strong> Understand if becoming a pilot is realistic for him financially and time-wise</li>
  <li><strong>Pain points:</strong> Conflicting info online, sticker shock, no idea where to start</li>
  <li><strong>Entry point:</strong> Google search &rarr; Costs page or Schools page</li>
  <li><strong>Conversion path:</strong> Free tools &rarr; Sign up &rarr; Progress tracker &rarr; Pro</li>
</ul>

<h4>Persona B: &ldquo;Student Sarah&rdquo; &mdash; Active Student Pilot</h4>
<ul>
  <li><strong>Age:</strong> 24 | <strong>Income:</strong> $40K | <strong>Location:</strong> Metro area near Part 141 school</li>
  <li><strong>Goal:</strong> Pass her PPL checkride, find a good DPE, and plan her career path to the airlines</li>
  <li><strong>Pain points:</strong> Needs DPE with good pass rate, wants gear recommendations from real pilots</li>
  <li><strong>Entry point:</strong> DPE finder or Equipment page via social/referral</li>
  <li><strong>Conversion path:</strong> DPE finder &rarr; Sign up for Pro &rarr; Community engagement</li>
</ul>

<h4>Persona C: &ldquo;Career-Change Chris&rdquo; &mdash; Professional Considering Aviation</h4>
<ul>
  <li><strong>Age:</strong> 35 | <strong>Income:</strong> $85K | <strong>Location:</strong> Urban</li>
  <li><strong>Goal:</strong> Understand total investment and timeline to reach airline pilot</li>
  <li><strong>Pain points:</strong> Can he afford it? How long will it take? Is the career worth it at 35?</li>
  <li><strong>Entry point:</strong> Costs page or Pilot Stories from career changers</li>
  <li><strong>Conversion path:</strong> Cost estimator &rarr; Stories &rarr; Sign up &rarr; Pro for full roadmap</li>
</ul>

<h4>Persona D: &ldquo;Aviator Ava&rdquo; &mdash; Woman Entering Aviation</h4>
<ul>
  <li><strong>Age:</strong> 22 | <strong>Income:</strong> $35K | <strong>Location:</strong> University town</li>
  <li><strong>Goal:</strong> Become a commercial pilot, connect with other women in aviation</li>
  <li><strong>Pain points:</strong> Feels like an outsider in a male-dominated field, wants mentorship and community</li>
  <li><strong>Entry point:</strong> Referral from WAI/99s or social media</li>
  <li><strong>Conversion path:</strong> Community stories &rarr; Sign up &rarr; Pro for full access + community</li>
</ul>

<div class="page-break"></div>

<!-- 4. COMPETITIVE LANDSCAPE -->
<h2><span class="section-num">4</span> Competitive Landscape</h2>
<table>
  <tr><th>Competitor</th><th>Strengths</th><th>Gaps We Fill</th></tr>
  <tr>
    <td><strong>AOPA</strong></td>
    <td>Massive brand, advocacy, insurance, flight school directory</td>
    <td>Membership-gated; no personalized progress tracking; no DPE pass rates; no cost estimator</td>
  </tr>
  <tr>
    <td><strong>Sporty's / King Schools</strong></td>
    <td>Established ground school courses, brand trust</td>
    <td>Course vendors, not career guidance platforms. No school search, DPE data, or community</td>
  </tr>
  <tr>
    <td><strong>Reddit r/flying</strong></td>
    <td>Large community, real advice, free</td>
    <td>Unstructured, overwhelming for beginners. No tools, no career roadmap, anonymous</td>
  </tr>
  <tr>
    <td><strong>PilotInstitute.com</strong></td>
    <td>Courses, career guides, YouTube presence</td>
    <td>Course-focused monetization; no interactive tools, progress tracking, or real DPE data</td>
  </tr>
  <tr>
    <td><strong>FlightSchoolList.com</strong></td>
    <td>School directory</td>
    <td>School-only; no costs, equipment, DPEs, community, or progress tracking</td>
  </tr>
</table>

<div class="highlight-box">
  <strong>Our positioning:</strong> We are not a course vendor or advocacy org. We are the <em>impartial, all-in-one career planning platform</em> for aspiring pilots&mdash;built by a family that&rsquo;s been through it, not a company trying to sell training hours.
</div>

<!-- 5. GOALS & KPIs -->
<h2><span class="section-num">5</span> Goals &amp; KPIs (12-Month Targets)</h2>

<div class="kpi-grid">
  <div class="kpi-card">
    <div class="number">5,000</div>
    <div class="label">Registered Users</div>
  </div>
  <div class="kpi-card">
    <div class="number">500</div>
    <div class="label">Pro Subscribers</div>
  </div>
  <div class="kpi-card">
    <div class="number">$50K+</div>
    <div class="label">Annual Recurring Revenue</div>
  </div>
</div>

<table>
  <tr><th>Metric</th><th>Q2 2026</th><th>Q3 2026</th><th>Q4 2026</th><th>Q1 2027</th></tr>
  <tr><td>Monthly Unique Visitors</td><td>2,000</td><td>5,000</td><td>10,000</td><td>15,000</td></tr>
  <tr><td>Registered Users (cumulative)</td><td>500</td><td>1,500</td><td>3,000</td><td>5,000</td></tr>
  <tr><td>Pro Subscribers (cumulative)</td><td>50</td><td>150</td><td>300</td><td>500</td></tr>
  <tr><td>Free-to-Pro Conversion Rate</td><td>10%</td><td>10%</td><td>10%</td><td>10%</td></tr>
  <tr><td>Monthly Churn Rate</td><td>&lt;8%</td><td>&lt;6%</td><td>&lt;5%</td><td>&lt;5%</td></tr>
  <tr><td>Organic Search Traffic Share</td><td>30%</td><td>45%</td><td>55%</td><td>60%</td></tr>
  <tr><td>Community Stories Published</td><td>20</td><td>60</td><td>120</td><td>200</td></tr>
</table>

<div class="page-break"></div>

<!-- 6. BRAND POSITIONING & MESSAGING -->
<h2><span class="section-num">6</span> Brand Positioning &amp; Messaging</h2>

<h3>6.1 Brand Position Statement</h3>
<div class="highlight-box">
  For aspiring pilots who feel overwhelmed by the cost, complexity, and confusion of flight training, <strong>I Want To Be A Pilot</strong> is the all-in-one career planning platform that provides honest costs, real timelines, trusted tools, and a supportive community&mdash;built by a family that&rsquo;s been through the journey, not a company selling training hours.
</div>

<h3>6.2 Core Messaging Pillars</h3>
<table>
  <tr><th>Pillar</th><th>Message</th><th>Proof Point</th></tr>
  <tr><td><strong>Transparency</strong></td><td>&ldquo;Real costs. Real timelines. No surprises.&rdquo;</td><td>Cost estimator with ranges; no sales pitches</td></tr>
  <tr><td><strong>Guidance</strong></td><td>&ldquo;Your complete roadmap from ground to cockpit.&rdquo;</td><td>12-level progress tracker with recommended gear and next steps</td></tr>
  <tr><td><strong>Community</strong></td><td>&ldquo;You&rsquo;re not flying solo.&rdquo;</td><td>Pilot stories, forums, school &amp; DPE ratings</td></tr>
  <tr><td><strong>Authenticity</strong></td><td>&ldquo;Built by a pilot family, for future pilots.&rdquo;</td><td>Founder&rsquo;s story; children are active CFI and charter pilot</td></tr>
</table>

<h3>6.3 Tagline Options</h3>
<ul>
  <li><strong>Primary:</strong> &ldquo;Your Complete Guide to the Cockpit&rdquo;</li>
  <li><strong>Alternative:</strong> &ldquo;From Dream to Wings&rdquo;</li>
  <li><strong>Community:</strong> &ldquo;Built by a Pilot Family. For Future Pilots.&rdquo;</li>
</ul>

<!-- 7. MARKETING CHANNELS & TACTICS -->
<h2><span class="section-num">7</span> Marketing Channels &amp; Tactics</h2>

<h3>7.1 Search Engine Optimization (SEO) &mdash; Primary Channel</h3>
<p><strong>Goal:</strong> Capture high-intent organic traffic for pilot training queries.</p>
<ul>
  <li><strong>Target keywords:</strong> "how to become a pilot," "pilot training cost," "flight school near me," "DPE pass rates," "best pilot headset," "private pilot license cost"</li>
  <li><strong>On-page:</strong> Optimize existing pages (costs, schools, equipment, resources) with schema markup, meta descriptions, and internal linking</li>
  <li><strong>Blog / Content Hub:</strong> Publish 2&ndash;4 SEO-optimized articles per month targeting long-tail queries (see Content Strategy)</li>
  <li><strong>Technical SEO:</strong> Maintain sitemap, structured data (FAQPage, Product, HowTo schemas), Core Web Vitals optimization</li>
  <li><strong>Local SEO:</strong> Target "[city] flight school" queries via school directory pages</li>
</ul>

<h3>7.2 Social Media</h3>
<table>
  <tr><th>Platform</th><th>Strategy</th><th>Frequency</th></tr>
  <tr><td><strong>Instagram</strong></td><td>Aviation lifestyle, pilot stories, infographics (costs, career paths), behind-the-scenes from CFI and charter pilot family members</td><td>4&ndash;5 posts/week</td></tr>
  <tr><td><strong>TikTok</strong></td><td>Short-form: "How much does it REALLY cost to become a pilot?", day-in-the-life CFI content, checkride tips, gear reviews</td><td>3&ndash;5 videos/week</td></tr>
  <tr><td><strong>YouTube</strong></td><td>Long-form: complete guide videos, CFI Q&As, gear comparisons, career path breakdowns, women in aviation features</td><td>1&ndash;2 videos/week</td></tr>
  <tr><td><strong>Facebook</strong></td><td>Community group for aspiring pilots; share articles and stories; engage in existing aviation groups</td><td>Daily engagement</td></tr>
  <tr><td><strong>LinkedIn</strong></td><td>Career-change content, pilot shortage articles, professional pilot journey stories</td><td>2&ndash;3 posts/week</td></tr>
</table>

<h3>7.3 Email Marketing</h3>
<ul>
  <li><strong>Welcome sequence</strong> (5 emails): Introduce tools &rarr; Cost breakdown &rarr; Success stories &rarr; DPE finder preview &rarr; Pro offer</li>
  <li><strong>Weekly newsletter:</strong> New articles, community highlights, equipment deals, aviation news</li>
  <li><strong>Re-engagement:</strong> Inactive user win-back after 30/60/90 days</li>
  <li><strong>Seasonal campaigns:</strong> Spring "flying season" push, January "new year new career" campaign</li>
</ul>

<h3>7.4 Paid Advertising (Phase 2, Q3 2026+)</h3>
<ul>
  <li><strong>Google Ads:</strong> Target high-intent keywords ("flight school cost," "how to get pilot license"). Start with $500&ndash;$1,000/mo, optimize for sign-up conversions</li>
  <li><strong>Meta Ads:</strong> Retarget site visitors; lookalike audiences based on registered users</li>
  <li><strong>Reddit Ads:</strong> Target r/flying, r/aviation, r/careerchange subreddits</li>
</ul>

<h3>7.5 Aviation Community Engagement</h3>
<ul>
  <li>Participate in r/flying, r/aviation, and aviation Facebook groups (value-first, not spammy)</li>
  <li>Answer questions on Quora related to pilot training</li>
  <li>Engage in aviation Discord servers</li>
</ul>

<div class="page-break"></div>

<!-- 8. CONTENT STRATEGY -->
<h2><span class="section-num">8</span> Content Strategy</h2>

<h3>8.1 Content Pillars</h3>
<table>
  <tr><th>Pillar</th><th>Topics</th><th>Format</th></tr>
  <tr>
    <td><strong>Getting Started</strong></td>
    <td>How to become a pilot, first discovery flight, choosing Part 61 vs 141, student pilot certificate process</td>
    <td>Blog, video, infographic</td>
  </tr>
  <tr>
    <td><strong>Costs &amp; Financing</strong></td>
    <td>Real cost breakdowns by certificate, financing options, scholarships, GI Bill for flight training, hidden costs</td>
    <td>Blog, calculator, video</td>
  </tr>
  <tr>
    <td><strong>Career Paths</strong></td>
    <td>CFI life, charter pilot day-in-the-life, regional vs major airlines, cargo careers, military-to-civilian pipeline</td>
    <td>Video, story, interview</td>
  </tr>
  <tr>
    <td><strong>Women in Aviation</strong></td>
    <td>Profiles of women pilots, WAI/99s events, scholarships for women, breaking barriers stories</td>
    <td>Interview, story, social</td>
  </tr>
  <tr>
    <td><strong>Gear &amp; Tools</strong></td>
    <td>Best headsets comparison, EFB app reviews, training course reviews, cockpit essentials for students</td>
    <td>Blog, video, comparison</td>
  </tr>
  <tr>
    <td><strong>Checkride Prep</strong></td>
    <td>How to find a good DPE, checkride day tips, oral exam prep, common failures and how to avoid them</td>
    <td>Blog, video, checklist</td>
  </tr>
</table>

<h3>8.2 Content Calendar (Monthly Template)</h3>
<table>
  <tr><th>Week</th><th>Blog Post</th><th>Video</th><th>Social</th></tr>
  <tr><td>1</td><td>Getting Started topic</td><td>YouTube: CFI Q&A or career topic</td><td>Instagram carousel + TikTok clip</td></tr>
  <tr><td>2</td><td>Costs / Financing topic</td><td>YouTube: gear review or comparison</td><td>Instagram reel + TikTok cost breakdown</td></tr>
  <tr><td>3</td><td>Gear / Tools topic</td><td>YouTube: women in aviation feature</td><td>Pilot story spotlight across platforms</td></tr>
  <tr><td>4</td><td>Career / Checkride topic</td><td>&mdash;</td><td>Newsletter + community roundup</td></tr>
</table>

<h3>8.3 User-Generated Content</h3>
<ul>
  <li><strong>Pilot Stories:</strong> Encourage Pro users to share their training journey (costs, timeline, advice). Feature best stories on social and blog.</li>
  <li><strong>Equipment Reviews:</strong> Prompt users to rate gear after purchase. Aggregate into "community picks" content.</li>
  <li><strong>School Reviews:</strong> Drive school and DPE ratings to build the most comprehensive review database in aviation training.</li>
</ul>

<!-- 9. PARTNERSHIPS & INFLUENCER STRATEGY -->
<h2><span class="section-num">9</span> Partnerships &amp; Influencer Strategy</h2>

<h3>9.1 Aviation Organization Partnerships</h3>
<table>
  <tr><th>Organization</th><th>Opportunity</th><th>Approach</th></tr>
  <tr>
    <td><strong>Women in Aviation International (WAI)</strong></td>
    <td>Sponsor/exhibitor at annual conference; feature site in newsletter; scholarship tie-in</td>
    <td>Leverage family member&rsquo;s active WAI membership for warm introduction. Offer Pro subscriptions as scholarship prizes or conference giveaways.</td>
  </tr>
  <tr>
    <td><strong>The Ninety-Nines (99s)</strong></td>
    <td>Chapter-level partnerships; feature in section newsletters; sponsor NIFA events</td>
    <td>Family member is an active 99s member. Propose featured resource status and co-branded "Women&rsquo;s Pilot Career Guide" content.</td>
  </tr>
  <tr>
    <td><strong>EAA (Experimental Aircraft Association)</strong></td>
    <td>Young Eagles program tie-in; presence at EAA AirVenture Oshkosh</td>
    <td>Offer free Pro trials to Young Eagles graduates. Booth or sponsorship at Oshkosh.</td>
  </tr>
  <tr>
    <td><strong>AOPA</strong></td>
    <td>Complementary resource listing; co-promotion for their "You Can Fly" initiative</td>
    <td>Position as a complementary tool, not a competitor. Offer reciprocal linking.</td>
  </tr>
  <tr>
    <td><strong>Local Flight Schools</strong></td>
    <td>Referral partnerships; display in FBOs; recommend to new students</td>
    <td>Family CFI can personally introduce the platform to their school and network. Offer affiliate or referral commission for Pro sign-ups.</td>
  </tr>
</table>

<h3>9.2 Influencer &amp; Ambassador Program</h3>
<ul>
  <li><strong>Family ambassadors:</strong> Both children create content showcasing the platform. The active CFI provides "instructor perspective" content. The charter pilot provides "career achieved" perspective and women in aviation advocacy.</li>
  <li><strong>Aviation YouTubers / TikTokers:</strong> Partner with creators like FlightChops, Steveo1Kinevo, Captain Joe, MzeroA, and smaller student pilot vloggers for reviews, features, or sponsored content.</li>
  <li><strong>Student pilot ambassadors:</strong> Recruit 10&ndash;20 active student pilots as brand ambassadors. Offer free Pro access in exchange for social sharing, stories, and reviews.</li>
  <li><strong>CFI referral program:</strong> Give flight instructors a unique referral code. They earn a commission or credit for every student who signs up for Pro.</li>
</ul>

<h3>9.3 Affiliate &amp; Revenue Partnerships</h3>
<ul>
  <li><strong>Amazon Associates:</strong> Already integrated. Optimize by promoting seasonal gear guides and "what&rsquo;s in my flight bag" content.</li>
  <li><strong>Sporty&rsquo;s Pilot Shop:</strong> Already integrated. Expand with exclusive discount codes for Pro members.</li>
  <li><strong>NavLog Pro:</strong> Continue bundling free account with Pro. Cross-promote on NavLog Pro&rsquo;s platform.</li>
  <li><strong>Ground school providers:</strong> Approach Sporty's, King Schools, and Gleim for affiliate or partner deals.</li>
</ul>

<div class="page-break"></div>

<!-- 10. EXECUTION TIMELINE -->
<h2><span class="section-num">10</span> 12-Month Execution Timeline</h2>

<div class="timeline">
  <div class="phase">
    <div class="phase-title">Phase 1: Foundation (Q2 2026 &mdash; Apr/May/Jun)</div>
    <ul>
      <li>Launch blog/content hub with initial 8&ndash;10 SEO-optimized articles</li>
      <li>Set up Instagram, TikTok, YouTube, and Facebook accounts with consistent branding</li>
      <li>Build email welcome sequence and newsletter infrastructure (Resend)</li>
      <li>Begin posting 3&ndash;5x/week on Instagram and TikTok</li>
      <li>Family members begin creating ambassador content (CFI tips, charter life, WAI events)</li>
      <li>Reach out to WAI and 99s chapters for partnership conversations</li>
      <li>Recruit first 5 student pilot ambassadors</li>
      <li>Set up Google Search Console, Analytics 4, and conversion tracking</li>
      <li>Submit site to aviation resource directories and link roundups</li>
    </ul>
  </div>
  <div class="phase">
    <div class="phase-title">Phase 2: Growth (Q3 2026 &mdash; Jul/Aug/Sep)</div>
    <ul>
      <li>Publish 3&ndash;4 blog posts per month; start YouTube weekly uploads</li>
      <li>Launch Google Ads campaigns targeting high-intent keywords ($500&ndash;$1,000/mo)</li>
      <li>Attend or sponsor regional WAI/99s events; distribute promo codes</li>
      <li>Launch CFI referral program</li>
      <li>Partner with 2&ndash;3 aviation YouTubers for sponsored features</li>
      <li>Run first "Free Pro Trial" campaign (7-day trial via promo code)</li>
      <li>Build backlink profile through guest posts on aviation blogs</li>
      <li>Begin Facebook Group for aspiring pilots (brand-hosted community)</li>
      <li>Reach 5,000 monthly visitors and 1,500 registered users</li>
    </ul>
  </div>
  <div class="phase">
    <div class="phase-title">Phase 3: Scale (Q4 2026 &mdash; Oct/Nov/Dec)</div>
    <ul>
      <li>Scale paid ads to $1,000&ndash;$2,000/mo based on Q3 ROAS data</li>
      <li>Launch "Women in Aviation" content series with charter pilot family member</li>
      <li>Holiday gift guide campaign (pilot gear via affiliate links)</li>
      <li>Attend EAA events or local fly-ins with promotional materials</li>
      <li>Expand ambassador program to 20 student pilots</li>
      <li>Introduce annual subscription push with limited-time discount</li>
      <li>Launch email re-engagement campaigns for inactive users</li>
      <li>Reach 10,000 monthly visitors and 300 Pro subscribers</li>
    </ul>
  </div>
  <div class="phase">
    <div class="phase-title">Phase 4: Optimize &amp; Retain (Q1 2027 &mdash; Jan/Feb/Mar)</div>
    <ul>
      <li>"New Year, New Career" campaign targeting career changers (Jan)</li>
      <li>Analyze full-year data; double down on highest-performing channels</li>
      <li>Optimize conversion funnel based on analytics (A/B test pricing page, CTAs)</li>
      <li>Launch loyalty program or annual subscriber perks</li>
      <li>Plan Year 2 strategy based on learnings</li>
      <li>Target: 15,000 monthly visitors, 5,000 registered users, 500 Pro subscribers</li>
    </ul>
  </div>
</div>

<div class="page-break"></div>

<!-- 11. BUDGET ALLOCATION -->
<h2><span class="section-num">11</span> Budget Allocation</h2>

<h3>11.1 Estimated Annual Marketing Budget: $12,000&ndash;$18,000</h3>

<table>
  <tr><th>Category</th><th>Q2</th><th>Q3</th><th>Q4</th><th>Q1 2027</th><th>Annual</th></tr>
  <tr><td><strong>Content Creation</strong> (writing, graphics, video editing)</td><td>$500</td><td>$750</td><td>$750</td><td>$500</td><td>$2,500</td></tr>
  <tr><td><strong>Paid Advertising</strong> (Google, Meta, Reddit)</td><td>$0</td><td>$2,000</td><td>$4,000</td><td>$3,000</td><td>$9,000</td></tr>
  <tr><td><strong>Influencer / Sponsorships</strong></td><td>$0</td><td>$500</td><td>$500</td><td>$500</td><td>$1,500</td></tr>
  <tr><td><strong>Events &amp; Conferences</strong> (WAI, 99s, fly-ins)</td><td>$250</td><td>$500</td><td>$500</td><td>$250</td><td>$1,500</td></tr>
  <tr><td><strong>Tools &amp; Software</strong> (email, analytics, design)</td><td>$250</td><td>$250</td><td>$250</td><td>$250</td><td>$1,000</td></tr>
  <tr><td><strong>Ambassador Program</strong> (free Pro access, swag)</td><td>$100</td><td>$250</td><td>$250</td><td>$150</td><td>$750</td></tr>
  <tr style="font-weight:bold; background:#eef2ff;">
    <td>TOTAL</td><td>$1,100</td><td>$4,250</td><td>$6,250</td><td>$4,650</td><td>$16,250</td>
  </tr>
</table>

<div class="highlight-box">
  <strong>ROI Target:</strong> At 500 Pro subscribers &times; $99.99/yr = ~$50,000 ARR, plus affiliate revenue, the plan targets a 3&ndash;4x return on marketing spend within 12 months. The budget is conservative and can be scaled based on early results.
</div>

<h3>11.2 Low-Cost / Free Tactics (Maximize First)</h3>
<ul>
  <li>SEO content (organic traffic is the #1 long-term channel)</li>
  <li>Family ambassador content (authentic, free, high-trust)</li>
  <li>Community engagement (Reddit, Facebook groups, Quora)</li>
  <li>Email marketing (existing Resend infrastructure)</li>
  <li>Partnership outreach (WAI, 99s, flight schools via family connections)</li>
  <li>User-generated content (pilot stories, reviews, ratings)</li>
</ul>

<!-- 12. MEASUREMENT & OPTIMIZATION -->
<h2><span class="section-num">12</span> Measurement &amp; Optimization</h2>

<h3>12.1 Key Dashboards</h3>
<table>
  <tr><th>Dashboard</th><th>Tool</th><th>Cadence</th></tr>
  <tr><td>Traffic &amp; Acquisition</td><td>Google Analytics 4</td><td>Weekly</td></tr>
  <tr><td>Search Performance</td><td>Google Search Console</td><td>Weekly</td></tr>
  <tr><td>Conversion Funnel</td><td>GA4 + Admin Dashboard</td><td>Weekly</td></tr>
  <tr><td>Subscription Metrics</td><td>Stripe Dashboard</td><td>Weekly</td></tr>
  <tr><td>Email Performance</td><td>Resend Analytics</td><td>Per campaign</td></tr>
  <tr><td>Social Media</td><td>Native analytics per platform</td><td>Weekly</td></tr>
  <tr><td>Ad Performance</td><td>Google/Meta Ads Manager</td><td>Daily (when running)</td></tr>
</table>

<h3>12.2 Monthly Review Checklist</h3>
<ul>
  <li>Review traffic trends by source (organic, social, paid, referral, direct)</li>
  <li>Analyze sign-up &rarr; Pro conversion funnel; identify drop-off points</li>
  <li>Review top-performing content; plan similar topics</li>
  <li>Check churn rate and reasons (cancellation survey data)</li>
  <li>Evaluate ad spend ROAS; pause underperforming campaigns</li>
  <li>Survey active users for feature requests and satisfaction</li>
  <li>Assess partnership ROI (referral codes, event leads)</li>
</ul>

<h3>12.3 Optimization Playbook</h3>
<ul>
  <li><strong>If organic traffic stalls:</strong> Increase content frequency, refresh top pages, build more backlinks</li>
  <li><strong>If conversion rate drops:</strong> A/B test pricing page, improve Pro value messaging, add testimonials</li>
  <li><strong>If churn exceeds 8%:</strong> Survey churned users, add retention features, improve onboarding</li>
  <li><strong>If paid ads underperform:</strong> Narrow targeting, test new creatives, shift budget to higher-performing channels</li>
</ul>

<div class="page-break"></div>

<!-- 13. RISK MITIGATION -->
<h2><span class="section-num">13</span> Risk Mitigation</h2>

<table>
  <tr><th>Risk</th><th>Likelihood</th><th>Impact</th><th>Mitigation</th></tr>
  <tr>
    <td>Low initial organic traffic</td>
    <td>Medium</td>
    <td>High</td>
    <td>Supplement with paid ads earlier; leverage family network and aviation communities for initial traction</td>
  </tr>
  <tr>
    <td>Community doesn&rsquo;t reach critical mass</td>
    <td>Medium</td>
    <td>Medium</td>
    <td>Seed content with family pilot stories; recruit ambassadors; cross-promote from social platforms</td>
  </tr>
  <tr>
    <td>High churn on Pro subscriptions</td>
    <td>Low</td>
    <td>High</td>
    <td>Push annual plans; continuously add Pro value; NavLog Pro bundle increases stickiness</td>
  </tr>
  <tr>
    <td>Competitor launches similar tool</td>
    <td>Low</td>
    <td>Medium</td>
    <td>Move fast on community and DPE data moats; authentic brand story is hard to replicate</td>
  </tr>
  <tr>
    <td>FAA data source changes</td>
    <td>Low</td>
    <td>Medium</td>
    <td>Monitor FAA API/data endpoints; maintain flexible DPE sync architecture; diversify data sources</td>
  </tr>
  <tr>
    <td>Economic downturn reduces flight training demand</td>
    <td>Low</td>
    <td>High</td>
    <td>Emphasize free tier value and cost-saving tools; position as essential research before large investment</td>
  </tr>
</table>

<div style="margin-top: 2em; padding: 1.5em; background: #0f3460; color: white; border-radius: 8px; text-align: center;">
  <div style="font-size: 16pt; font-weight: 700; margin-bottom: 0.3em;">Ready for Takeoff</div>
  <div style="font-size: 11pt; opacity: 0.9;">This plan leverages authentic family connections to the aviation community, powerful free tools that drive organic growth, and a clear upgrade path to Pro. By executing consistently across SEO, social, partnerships, and community, iwanttobeapilot.online will become the go-to resource for aspiring pilots within 12 months.</div>
</div>

<div style="margin-top: 3em; text-align: center; font-size: 9pt; color: #999;">
  &copy; 2026 I Want To Be A Pilot &bull; iwanttobeapilot.online &bull; Confidential
</div>

</body>
</html>`;

const outputPath = process.argv[2] || '/home/stephen-johns/Documents/IWTBAP_Marketing_Plan_2026.pdf';

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const page = await browser.newPage();
await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

await page.pdf({
  path: outputPath,
  format: 'Letter',
  printBackground: true,
  margin: { top: '0.75in', bottom: '0.75in', left: '1in', right: '1in' },
  displayHeaderFooter: true,
  headerTemplate: '<div></div>',
  footerTemplate: '<div style="width:100%;text-align:center;font-size:8pt;color:#999;padding:0 1in;"><span class="pageNumber"></span> of <span class="totalPages"></span></div>',
});

await browser.close();
console.log(`PDF generated: ${outputPath}`);
