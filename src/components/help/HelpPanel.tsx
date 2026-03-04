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
  // Auth pages — shouldn't normally show but just in case
  if (pathname.startsWith("/auth/")) {
    return {
      title: "Sign In / Register",
      sections: [
        {
          heading: "Signing in",
          items: [
            "Use your email and password, or click the Google button to sign in instantly.",
            "Forgot your password? Click the link below the form.",
          ],
        },
        {
          heading: "Creating an account",
          items: [
            "A free account lets you track progress and access Pro features.",
            "You'll receive a verification email — check your spam folder if it doesn't arrive.",
          ],
        },
      ],
    };
  }

  // Admin section
  if (pathname.startsWith("/admin")) {
    return {
      title: "Admin Panel",
      sections: [
        {
          heading: "Users",
          items: [
            "View and search all registered users.",
            "Edit a user's tier (free/pro) or role (user/admin).",
            "Deactivate or delete accounts as needed.",
          ],
        },
        {
          heading: "Promo Codes",
          items: [
            "Create single-use or multi-use promo codes that grant Pro access.",
            "Toggle codes active/inactive without deleting them.",
          ],
        },
        {
          heading: "Audit Log",
          items: [
            "View a timestamped record of system events and admin actions.",
          ],
        },
        {
          heading: "Settings",
          items: [
            "Configure site-wide settings that affect all users.",
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
          heading: "Profile",
          items: [
            "Update your name, email address, and pilot goal.",
            "Changes take effect immediately after saving.",
          ],
        },
        {
          heading: "Password",
          items: [
            "Enter your current password, then your new password twice.",
            "Changing your password signs out all other active sessions.",
          ],
        },
        {
          heading: "Billing",
          items: [
            "Click 'Manage Billing' to open the Stripe portal — cancel, upgrade, or update your payment method there.",
            "Cancellation takes effect at the end of the current billing period; you keep Pro access until then.",
          ],
        },
        {
          heading: "Delete Account",
          items: [
            "Permanently deletes all your data — stories, posts, progress, and profile. This cannot be undone.",
          ],
        },
      ],
    };
  }

  // Dashboard / Progress Timeline
  if (pathname === "/dashboard") {
    return {
      title: "Progress Timeline",
      sections: [
        {
          heading: "How it works",
          items: [
            "Your training journey is laid out as a vertical timeline from your first certification to your goal.",
            "Click any level card to expand it and see step-by-step guidance on what to do next.",
            "Check off milestones as you complete them — your progress is saved automatically.",
          ],
        },
        {
          heading: "Setting your goal",
          items: [
            "Update your pilot goal in Settings to customize which levels appear on your timeline.",
            "Hobby Path ends at Private Pilot. Career Path continues through Major Airline / Cargo.",
          ],
        },
      ],
      seeAlso: [{ label: "Cost & Timeline Estimates", href: "/costs" }],
    };
  }

  // DPE Finder
  if (pathname === "/dpe-finder") {
    return {
      title: "DPE Finder",
      sections: [
        {
          heading: "Finding an examiner",
          items: [
            "Search by last name, certificate type (Private, Instrument, Commercial, etc.), or state.",
            "Pass rate data shows aggregate FAA checkride statistics for each examiner — for reference only.",
            "A high pass rate doesn't guarantee you'll pass; a lower rate doesn't mean avoid them.",
          ],
        },
        {
          heading: "Before you schedule",
          items: [
            "Always verify the DPE's current authorization directly with your local FSDO or on FAA DragonWave.",
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
          heading: "Reading stories",
          items: [
            "Browse real training journeys from pilots at every level — student pilot to airline captain.",
            "Filter by certification level to find stories relevant to where you are in training.",
            "Stories show time, cost, and current salary to help set realistic expectations.",
          ],
        },
        {
          heading: "Sharing your story",
          items: [
            "Click 'Share Your Story' to add your own training journey.",
            "Include the certifications you've earned, how long each took, costs, and your current role.",
            "Stories help other aspiring pilots know what to expect.",
          ],
        },
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
            "Select all the certification levels you've achieved or are working toward.",
            "Include real numbers — training time, costs, hours — these are the most valuable details.",
            "You can edit or delete your story after posting from the story detail page.",
          ],
        },
        {
          heading: "What makes a great story",
          items: [
            "Be specific: 'passed my PPL checkride on first attempt after 62 hours' is more useful than vague summaries.",
            "Honest accounts — including struggles and setbacks — are the most helpful for others.",
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
          heading: "This page",
          items: [
            "You're reading a pilot's personal training journey.",
            "Use the cost and time figures as a reference point — your experience will vary based on location, aircraft type, and schedule.",
            "Consider sharing your own story to help others.",
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
      title: "Discussion Post",
      sections: [
        {
          heading: "Participating",
          items: [
            "Read replies in chronological order.",
            "Click 'Reply' to add your own response.",
            "Keep replies on topic and respectful — this is a community for everyone.",
          ],
        },
        {
          heading: "Tips",
          items: [
            "Quote the relevant part of a post in your reply for clarity.",
            "If you have a new question, start a new post in the appropriate category.",
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
            "Click a post title to read the full thread and all replies.",
            "The reply count and view count help identify the most active discussions.",
          ],
        },
        {
          heading: "Creating a post",
          items: [
            "Click 'New Post' to start a discussion in this category.",
            "Be specific with your title — good titles get more helpful replies.",
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
          heading: "Categories",
          items: [
            "Click a category to see all posts in that topic area.",
            "Categories cover license types, school experiences, DPE experiences, job finding, and more.",
            "The post count and latest activity are shown for each category.",
          ],
        },
        {
          heading: "Getting started",
          items: [
            "Browse existing posts before creating a new one — your question may already be answered.",
            "Click into a category, then click 'New Post' to start a discussion.",
          ],
        },
      ],
    };
  }

  // Pricing
  if (pathname === "/pricing") {
    return {
      title: "Pricing",
      sections: [
        {
          heading: "Free vs. Pro",
          items: [
            "Free gives you flight school search, cost estimator, equipment guide, and free resources — no account needed.",
            "Pro adds the progress timeline, DPE finder, pilot stories, discussion forums, equipment ratings, and a free NavLogPro account.",
          ],
        },
        {
          heading: "Billing",
          items: [
            "Annual billing saves 17% vs monthly.",
            "Cancel anytime from Settings — you keep Pro access until the end of the billing period.",
            "Have a promo code? Scroll down to the promo code box.",
          ],
        },
        {
          heading: "NavLogPro bundle",
          items: [
            "Pro includes a free NavLogPro account (normally $50/year).",
            "After subscribing, return to this page to generate your promo code.",
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
          heading: "Searching",
          items: [
            "Enter your zip code and click Search to find FAA-certified flight schools near you.",
            "Results appear on the map and as a list below — click any marker or list item for details.",
            "Schools are sorted by distance from your zip code.",
          ],
        },
        {
          heading: "What to look for",
          items: [
            "Part 61 schools offer flexible scheduling. Part 141 schools follow an FAA-approved syllabus.",
            "Call ahead to confirm aircraft availability, instructor availability, and current pricing.",
            "Pro users can leave ratings and reviews for schools they've attended.",
          ],
        },
      ],
    };
  }

  // Resources
  if (pathname === "/resources") {
    return {
      title: "Free Resources",
      sections: [
        {
          heading: "What's here",
          items: [
            "Official FAA handbooks — the Pilot's Handbook of Aeronautical Knowledge (PHAK) and Airplane Flying Handbook (AFH) are essential for every student pilot.",
            "Airman Certification Standards (ACS) define exactly what you'll be tested on at your checkride.",
            "Practice written test services let you drill FAA knowledge test questions before the real exam.",
          ],
        },
        {
          heading: "Study tips",
          items: [
            "Start with the PHAK chapters relevant to your current training stage — don't try to read it cover to cover.",
            "Use the ACS as a checklist: know every task and its references before scheduling your checkride.",
          ],
        },
      ],
    };
  }

  // Equipment
  if (pathname === "/equipment") {
    return {
      title: "Equipment Guide",
      sections: [
        {
          heading: "Browsing",
          items: [
            "Use the category buttons to filter by item type — headsets, flight bags, apps, charts, and more.",
            "Click any product image or the buy button to view it on Amazon or Sporty's.",
            "Some links are affiliate links — we may earn a small commission at no cost to you.",
          ],
        },
        {
          heading: "Ratings",
          items: [
            "Pro users can rate items 1–5 stars to help others make informed choices.",
            "Have a suggestion? Click 'Suggest Equipment' to recommend something we're missing.",
          ],
        },
      ],
    };
  }

  // Costs
  if (pathname === "/costs") {
    return {
      title: "Cost & Timeline Estimator",
      sections: [
        {
          heading: "Using the estimator",
          items: [
            "Toggle between Hobby Path and Career Path to see the certifications relevant to your goal.",
            "Click any certification card to expand it — you'll see FAA requirements, step-by-step next actions, and salary ranges.",
            "The timeline dot color shows career milestones (blue) vs. non-career levels (grey).",
          ],
        },
        {
          heading: "About the numbers",
          items: [
            "Costs are national averages — actual costs vary significantly by location, aircraft type, and instructor rates.",
            "Always get quotes from local flight schools before budgeting.",
            "Training hours shown are FAA minimums; most students require more.",
          ],
        },
      ],
      seeAlso: [{ label: "Find a Flight School", href: "/schools" }],
    };
  }

  // Home page default
  return {
    title: "I Want To Be A Pilot",
    sections: [
      {
        heading: "Getting started",
        items: [
          "Explore free tools — flight school search, cost estimator, equipment guide, and FAA resources — no account needed.",
          "Create a free account to unlock the Pro features: progress timeline, DPE finder, pilot stories, and discussion forums.",
          "Use the pilot level selector on this page to jump straight to the cost breakdown for your goal.",
        ],
      },
      {
        heading: "Free vs. Pro",
        items: [
          "Free: Schools, Resources, Equipment, Costs, Pricing.",
          "Pro: Progress timeline, DPE Finder, Stories, Discussions, Equipment ratings, free NavLogPro account.",
        ],
      },
    ],
    seeAlso: [{ label: "View Pricing", href: "/pricing" }],
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
