"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { X } from "lucide-react";

interface HelpSection {
  heading: string;
  items: string[];
}

interface PageHelp {
  title: string;
  sections: HelpSection[];
  seeAlso?: { label: string; href: string }[];
}

function getPageHelp(pathname: string): PageHelp {
  // Auth pages
  if (pathname.startsWith("/auth/")) {
    const isSignUp = pathname.includes("sign-up");
    const isReset = pathname.includes("reset");
    const isVerify = pathname.includes("verify");
    if (isReset) {
      return {
        title: "Reset Password",
        sections: [
          {
            heading: "How it works",
            items: [
              "Enter the email address you registered with and click Send Reset Link.",
              "You'll receive an email with a one-time link — click it to set a new password.",
              "The reset link expires after a short time. If it has expired, request a new one.",
              "Check your spam or junk folder if the email doesn't arrive within a few minutes.",
            ],
          },
        ],
        seeAlso: [{ label: "Sign In", href: "/auth/sign-in" }],
      };
    }
    if (isVerify) {
      return {
        title: "Verify Your Email",
        sections: [
          {
            heading: "Verification",
            items: [
              "A verification email was sent to the address you registered with.",
              "Click the link in the email to activate your account — the link expires after 24 hours.",
              "If you don't see it, check spam/junk. You can request a new link from this page.",
              "Once verified, sign in to access your dashboard and Pro features.",
            ],
          },
        ],
        seeAlso: [{ label: "Sign In", href: "/auth/sign-in" }],
      };
    }
    if (isSignUp) {
      return {
        title: "Create an Account",
        sections: [
          {
            heading: "Registration",
            items: [
              "Enter your name, email, and a password (minimum 8 characters) to create a free account.",
              "Or click the Google button to register instantly with your Google account — no password needed.",
              "After registering, check your email for a verification link to activate your account.",
            ],
          },
          {
            heading: "What you get",
            items: [
              "A free account gives you access to the progress timeline and community features.",
              "Upgrade to Pro anytime for FAA knowledge test prep, DPE finder, equipment ratings, and more.",
            ],
          },
        ],
        seeAlso: [
          { label: "Sign In", href: "/auth/sign-in" },
          { label: "View Pricing", href: "/pricing" },
        ],
      };
    }
    return {
      title: "Sign In",
      sections: [
        {
          heading: "Sign-in options",
          items: [
            "Enter your email and password, then click Sign In.",
            "Or click the Google button to sign in instantly with your Google account.",
            "Forgot your password? Click 'Forgot password?' below the form to get a reset link.",
          ],
        },
        {
          heading: "Trouble signing in?",
          items: [
            "Make sure you're using the same email you registered with.",
            "If you signed up with Google, use the Google button — you won't have a password on file.",
            "If your account isn't verified, check your email for the verification link.",
          ],
        },
      ],
      seeAlso: [{ label: "Create Account", href: "/auth/sign-up" }],
    };
  }

  // Admin section
  if (pathname.startsWith("/admin")) {
    return {
      title: "Admin Panel",
      sections: [
        {
          heading: "User management",
          items: [
            "Search users by name or email in the search bar at the top of the users table.",
            "Click a user row to edit their tier (free/pro), role (user/admin), or account status.",
            "Deactivating an account prevents sign-in but preserves the data; deleting is permanent.",
          ],
        },
        {
          heading: "Promo codes",
          items: [
            "Create single-use or multi-use promo codes that grant Pro access for a set duration.",
            "Toggle a code active/inactive without deleting it — inactive codes cannot be redeemed.",
            "View redemption counts and which users have redeemed each code.",
          ],
        },
        {
          heading: "Audit log",
          items: [
            "Every admin action — user edits, promo code changes, tier updates — is logged with a timestamp and actor.",
            "Use the log to track who made changes and when.",
          ],
        },
      ],
    };
  }

  // Settings
  if (pathname === "/settings") {
    return {
      title: "Account Settings",
      sections: [
        {
          heading: "Appearance",
          items: [
            "Toggle between Light and Dark theme using the buttons at the top. Your choice is saved in your browser.",
          ],
        },
        {
          heading: "Profile",
          items: [
            "Update your display name, zip code, and pilot goal using the form fields.",
            "Your pilot goal controls which milestones appear on your progress timeline — choose from 8 paths (Hobby Pilot through Major Cargo Pilot).",
            "Click 'Save Profile' to apply changes immediately.",
          ],
        },
        {
          heading: "Subscription",
          items: [
            "Your current plan (Free or Pro) is displayed here.",
            "Free users can click 'Upgrade to Pro' to subscribe via Stripe.",
            "Pro users can click 'Manage Subscription' to open the Stripe billing portal — update your card, switch plans, or cancel there.",
            "Cancellation keeps Pro access until the end of your current billing period.",
          ],
        },
        {
          heading: "Password",
          items: [
            "If you signed up with Google and don't have a password, you can set one here to enable email + password sign-in.",
            "To change an existing password, enter your current password first, then the new one twice.",
            "Passwords must be at least 8 characters. Changing your password signs out all other sessions.",
          ],
        },
        {
          heading: "Delete account",
          items: [
            "Type DELETE in the confirmation box and click the button to permanently remove your account.",
            "This deletes all your data — stories, posts, test history, progress, and profile. This cannot be undone.",
          ],
        },
      ],
    };
  }

  // Test results page
  if (pathname.includes("/test-prep/") && pathname.includes("/results/")) {
    return {
      title: "Test Results",
      sections: [
        {
          heading: "Your score",
          items: [
            "Your overall score and percentage are displayed at the top, along with a PASSED (green) or FAILED (red) badge.",
            "The FAA passing threshold is 70% — this matches the real knowledge test standard.",
          ],
        },
        {
          heading: "Performance breakdown",
          items: [
            "Your score is broken down by Area of Knowledge (AOK), each with its own percentage and progress bar.",
            "AOKs below 70% are highlighted in red — focus your study on these weak areas.",
            "Scroll down to see every question you answered incorrectly, with both your answer and the correct answer shown.",
          ],
        },
        {
          heading: "Next steps",
          items: [
            "Click 'Take Another Test' to generate a new full-length test with fresh questions.",
            "Check the 'Questions to Work On' tab on the test hub to see questions you've missed multiple times.",
          ],
        },
      ],
    };
  }

  // Test-taking interface
  if (pathname.includes("/test-prep/") && pathname.includes("/take")) {
    return {
      title: "Taking a Sample Test",
      sections: [
        {
          heading: "Answering questions",
          items: [
            "Read the question and click one of the four answer choices (A, B, C, or D) to select it.",
            "You can change your selection before moving on — your answer is not locked until you leave the question.",
            "Use the Previous and Next buttons at the bottom to navigate between questions.",
          ],
        },
        {
          heading: "Question navigator",
          items: [
            "The numbered dot grid lets you jump to any question directly — click any number.",
            "Answered questions show a filled dot; unanswered questions show an empty dot so you can spot skipped ones.",
            "The header shows how many questions you've answered and how many remain.",
          ],
        },
        {
          heading: "Submitting",
          items: [
            "Click 'Submit Test' on the last question, or use the 'Submit test early' link at any time.",
            "A confirmation dialog warns you about any unanswered questions — unanswered questions count as incorrect.",
            "After submitting, you'll see your full results with a score breakdown by Area of Knowledge.",
          ],
        },
      ],
    };
  }

  // Test prep hub
  if (pathname.startsWith("/test-prep/")) {
    return {
      title: "FAA Knowledge Test Prep",
      sections: [
        {
          heading: "Take a test",
          items: [
            "Click 'Generate Test' to create a full-length sample test that mirrors the real FAA knowledge exam.",
            "Tests use the same question count and 70% passing threshold as the actual FAA test.",
            "Unlike study mode, you won't see answers until you submit — just like the real exam.",
          ],
        },
        {
          heading: "My history",
          items: [
            "The History tab shows every test you've taken with date, score, percentage, and pass/fail result.",
            "Click 'View Results' on any attempt to review the full breakdown and see which questions you missed.",
            "Track your improvement over time — aim for consistent scores above 80% before scheduling the real test.",
          ],
        },
        {
          heading: "Questions to work on",
          items: [
            "Questions you've missed 2 or more times automatically appear in the 'Questions to Work On' tab.",
            "They're grouped by Area of Knowledge so you can see which topics need the most review.",
            "Click 'Start Mini-Test' to drill just your weak questions — mini-test results are not tracked in your history.",
          ],
        },
      ],
      seeAlso: [{ label: "Progress Timeline", href: "/dashboard" }],
    };
  }

  // Study session (in-progress practice)
  if (pathname.includes("/study/") && pathname.includes("/session")) {
    return {
      title: "Practice Session",
      sections: [
        {
          heading: "How practice works",
          items: [
            "Read the question and select one of the four answer choices, then click 'Submit Answer.'",
            "You get instant feedback after each question — correct answers show green, incorrect show red with the right answer and an explanation.",
            "Your running score is displayed at the top along with a progress bar.",
          ],
        },
        {
          heading: "During the session",
          items: [
            "Click 'Next Question' after reviewing the feedback to continue.",
            "Practice sessions are not tracked or saved — use them freely to build familiarity without pressure.",
            "Click 'Exit' at any time to return to the study setup page.",
          ],
        },
        {
          heading: "After completing",
          items: [
            "Your final score and percentage are shown on the completion screen.",
            "Click 'Practice Again' to start a new session with the same settings, or 'Change Settings' to pick different AOKs.",
            "When you're consistently scoring above 80%, try a full sample test to simulate the real exam.",
          ],
        },
      ],
      seeAlso: [{ label: "Take a Sample Test", href: pathname.replace("/session", "").replace("/study/", "/test-prep/") }],
    };
  }

  // Study setup page
  if (pathname.startsWith("/study/")) {
    return {
      title: "FAA Knowledge Study Mode",
      sections: [
        {
          heading: "Setting up practice",
          items: [
            "Check the Areas of Knowledge (AOKs) you want to practice — use 'Select All' or pick specific topics to focus on.",
            "Use the slider to choose how many questions (10–100) you want in this session.",
            "Click 'Start Practice' to begin — you'll get instant feedback after each question.",
          ],
        },
        {
          heading: "Study vs. test mode",
          items: [
            "Study mode shows the correct answer and explanation immediately after each question — great for learning.",
            "Test mode (available from the test prep hub) hides answers until you submit the full exam — great for measuring readiness.",
            "Practice sessions are not scored or saved, so experiment freely.",
          ],
        },
        {
          heading: "Study strategy",
          items: [
            "Start with all AOKs selected to identify your weak areas, then narrow down to specific topics.",
            "Focus extra time on regulations, weather, and aerodynamics — these are the most heavily tested areas.",
            "Once you're consistently scoring 80%+ in study mode, move to the full sample test.",
          ],
        },
      ],
      seeAlso: [
        { label: "Take a Sample Test", href: pathname.replace("/study/", "/test-prep/") },
        { label: "Progress Timeline", href: "/dashboard" },
      ],
    };
  }

  // FAA Knowledge Tests hub page
  if (pathname === "/knowledge-tests") {
    return {
      title: "FAA Knowledge Tests",
      sections: [
        {
          heading: "Choosing a test",
          items: [
            "Tests are organized into four categories: Pilot Certificates (PAR, IRA, CAX, ATP), Add-on Ratings (MEA, AGI), Instructor Certificates (FOI, FIA, FII), and Other (SPG, RPA).",
            "Each card shows the test code, full name, and the number of questions on the real FAA exam.",
            "Pick the test that matches your next certificate or rating.",
          ],
        },
        {
          heading: "Study mode",
          items: [
            "Click 'Study' on any test card to enter study mode.",
            "Select which Areas of Knowledge (AOKs) to focus on, set your question count (10–100), and get instant feedback with explanations after every answer.",
            "Study sessions are not tracked — practice as many times as you like without pressure.",
          ],
        },
        {
          heading: "Sample test mode",
          items: [
            "Click 'Take Test' to enter the test prep hub for that exam.",
            "Generate a full-length sample test matching the real FAA format — same question count and 70% passing threshold.",
            "Answers are hidden until you submit the entire test, just like the real exam.",
            "Your results are saved with a score breakdown by AOK, and questions you miss 2+ times are tracked in the 'Questions to Work On' tab for focused review.",
          ],
        },
      ],
      seeAlso: [
        { label: "Progress Timeline", href: "/dashboard" },
        { label: "Free Resources", href: "/resources" },
      ],
    };
  }

  // Dashboard / Progress Timeline
  if (pathname === "/dashboard") {
    return {
      title: "My Progress",
      sections: [
        {
          heading: "Your training timeline",
          items: [
            "Use the goal dropdown at the top to select your pilot path — Hobby Pilot, IFR Pilot, Commercial, CFI, Charter, Regional Airline, Major Airline, or Major Cargo.",
            "Your timeline displays each certification as a milestone card with estimated time and cost.",
            "Click any milestone card to expand it and see 'What You Will Learn,' recommended gear, next steps, and knowledge test links.",
          ],
        },
        {
          heading: "Tracking your progress",
          items: [
            "Use the status buttons on each milestone to mark it 'In Progress' (amber pulsing dot) or 'Complete' (green checkmark).",
            "Your progress is saved automatically — come back anytime to see where you left off.",
            "The connecting line and dot colors give you a visual snapshot of how far along you are.",
          ],
        },
        {
          heading: "FAA knowledge test prep",
          items: [
            "Yellow badges on milestones (e.g., 'PAR Required,' 'IRA Required') indicate which FAA knowledge tests are needed for that level.",
            "Click 'Practice Questions' to enter study mode — choose your topics, set question count, and get instant feedback on each answer.",
            "Click 'Take a Sample Test' to simulate the real FAA exam — full-length, timed, no peeking at answers until you submit.",
            "Your test history and weak-area tracker are available on the test prep hub so you can measure improvement.",
          ],
        },
        {
          heading: "Recommended gear",
          items: [
            "Each milestone includes product recommendations for that stage of training — headsets, flight bags, study materials, and more.",
            "Click any product to view it on Amazon or Sporty's. Some links are affiliate links.",
          ],
        },
      ],
      seeAlso: [
        { label: "Cost & Timeline Estimates", href: "/costs" },
        { label: "Free Resources", href: "/resources" },
      ],
    };
  }

  // DPE Finder
  if (pathname === "/dpe-finder") {
    return {
      title: "DPE Finder",
      sections: [
        {
          heading: "Searching for a DPE",
          items: [
            "Enter your zip code, select a search radius (25–200 miles), and optionally filter by certificate type (Private, Instrument, Commercial, ATP, etc.).",
            "Results appear on an interactive map and in a paginated table below — click a map marker or table row for details.",
            "Each result shows the DPE's name, location, distance from you, contact info (phone/email), and community star rating.",
          ],
        },
        {
          heading: "Ratings",
          items: [
            "Pro users can rate DPEs on a 1–5 star scale directly from the results table — click the 'Rate' button on any row.",
            "Ratings help fellow students make informed choices based on real experiences.",
          ],
        },
        {
          heading: "FAA pass rate data",
          items: [
            "The pass rate panel (Pro feature) shows aggregate FAA checkride statistics broken down by year, certificate type, and examiner type.",
            "Pass rates are color-coded: green (80%+), amber (60–79%), and red (below 60%).",
            "These are aggregate stats for reference only — a DPE's pass rate reflects their applicant pool, not their difficulty.",
          ],
        },
        {
          heading: "Before you schedule",
          items: [
            "Verify the DPE's current authorization with your local FSDO or on FAA DragonWave.",
            "Confirm availability, scheduling process, and fees directly with the examiner.",
            "Your CFI's recommendation is usually the best starting point for choosing a DPE.",
          ],
        },
      ],
      seeAlso: [{ label: "Aviation Disclaimer", href: "/disclaimer" }],
    };
  }

  // Stories list
  if (pathname === "/community/stories") {
    return {
      title: "Pilot Stories",
      sections: [
        {
          heading: "Browsing stories",
          items: [
            "Each story card shows the author, certification levels earned, training duration, total cost, and current salary range.",
            "Use the pilot level dropdown to filter stories by certification — find stories from private pilots, instrument-rated pilots, commercial pilots, and beyond.",
            "Click any story card to read the full account.",
          ],
        },
        {
          heading: "Sharing your own story",
          items: [
            "Pro users can click 'Share Your Story' to post their training journey.",
            "Include specifics — certifications, hours, costs, timeline, and what you're doing now — these details are the most helpful for others.",
            "You can edit or delete your story at any time from its detail page.",
          ],
        },
      ],
      seeAlso: [
        { label: "Cost & Timeline Estimator", href: "/costs" },
        { label: "Discussion Forums", href: "/community/discussions" },
      ],
    };
  }

  // New story
  if (pathname === "/community/stories/new") {
    return {
      title: "Share Your Story",
      sections: [
        {
          heading: "Writing your story",
          items: [
            "Select every certification level you've achieved or are currently working toward.",
            "Fill in training time (months), total cost, flight hours, and your current salary range if applicable.",
            "Write your narrative in the story body — what you did, what surprised you, what you'd do differently.",
          ],
        },
        {
          heading: "Tips for a great story",
          items: [
            "Be specific: 'passed my PPL checkride on first attempt after 62 hours at $185/hr wet' is far more useful than a vague summary.",
            "Include the hard parts — struggles with weather cancellations, checkride nerves, or finding the right instructor help others prepare.",
            "You can edit your story anytime, so don't worry about getting it perfect on the first try.",
          ],
        },
      ],
    };
  }

  // Story detail
  if (pathname.startsWith("/community/stories/")) {
    return {
      title: "Pilot Story",
      sections: [
        {
          heading: "Reading this story",
          items: [
            "This is a real pilot's personal account of their training journey — certifications, costs, timeline, and lessons learned.",
            "The stats at the top (time, cost, salary) give you a quick reference, but remember that every pilot's path is different.",
            "If this is your story, you can edit or delete it from this page.",
          ],
        },
      ],
      seeAlso: [
        { label: "All Pilot Stories", href: "/community/stories" },
        { label: "Cost & Timeline Estimator", href: "/costs" },
      ],
    };
  }

  // Discussion post detail
  if (pathname.split("/").length >= 5 && pathname.startsWith("/community/discussions/")) {
    return {
      title: "Discussion Thread",
      sections: [
        {
          heading: "Reading and replying",
          items: [
            "Replies are shown in chronological order below the original post.",
            "Click 'Reply' to add your own response — your reply appears at the bottom of the thread.",
            "You can edit or delete your own posts and replies.",
          ],
        },
        {
          heading: "Community guidelines",
          items: [
            "Keep replies on topic and respectful — this is a community of students, instructors, and professional pilots helping each other.",
            "If you have a new question unrelated to this thread, start a new post in the appropriate category instead.",
          ],
        },
      ],
      seeAlso: [{ label: "All Discussions", href: "/community/discussions" }],
    };
  }

  // Discussion category (posts list)
  if (pathname.startsWith("/community/discussions/")) {
    return {
      title: "Discussion Category",
      sections: [
        {
          heading: "Browsing posts",
          items: [
            "Posts are listed with the most recent activity at the top.",
            "Each post shows the title, author, reply count, and last activity date — use these to find active conversations.",
            "Click a post title to read the full thread and all replies.",
          ],
        },
        {
          heading: "Starting a new discussion",
          items: [
            "Click 'New Post' to start a discussion in this category.",
            "Write a specific, descriptive title — posts with clear titles get more helpful replies.",
            "Check if someone has already asked your question before creating a new post.",
          ],
        },
      ],
      seeAlso: [{ label: "All Categories", href: "/community/discussions" }],
    };
  }

  // Discussions home
  if (pathname === "/community/discussions") {
    return {
      title: "Discussion Forums",
      sections: [
        {
          heading: "Finding a discussion",
          items: [
            "Categories are organized by topic — license types, flight school experiences, DPE reviews, career advice, and more.",
            "Each category shows the post count and latest activity so you can find the most active areas.",
            "Click a category name to view all posts in that topic.",
          ],
        },
        {
          heading: "Participating",
          items: [
            "Browse existing posts before creating a new one — your question may already have answers.",
            "Click into a category, then click 'New Post' to start a new discussion.",
            "Sharing your experiences helps other pilots — especially first-hand accounts of checkrides, school reviews, and career transitions.",
          ],
        },
      ],
      seeAlso: [{ label: "Pilot Stories", href: "/community/stories" }],
    };
  }

  // Pricing
  if (pathname === "/pricing") {
    return {
      title: "Pricing & Plans",
      sections: [
        {
          heading: "Comparing plans",
          items: [
            "Free: Flight school search, cost & timeline estimator, equipment guide, and free FAA resources — no account required.",
            "Pro: Everything in Free, plus the progress timeline with FAA knowledge test prep (study mode and full sample tests), DPE finder with pass rates, pilot stories, discussion forums, equipment ratings, and a free NavLog Pro account.",
            "Toggle between Monthly and Yearly billing at the top — yearly saves 44%.",
          ],
        },
        {
          heading: "Subscribing",
          items: [
            "Click 'Upgrade to Pro' to check out securely via Stripe — all major credit and debit cards accepted.",
            "Have a promo code? Scroll down to the promo code box, enter your code, and click 'Apply.'",
            "Cancel anytime from Settings — you keep Pro access until the end of your current billing period.",
          ],
        },
        {
          heading: "NavLog Pro bundle",
          items: [
            "Every Pro subscription includes a free NavLog Pro account (normally $50/year) for VFR cross-country flight planning.",
            "Already subscribed? Click 'Get your free NavLog Pro code' on this page to generate your one-time promo code, then redeem it at navlogpro.training.",
          ],
        },
      ],
    };
  }

  // Schools
  if (pathname === "/schools") {
    return {
      title: "Flight School Search",
      sections: [
        {
          heading: "How to search",
          items: [
            "Enter your 5-digit zip code and select a search radius (25, 50, 100, or 200 miles), then click Search.",
            "Results appear on an interactive map with markers and in a paginated table below.",
            "Use the pagination controls to change how many schools are shown per page (10, 25, 50, or 100) and navigate between pages.",
            "You can also click 'Search here' on the map after panning to re-search around a different location.",
          ],
        },
        {
          heading: "School details",
          items: [
            "Each result shows the school name, full address, phone number (clickable to call), website link, and distance from your zip code.",
            "Click a phone number to call directly from your device, or click the website link to visit the school's site in a new tab.",
          ],
        },
        {
          heading: "Choosing a school",
          items: [
            "Part 61 schools offer flexible scheduling — train at your own pace. Part 141 schools follow an FAA-approved syllabus with structured lessons.",
            "Call ahead to confirm aircraft availability, instructor schedules, and current hourly rates before visiting.",
          ],
        },
      ],
      seeAlso: [{ label: "Cost & Timeline Estimator", href: "/costs" }],
    };
  }

  // Resources
  if (pathname === "/resources") {
    return {
      title: "Free Aviation Resources",
      sections: [
        {
          heading: "FAA handbooks & regulations",
          items: [
            "Download the Pilot's Handbook of Aeronautical Knowledge (PHAK) and Airplane Flying Handbook (AFH) — the two essential study references for every student pilot.",
            "Access the FAR/AIM sections covering regulations you'll be tested on for your knowledge and practical exams.",
          ],
        },
        {
          heading: "Practice tests & study tools",
          items: [
            "Links to FAA, Sporty's, ASA, and Gleim practice test services for drilling knowledge test questions.",
            "Pro users also get built-in FAA knowledge test prep with study mode and full sample exams directly on the progress timeline.",
          ],
        },
        {
          heading: "Weather, navigation & career",
          items: [
            "Aviation Weather Center, SkyVector, and other tools for flight planning and weather briefings.",
            "FAA medical links (MedXPress, AME finder) for scheduling your aviation medical exam.",
            "Career resources including AOPA, Regional Airline Association, and aviation job boards.",
          ],
        },
        {
          heading: "How to use these resources",
          items: [
            "Start with the PHAK chapters relevant to your current training stage rather than reading cover to cover.",
            "Use the Airman Certification Standards (ACS) as a checklist — know every task before scheduling your checkride.",
            "All links open in a new tab so you won't lose your place.",
          ],
        },
      ],
      seeAlso: [
        { label: "Progress Timeline", href: "/dashboard" },
        { label: "Equipment Guide", href: "/equipment" },
      ],
    };
  }

  // Equipment
  if (pathname === "/equipment") {
    return {
      title: "Equipment Guide",
      sections: [
        {
          heading: "Finding gear",
          items: [
            "Use the category buttons at the top to filter by type — Headsets, Flight Bags, Electronics, Kneeboards, Charts, Apps, and more (13 categories).",
            "Type in the search box to find specific products by name. Click the X to clear your search.",
            "The result count updates as you filter so you know how many items match.",
          ],
        },
        {
          heading: "Product details",
          items: [
            "Each card shows the product image, name, description, community star rating, and vendor (Amazon or Sporty's).",
            "Click the product image or vendor button to view and purchase on the retailer's site (opens in a new tab).",
            "Some links are affiliate links — we may earn a small commission at no extra cost to you.",
          ],
        },
        {
          heading: "Ratings & suggestions",
          items: [
            "Pro users can rate any item 1–5 stars — your rating helps other students choose the best gear.",
            "Missing something? Click 'Suggest Equipment' to open a form where you can recommend a product with its name, category, reason, and a link.",
          ],
        },
      ],
      seeAlso: [{ label: "Cost & Timeline Estimator", href: "/costs" }],
    };
  }

  // Costs
  if (pathname === "/costs") {
    return {
      title: "Cost & Timeline Estimator",
      sections: [
        {
          heading: "Choosing a path",
          items: [
            "Click 'Hobby Path' to see certifications through Private Pilot, or 'Career Path' to see the full route from student pilot through Major Airline or Cargo.",
            "Blue timeline dots indicate career milestones; grey dots are non-career levels. The legend at the top explains the colors.",
          ],
        },
        {
          heading: "Reading the timeline",
          items: [
            "Each certification card shows the level name, estimated time range (months), estimated cost range, and salary range (on desktop).",
            "Click 'Show what's next' on any card to expand it and see FAA requirements (bulleted list) and step-by-step next actions (numbered list).",
            "Salary ranges appear on the expanded card on mobile.",
          ],
        },
        {
          heading: "About these estimates",
          items: [
            "Costs are national averages and vary significantly by region, aircraft type, fuel prices, and instructor rates.",
            "Training hours shown are FAA minimums — most students need more hours than the minimum to reach proficiency.",
            "Always get quotes from local flight schools and factor in ground school, examiner fees, and study materials.",
          ],
        },
      ],
      seeAlso: [
        { label: "Find a Flight School", href: "/schools" },
        { label: "Equipment Guide", href: "/equipment" },
      ],
    };
  }

  // About page
  if (pathname === "/about") {
    return {
      title: "About Us",
      sections: [
        {
          heading: "Our story",
          items: [
            "Learn about the founder's journey from aspiring pilot to building this platform.",
            "Understand the mission behind I Want To Be A Pilot and why it was created.",
          ],
        },
      ],
      seeAlso: [{ label: "View Pricing", href: "/pricing" }],
    };
  }

  // Tools page
  if (pathname === "/tools") {
    return {
      title: "Pilot Tools",
      sections: [
        {
          heading: "Available tools",
          items: [
            "Access calculators and utilities designed for student and active pilots.",
            "Tools are free to use — no account required.",
          ],
        },
      ],
    };
  }

  // Home page
  return {
    title: "I Want To Be A Pilot",
    sections: [
      {
        heading: "What you can do here",
        items: [
          "Use the pilot level buttons in the hero section to jump directly to cost breakdowns for any certification — from Student Pilot to ATP.",
          "Scroll down to see the free tools (Flight Schools, Resources, Equipment, Costs) and Pro features (Progress Timeline, DPE Finder, Test Prep, Stories, Forums).",
          "Click 'Get Started Free' to create an account, or 'Explore Costs & Timelines' to jump to the cost estimator.",
        ],
      },
      {
        heading: "Free tools (no account needed)",
        items: [
          "Flight School Search — find FAA-certified schools near your zip code with map and contact details.",
          "Cost & Timeline Estimator — see estimated costs, timeframes, and salary ranges for each certification level.",
          "Equipment Guide — browse recommended gear by category with links to Amazon and Sporty's.",
          "Free Resources — FAA handbooks, regulations, practice test links, weather tools, and career resources.",
        ],
      },
      {
        heading: "Pro features",
        items: [
          "Progress Timeline — personalized training roadmap with milestone tracking and FAA knowledge test prep (study mode with instant feedback + full sample exams with history tracking).",
          "DPE Finder — search for Designated Pilot Examiners by location with pass rate data and community ratings.",
          "Community — share and read real training stories, and discuss topics in category-based forums.",
          "Includes a free NavLog Pro account for VFR cross-country flight planning.",
        ],
      },
    ],
    seeAlso: [
      { label: "View Pricing", href: "/pricing" },
      { label: "Cost Estimator", href: "/costs" },
    ],
  };
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function HelpPanel({ open, onClose }: Props) {
  const pathname = usePathname();
  const help = getPageHelp(pathname);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-card border-l border-border shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4 border-b border-border">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
              Page Help
            </p>
            <h2 className="text-base font-semibold leading-tight">{help.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors mt-0.5"
            aria-label="Close help"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {help.sections.map((section) => (
            <div key={section.heading}>
              <p className="text-xs font-semibold text-foreground mb-2">{section.heading}</p>
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                    <span className="text-primary shrink-0 mt-0.5 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {help.seeAlso && help.seeAlso.length > 0 && (
            <div className="pt-2 border-t border-border">
              <p className="text-xs font-semibold text-foreground mb-2">See also</p>
              <div className="flex flex-wrap gap-2">
                {help.seeAlso.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className="text-xs text-primary hover:underline"
                  >
                    {link.label} →
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border">
          <Link
            href="/help"
            onClick={onClose}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            View full Help & FAQ →
          </Link>
        </div>
      </div>
    </>
  );
}
