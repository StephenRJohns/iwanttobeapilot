export interface EquipmentItem {
  id: string;
  category: string;
  name: string;
  description: string;
  vendor: "amazon" | "sportys" | "external";
  // Amazon
  asin?: string;
  searchQuery?: string;
  // Sporty's
  sportysUrl?: string;   // full product page URL on sportys.com
  // Generic external (NavLogPro, ForeFlight, etc.)
  externalUrl?: string;
  // Optional explicit product image URL (overrides auto-lookup)
  imageUrl?: string;
}

export const AFFILIATE_TAG = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || "";
export const SPORTYS_AFF_ID = process.env.NEXT_PUBLIC_SPORTYS_AFFILIATE_ID || "";

export function getAffiliateUrl(item: EquipmentItem): string {
  if (item.vendor === "sportys" && item.sportysUrl) {
    if (SPORTYS_AFF_ID) {
      return `https://sportys.idevaffiliate.com/idevaffiliate.php?id=${SPORTYS_AFF_ID}&url=${encodeURIComponent(item.sportysUrl)}`;
    }
    return item.sportysUrl;
  }
  if (item.vendor === "external" && item.externalUrl) return item.externalUrl;
  if (item.asin) return `https://www.amazon.com/dp/${item.asin}?tag=${AFFILIATE_TAG}`;
  if (item.searchQuery) return `https://www.amazon.com/s?k=${encodeURIComponent(item.searchQuery)}&tag=${AFFILIATE_TAG}`;
  return "#";
}

export function getVendorLabel(item: EquipmentItem): string {
  if (item.vendor === "sportys") return "Sporty's";
  if (item.vendor === "external") return "Visit Site";
  return "View on Amazon";
}

export const EQUIPMENT_CATEGORIES = [
  "Training Courses",
  "Aviation Tools & Apps",
  "Headsets",
  "Flight Bags",
  "Books & Study Materials",
  "Electronics & Tablets",
  "Tablet & Cockpit Accessories",
  "Clothing & Sun Protection",
  "Calculators & Instruments",
];

export const EQUIPMENT_ITEMS: EquipmentItem[] = [

  // ── Training Courses (Sporty's) ──────────────────────────────────────────
  {
    id: "sportys-learn-to-fly",
    category: "Training Courses",
    vendor: "sportys",
    name: "Sporty's Learn to Fly Course",
    description: "The most popular online ground school for Private Pilot. Video-based, FAA-accepted, includes written test prep and endorsement.",
    sportysUrl: "https://www.sportys.com/learn-to-fly-course.html",
    searchQuery: "Sporty's learn to fly course",
  },
  {
    id: "sportys-instrument-course",
    category: "Training Courses",
    vendor: "sportys",
    name: "Sporty's Instrument Rating Course",
    description: "Complete IFR ground school from Sporty's. Covers all ACS areas, includes written test prep and CFII endorsement.",
    sportysUrl: "https://www.sportys.com/instrument-rating-course.html",
    searchQuery: "Sporty's instrument rating course",
  },
  {
    id: "sportys-commercial-course",
    category: "Training Courses",
    vendor: "sportys",
    name: "Sporty's Commercial Pilot Course",
    description: "FAA-accepted commercial pilot ground school covering aerodynamics, regulations, and commercial maneuvers.",
    sportysUrl: "https://www.sportys.com/commercial-pilot-course.html",
    searchQuery: "Sporty's commercial pilot course",
  },
  {
    id: "sportys-cfi-course",
    category: "Training Courses",
    vendor: "sportys",
    name: "Sporty's CFI Certification Course",
    description: "Comprehensive CFI prep — FOI, flight instructor PTS, and lesson plan templates. Used by thousands of CFI candidates.",
    sportysUrl: "https://www.sportys.com/cfi-course.html",
    searchQuery: "Sporty's CFI certification course",
  },
  {
    id: "sportys-firc",
    category: "Training Courses",
    vendor: "sportys",
    name: "Sporty's FIRC (CFI Renewal)",
    description: "FAA-accepted Flight Instructor Refresher Course to renew your CFI certificate online. Accepted at all FAASTeam events.",
    sportysUrl: "https://www.sportys.com/firc-flight-instructor-refresher-course.html",
    searchQuery: "Sporty's FIRC flight instructor refresher",
  },

  // ── Aviation Tools & Apps ────────────────────────────────────────────────
  {
    id: "navlogpro",
    category: "Aviation Tools & Apps",
    vendor: "external",
    name: "NavLogPro",
    description: "VFR cross-country navigation log builder with E6B, live weather, and AI grading. Built for student pilots.",
    externalUrl: "https://navlogpro.training",
    searchQuery: "navlog pro aviation",
    imageUrl: "/images/navlogproSS.png",
  },
  {
    id: "planefacts",
    category: "Aviation Tools & Apps",
    vendor: "external",
    name: "PlaneFacts Online",
    description: "Aircraft lookup, N-number search, and aviation data tools.",
    externalUrl: "https://planefacts.online",
    searchQuery: "planefacts aviation tool",
    imageUrl: "/images/planefactsSS.png",
  },
  {
    id: "foreflight",
    category: "Aviation Tools & Apps",
    vendor: "external",
    name: "ForeFlight Mobile",
    description: "The industry-standard EFB app. Charts, weather, flight planning, logbook. Required by most flight schools.",
    externalUrl: "https://foreflight.com",
    searchQuery: "ForeFlight aviation app",
    imageUrl: "https://d32dgjuo8qzfhk.cloudfront.net/assets/1200x880_Releases.jpg",
  },
  {
    id: "garmin-pilot",
    category: "Aviation Tools & Apps",
    vendor: "external",
    name: "Garmin Pilot",
    description: "Full-featured EFB with excellent Garmin avionics integration.",
    externalUrl: "https://www.garmin.com/en-US/p/115856",
    searchQuery: "Garmin Pilot aviation app",
    imageUrl: "https://res.garmin.com/www/aviation/garmin-pilot/MCJT-78463/78463-banner-garmin-pilot-web-mobile.jpg",
  },
  {
    id: "sportys-pilottraining-app",
    category: "Aviation Tools & Apps",
    vendor: "sportys",
    name: "Sporty's Pilot Training App",
    description: "Free companion app for Sporty's courses. Study anywhere with flashcards, practice tests, and video lessons.",
    sportysUrl: "https://www.sportys.com/pilottraining/sportys-pilot-training-app.html",
    searchQuery: "Sporty's pilot training app",
  },

  // ── Headsets ─────────────────────────────────────────────────────────────
  {
    id: "bose-a30",
    category: "Headsets",
    vendor: "amazon",
    name: "Bose A30 Aviation Headset",
    description: "Bose's latest flagship ANR headset. Best-in-class noise cancellation, Bluetooth, and comfort. The gold standard for serious pilots.",
    asin: "B0BVBVPSX6",
    searchQuery: "Bose A30 aviation headset",
    imageUrl: "https://cdn.aircraftspruce.com/cache/400-400-/catalog/graphics/b/a30_o.jpg",
  },
  {
    id: "bose-a20",
    category: "Headsets",
    vendor: "amazon",
    name: "Bose A20 Aviation Headset",
    description: "The most popular ANR headset ever made. Outstanding noise reduction, crystal-clear audio, and Bluetooth. Lighter than the A30 — beloved by GA and airline pilots alike.",
    asin: "B010FTYIUS",
    searchQuery: "Bose A20 aviation headset dual GA plug Bluetooth",
  },
  {
    id: "bose-proflight-2",
    category: "Headsets",
    vendor: "sportys",
    name: "Bose ProFlight Series 2",
    description: "In-ear ANR headset for jet and commercial pilots. Incredibly light at 5.3 oz — ideal for long-haul and turbine operations. Not recommended for high-noise piston training.",
    sportysUrl: "https://www.sportys.com/bose-proflight-series-2-aviation-headset-with-bluetooth.html",
    searchQuery: "Bose ProFlight Series 2 aviation headset",
  },
  {
    id: "lightspeed-zulu3",
    category: "Headsets",
    vendor: "amazon",
    name: "Lightspeed Zulu 3",
    description: "Premium ANR headset loved by professional pilots. Outstanding comfort and clarity.",
    asin: "B01N6YC6EY",
    searchQuery: "Lightspeed Zulu 3 aviation headset",
    imageUrl: "https://cdn.aircraftspruce.com/cache/400-400-/catalog/graphics/1/11-14868.jpg",
  },
  {
    id: "david-clark-h10",
    category: "Headsets",
    vendor: "amazon",
    name: "David Clark H10-13.4",
    description: "The classic passive headset. Durable and reliable. Many pilots start and end their careers with David Clark.",
    asin: "B0011Z9PM2",
    searchQuery: "David Clark H10-13.4 headset",
    imageUrl: "https://www.aircraftspruce.com/catalog/graphics/11-03815.jpg",
  },
  {
    id: "rugged-air-ra950",
    category: "Headsets",
    vendor: "amazon",
    name: "Rugged Air RA950",
    description: "Budget-friendly ANR headset. Great for student pilots who want ANR without the premium price.",
    asin: "B00SLY70MS",
    searchQuery: "Rugged Air RA950 aviation headset student",
    imageUrl: "https://www.aircraftspruce.com/catalog/graphics/13-09294.jpg",
  },
  {
    id: "sportys-headset",
    category: "Headsets",
    vendor: "sportys",
    name: "Sporty's S-LAX Stereo Headset",
    description: "Sporty's own passive stereo headset — excellent value for student pilots starting out.",
    sportysUrl: "https://www.sportys.com/s-lax-stereo-headset.html",
    searchQuery: "Sporty's student pilot headset",
  },

  // ── Flight Bags ───────────────────────────────────────────────────────────
  {
    id: "brightline-bags",
    category: "Flight Bags",
    vendor: "amazon",
    name: "BrightLine Flex B4 Swift Flight Bag",
    description: "Modular flight bag system loved by professional pilots. Customizable and TSA-carry-on compliant.",
    asin: "B01GEHGX6M",
    searchQuery: "BrightLine Bags Flex B4 Swift flight bag pilot modular",
    imageUrl: "https://brightlinebags.s3-us-west-1.amazonaws.com/media/Products/b4-swift-1/B4_01_1200.jpg",
  },
  {
    id: "sportys-flight-bag",
    category: "Flight Bags",
    vendor: "sportys",
    name: "Sporty's Pilot Training Bag",
    description: "Purpose-built pilot bag with dedicated compartments for headset, charts, iPad, and kneeboard.",
    sportysUrl: "https://www.sportys.com/sporty-s-pilot-training-bag.html",
    searchQuery: "Sporty's pilot training bag",
  },
  {
    id: "flightoutfitters-lift",
    category: "Flight Bags",
    vendor: "amazon",
    name: "Flight Outfitters Lift Flight Bag",
    description: "Sleek, modern flight bag with great organization and rolling carry-on option.",
    asin: "B00YYK3UCM",
    searchQuery: "Flight Outfitters Lift flight bag",
    imageUrl: "https://www.aircraftspruce.com/catalog/graphics/3/13-25616a.jpg",
  },

  // ── Books & Study Materials ───────────────────────────────────────────────
  {
    id: "phak",
    category: "Books & Study Materials",
    vendor: "amazon",
    name: "Pilot's Handbook of Aeronautical Knowledge",
    description: "The FAA's official PPL bible. Essential reading for every pilot. Also available free on FAA.gov.",
    asin: "1644253461",
    searchQuery: "Pilot's Handbook Aeronautical Knowledge FAA",
    imageUrl: "https://cdn11.bigcommerce.com/s-m5qljysoqy/images/stencil/500x659/products/4717/2826/8083-25C__48108.1689108353.1280.1280__06253.1729533996.jpg?c=1",
  },
  {
    id: "afh",
    category: "Books & Study Materials",
    vendor: "amazon",
    name: "Airplane Flying Handbook (FAA-H-8083-3)",
    description: "Official FAA guide to flying maneuvers and procedures. Required knowledge for PPL checkride.",
    asin: "1644250683",
    searchQuery: "Airplane Flying Handbook FAA",
    imageUrl: "https://cdn11.bigcommerce.com/s-m5qljysoqy/images/stencil/500x659/products/4323/1706/8083-3C__07740.1642784925.1280.1280__71899.1642787755.jpg?c=1",
  },
  {
    id: "far-aim",
    category: "Books & Study Materials",
    vendor: "sportys",
    name: "FAR/AIM (Current Edition)",
    description: "Federal Aviation Regulations and Aeronautical Information Manual. Every pilot needs a current copy.",
    sportysUrl: "https://www.sportys.com/far-aim.html",
    searchQuery: "FAR AIM Federal Aviation Regulations",
  },
  {
    id: "gleim-ppl",
    category: "Books & Study Materials",
    vendor: "amazon",
    name: "Gleim Private Pilot Test Prep",
    description: "Most comprehensive written test prep guide. Used by thousands of student pilots.",
    asin: "1618547097",
    searchQuery: "Gleim Private Pilot test prep written",
  },
  {
    id: "sheppard-air",
    category: "Books & Study Materials",
    vendor: "external",
    name: "Sheppard Air Written Test Prep",
    description: "Guaranteed to pass or your money back. The most efficient FAA written test prep available.",
    externalUrl: "https://www.sheppardair.com",
    searchQuery: "Sheppard Air FAA written test",
    imageUrl: "https://www.sheppardair.com/im/slider1.jpg",
  },
  {
    id: "sportys-checkride-prep",
    category: "Books & Study Materials",
    vendor: "sportys",
    name: "Sporty's Checkride Prep Bundle",
    description: "Private Pilot checkride prep — oral exam guide, ACS study materials, and practical test prep from Sporty's.",
    sportysUrl: "https://www.sportys.com/private-pilot-checkride-prep.html",
    searchQuery: "Sporty's private pilot checkride prep oral",
  },

  // ── Electronics & Tablets ─────────────────────────────────────────────────
  {
    id: "ipad-mini",
    category: "Electronics & Tablets",
    vendor: "amazon",
    name: "Apple iPad mini",
    description: "The preferred EFB device for pilots. Perfectly sized for cockpit use with ForeFlight or Garmin Pilot.",
    asin: "B09G91LXFP",
    searchQuery: "Apple iPad mini aviation pilot EFB",
  },
  {
    id: "ipad-air",
    category: "Electronics & Tablets",
    vendor: "amazon",
    name: "Apple iPad Air",
    description: "Larger screen option for route planning and chart display.",
    asin: "B09V3HN1KC",
    searchQuery: "Apple iPad Air aviation pilot",
  },
  {
    id: "stratus-3",
    category: "Electronics & Tablets",
    vendor: "sportys",
    name: "Stratus 3 ADS-B Receiver",
    description: "Portable ADS-B receiver for traffic and weather on your iPad. Integrates with ForeFlight.",
    sportysUrl: "https://www.sportys.com/stratus-3-adsb-receiver.html",
    searchQuery: "Stratus 3 ADS-B receiver ForeFlight",
  },
  {
    id: "dual-xgps170",
    category: "Electronics & Tablets",
    vendor: "amazon",
    name: "Dual XGPS170 GPS Receiver",
    description: "External GPS receiver for accurate position on tablets that don't have built-in GPS.",
    asin: "B008RYZU38",
    searchQuery: "Dual XGPS170 GPS receiver iPad aviation",
    imageUrl: "https://www.dualav.com/wp-content/uploads/2023/05/xgps170.jpg",
  },

  // ── Tablet & Cockpit Accessories ──────────────────────────────────────────
  {
    id: "ram-ipad-mount",
    category: "Tablet & Cockpit Accessories",
    vendor: "amazon",
    name: "RAM Mounts iPad Cockpit Mount",
    description: "Industry-standard mount system. Attaches to yoke, suction cup, or panel with rock-solid stability.",
    asin: "B09K4PBSCQ",
    searchQuery: "RAM mount iPad cockpit yoke aviation",
    imageUrl: "https://www.aircraftspruce.com/catalog/graphics/1/11-19217.jpg",
  },
  {
    id: "sporty-kneeboard",
    category: "Tablet & Cockpit Accessories",
    vendor: "sportys",
    name: "Sporty's iPad Kneeboard",
    description: "Keep your iPad secured to your leg in the cockpit. Designed specifically for iPad mini and Air.",
    sportysUrl: "https://www.sportys.com/sporty-s-ipad-kneeboard.html",
    searchQuery: "Sporty's iPad kneeboard pilot aviation",
  },
  {
    id: "thigh-board",
    category: "Tablet & Cockpit Accessories",
    vendor: "amazon",
    name: "Flight Outfitters Pilot Thigh Board",
    description: "Clip-on thigh board for checklist, charts, and notes. Essential for any cockpit.",
    asin: "B07GBGDF8R",
    searchQuery: "pilot thigh board kneeboard cockpit",
    imageUrl: "https://cdn.aircraftspruce.com/cache/400-400-/catalog/graphics/3/13-23896a.jpg",
  },

  // ── Clothing & Sun Protection ─────────────────────────────────────────────
  {
    id: "maui-jim-sunglasses",
    category: "Clothing & Sun Protection",
    vendor: "amazon",
    name: "Maui Jim Neutral Grey Sunglasses",
    description: "Polarized lenses in neutral grey — recommended for pilots to avoid distortion of cockpit instruments and traffic.",
    asin: "B003416YMA",
    searchQuery: "Maui Jim neutral grey polarized sunglasses pilot",
    imageUrl: "https://flightsunglasses.com/cdn/shop/products/stingrayHCL.png?v=1559005121",
  },
  {
    id: "oakley-aviator",
    category: "Clothing & Sun Protection",
    vendor: "amazon",
    name: "Oakley Latch Key Sunglasses",
    description: "Lightweight wraparound with anti-reflective coating. Great cockpit visibility.",
    asin: "B07CZN2BFT",
    searchQuery: "Oakley pilot sunglasses aviation",
    imageUrl: "https://shadessunglasses.com/cdn/shop/products/oo4060-22_grande.jpg?v=1697808852",
  },
  {
    id: "sportys-shirt",
    category: "Clothing & Sun Protection",
    vendor: "sportys",
    name: "Sporty's Pilot Polo Shirt",
    description: "Professional aviation polo from Sporty's — embroidered airplane logo, moisture-wicking fabric.",
    sportysUrl: "https://www.sportys.com/pilot-polo-shirt.html",
    searchQuery: "Sporty's pilot polo shirt aviation",
  },

  // ── Calculators & Instruments ─────────────────────────────────────────────
  {
    id: "asr-e6b",
    category: "Calculators & Instruments",
    vendor: "sportys",
    name: "Sporty's Electronic E6B",
    description: "Digital E6B from Sporty's. Calculates crosswind, fuel, TAS, density altitude. FAA test legal.",
    sportysUrl: "https://www.sportys.com/sportys-e6b-flight-computer.html",
    searchQuery: "Sporty's electronic E6B flight computer",
  },
  {
    id: "mechanical-e6b",
    category: "Calculators & Instruments",
    vendor: "sportys",
    name: "Sporty's Manual E6B",
    description: "The classic circular slide rule flight computer from Sporty's. Required to know for checkride.",
    sportysUrl: "https://www.sportys.com/manual-e6b-flight-computer.html",
    searchQuery: "manual E6B circular slide rule pilot",
  },
  {
    id: "foggles",
    category: "Calculators & Instruments",
    vendor: "sportys",
    name: "Sporty's Foggles (View-Limiting Device)",
    description: "Required for instrument training. Limits outside view to simulate IMC conditions.",
    sportysUrl: "https://www.sportys.com/foggles.html",
    searchQuery: "Foggles view limiting device instrument training pilot",
  },
  {
    id: "plotter",
    category: "Calculators & Instruments",
    vendor: "sportys",
    name: "Sporty's VFR Plotter",
    description: "Manual navigation plotter for sectional charts. Required for PPL training.",
    sportysUrl: "https://www.sportys.com/plotter.html",
    searchQuery: "VFR plotter sectional chart navigation pilot",
  },
];
