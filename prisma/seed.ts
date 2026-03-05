import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. SiteSettings singleton
  await db.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });
  console.log("✓ SiteSettings singleton");

  // 2. Discussion Categories
  const categories = [
    { name: "General Aviation", slug: "general-aviation", description: "Anything and everything aviation", order: 1 },
    { name: "Training & Checkrides", slug: "training-checkrides", description: "Study tips, checkride prep, and training experiences", order: 2 },
    { name: "Flight Schools", slug: "flight-schools", description: "Reviews and recommendations for flight schools", order: 3 },
    { name: "Career Path", slug: "career-path", description: "Career advice, job hunting, airline life", order: 4 },
    { name: "Equipment & Gear", slug: "equipment-gear", description: "Headsets, iPads, flight bags, and more", order: 5 },
    { name: "DPE Experiences", slug: "dpe-experiences", description: "Share your checkride DPE experiences", order: 6 },
  ];

  for (const cat of categories) {
    await db.discussionCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, order: cat.order },
      create: cat,
    });
  }
  console.log("✓ Discussion categories");

  // 3. Sample Flight Schools
  const schools = [
    {
      name: "Embry-Riddle Aeronautical University",
      address: "600 S Clyde Morris Blvd",
      city: "Daytona Beach",
      state: "FL",
      zipCode: "32114",
      phone: "(386) 226-6000",
      website: "https://erau.edu",
      lat: 29.1872,
      lng: -81.0482,
    },
    {
      name: "ATP Flight School - Phoenix",
      address: "3800 E Sky Harbor Blvd",
      city: "Phoenix",
      state: "AZ",
      zipCode: "85034",
      phone: "(904) 595-7950",
      website: "https://atpflightschool.com",
      lat: 33.4373,
      lng: -112.0078,
    },
    {
      name: "CAE Oxford Aviation Academy",
      address: "1400 Technology Dr",
      city: "Mesa",
      state: "AZ",
      zipCode: "85206",
      phone: "(480) 830-8888",
      website: "https://cae.com",
      lat: 33.4152,
      lng: -111.8315,
    },
    {
      name: "Epic Flight Academy",
      address: "600 Skyraider Way",
      city: "New Smyrna Beach",
      state: "FL",
      zipCode: "32168",
      phone: "(386) 409-5583",
      website: "https://epicflightacademy.com",
      lat: 29.0558,
      lng: -80.9487,
    },
    {
      name: "Sierra Academy of Aeronautics",
      address: "2600 Hangar Dr",
      city: "Oakland",
      state: "CA",
      zipCode: "94621",
      phone: "(510) 568-6100",
      website: "https://sierraacademy.com",
      lat: 37.7213,
      lng: -122.2208,
    },
    {
      name: "Kansas City Aviation Center",
      address: "11300 NW Prairie View Rd",
      city: "Kansas City",
      state: "MO",
      zipCode: "64153",
      phone: "(816) 891-5222",
      website: "https://kcaviation.com",
      lat: 39.2975,
      lng: -94.7139,
    },
    {
      name: "Chicago Flight Center",
      address: "8801 W Zemke Rd",
      city: "Chicago",
      state: "IL",
      zipCode: "60666",
      phone: "(773) 894-8760",
      website: "https://chicagoflightcenter.com",
      lat: 41.9742,
      lng: -87.9073,
    },
    {
      name: "ATP Flight School - Dallas",
      address: "5100 Alliance Gateway Fwy",
      city: "Fort Worth",
      state: "TX",
      zipCode: "76177",
      phone: "(904) 595-7950",
      website: "https://atpflightschool.com",
      lat: 32.9889,
      lng: -97.1512,
    },
    {
      name: "Sundance Aviation",
      address: "7151 S Meridian Ave",
      city: "Oklahoma City",
      state: "OK",
      zipCode: "73169",
      phone: "(405) 685-3548",
      website: "https://sundanceaviation.com",
      lat: 35.3898,
      lng: -97.6008,
    },
    {
      name: "Purdue University Airport",
      address: "2889 Purdue Rd",
      city: "West Lafayette",
      state: "IN",
      zipCode: "47906",
      phone: "(765) 494-5000",
      website: "https://purdue.edu",
      lat: 40.4128,
      lng: -86.9369,
    },
    // San Antonio area
    {
      name: "South Texas Aviation",
      address: "9800 Airport Blvd",
      city: "San Antonio",
      state: "TX",
      zipCode: "78216",
      phone: "(210) 342-5566",
      website: "https://southtexasaviation.com",
      lat: 29.5337,
      lng: -98.4698,
    },
    {
      name: "Texas Air Aces",
      address: "1295 Stinson Dr",
      city: "San Antonio",
      state: "TX",
      zipCode: "78214",
      phone: "(210) 924-2233",
      website: "https://texasairaces.com",
      lat: 29.3369,
      lng: -98.4712,
    },
    {
      name: "Sun Air Aviation",
      address: "9800 Airport Blvd, Hangar 7",
      city: "San Antonio",
      state: "TX",
      zipCode: "78216",
      phone: "(210) 349-7867",
      website: "https://sunairaviation.com",
      lat: 29.5353,
      lng: -98.4721,
    },
    {
      name: "Lone Star Flight Training",
      address: "15150 Aviation Dr",
      city: "San Antonio",
      state: "TX",
      zipCode: "78245",
      phone: "(210) 671-3900",
      website: "https://lonestarflight.com",
      lat: 29.3838,
      lng: -98.5811,
    },
    {
      name: "ATP Flight School - San Antonio",
      address: "9800 Airport Blvd",
      city: "San Antonio",
      state: "TX",
      zipCode: "78216",
      phone: "(904) 595-7950",
      website: "https://atpflightschool.com",
      lat: 29.5360,
      lng: -98.4680,
    },
    {
      name: "New Braunfels Aviation",
      address: "1601 Airport Dr",
      city: "New Braunfels",
      state: "TX",
      zipCode: "78130",
      phone: "(830) 625-9803",
      website: "https://newbraunfelsaviation.com",
      lat: 29.7025,
      lng: -98.0442,
    },
    {
      name: "Seguin Aviation",
      address: "3700 Airport Rd",
      city: "Seguin",
      state: "TX",
      zipCode: "78155",
      phone: "(830) 379-3121",
      website: "https://seguinaviation.com",
      lat: 29.5660,
      lng: -97.9631,
    },
  ];

  for (const school of schools) {
    const existing = await db.flightSchool.findFirst({
      where: { name: school.name, city: school.city },
    });
    if (!existing) {
      await db.flightSchool.create({ data: school });
    }
  }
  console.log("✓ Flight schools");

  // 4. Admin account
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment");
  }
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  await db.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Admin",
      hashedPassword,
      role: "admin",
      tier: "pro",
      status: "active",
      emailVerified: new Date(),
      mustChangePassword: false,
    },
  });
  console.log("✓ Admin account");

  console.log("\nSeed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
