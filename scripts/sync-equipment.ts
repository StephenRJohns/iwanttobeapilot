/**
 * Equipment Sync Script
 *
 * Validates existing equipment URLs, discovers new products via Claude AI,
 * updates equipment.ts and pilot-levels.ts, then commits changes via git.
 *
 * Usage: npx tsx scripts/sync-equipment.ts
 * Env:   ANTHROPIC_API_KEY, RESEND_API_KEY (optional for email alerts)
 */

import fs from "fs";
import path from "path";
import https from "https";
import http from "http";

// ── Types ────────────────────────────────────────────────────────────────────

interface EquipmentItem {
  id: string;
  category: string;
  name: string;
  description: string;
  vendor: "amazon" | "sportys" | "external";
  asin?: string;
  searchQuery?: string;
  sportysUrl?: string;
  externalUrl?: string;
  imageUrl?: string;
}

interface SyncReport {
  removed: string[];
  updated: string[];
  added: string[];
  errors: string[];
  unchanged: number;
}

// ── Paths ────────────────────────────────────────────────────────────────────

const ROOT = path.resolve(__dirname, "..");
const EQUIPMENT_PATH = path.join(ROOT, "src/data/equipment.ts");
const PILOT_LEVELS_PATH = path.join(ROOT, "src/data/pilot-levels.ts");

// ── Category → Milestone Mapping ─────────────────────────────────────────────

const CATEGORY_MILESTONE_MAP: Record<string, string[]> = {
  "Training Courses": ["student", "private", "instrument", "commercial", "cfi"],
  "Headsets": ["enthusiast", "student", "private", "instrument", "commercial", "multi-engine", "cfi", "cfii", "private-charter", "regional", "major", "cargo"],
  "Flight Bags": ["private", "instrument", "commercial", "multi-engine", "cfi", "cfii", "private-charter", "regional", "major", "cargo"],
  "Books & Study Materials": ["student", "private"],
  "Logbooks & Flashcards": ["student", "private"],
  "Electronics & Tablets": ["private", "instrument", "commercial", "multi-engine", "cfi", "cfii", "private-charter", "regional", "major", "cargo"],
  "Tablet & Cockpit Accessories": ["private", "instrument", "commercial", "multi-engine", "cfi"],
  "Radios & Intercoms": ["private", "instrument", "commercial", "multi-engine"],
  "Preflight & Safety": ["enthusiast", "student", "private"],
  "Calculators & Instruments": ["student", "private"],
  "Clothing & Sun Protection": ["enthusiast", "student", "private", "instrument", "commercial", "multi-engine", "cfi", "cfii", "private-charter", "regional", "major", "cargo"],
  "Aviation Tools & Apps": ["student", "private", "instrument", "commercial", "cfi"],
};

// ── HTTP Helpers ──────────────────────────────────────────────────────────────

function headUrl(url: string): Promise<{ status: number; location?: string }> {
  return new Promise((resolve) => {
    const mod = url.startsWith("https") ? https : http;
    const req = mod.request(
      url,
      {
        method: "HEAD",
        timeout: 10000,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; EquipmentSync/1.0)",
          Accept: "*/*",
        },
      },
      (res) => {
        resolve({
          status: res.statusCode || 0,
          location: res.headers.location || undefined,
        });
      }
    );
    req.on("error", () => resolve({ status: 0 }));
    req.on("timeout", () => {
      req.destroy();
      resolve({ status: 0 });
    });
    req.end();
  });
}

async function checkUrl(url: string): Promise<"ok" | "redirect" | "dead"> {
  const result = await headUrl(url);
  if (result.status >= 200 && result.status < 400) return "ok";
  if (result.status === 301 || result.status === 302) return "redirect";
  // Some sites block HEAD — try GET with range header
  return "dead";
}

function getItemUrl(item: EquipmentItem): string | null {
  if (item.vendor === "sportys" && item.sportysUrl) return item.sportysUrl;
  if (item.vendor === "external" && item.externalUrl) return item.externalUrl;
  if (item.asin) return `https://www.amazon.com/dp/${item.asin}`;
  return null;
}

// ── Parse Current Equipment ──────────────────────────────────────────────────

function parseEquipmentFile(): EquipmentItem[] {
  // Use dynamic import workaround: read the file and eval the array
  const content = fs.readFileSync(EQUIPMENT_PATH, "utf-8");

  // Extract the array between EQUIPMENT_ITEMS: EquipmentItem[] = [ ... ];
  const match = content.match(
    /export const EQUIPMENT_ITEMS:\s*EquipmentItem\[\]\s*=\s*\[([\s\S]*?)\];\s*$/m
  );
  if (!match) throw new Error("Could not parse EQUIPMENT_ITEMS from equipment.ts");

  // Clean up the TypeScript-specific parts and eval as JSON-ish
  const arrayStr = "[" + match[1] + "]";
  // Replace single-line comments
  const cleaned = arrayStr
    .replace(/\/\/.*$/gm, "")
    .replace(/,\s*([\]}])/g, "$1"); // trailing commas

  try {
    return JSON.parse(cleaned);
  } catch {
    // Fallback: use Function constructor (safe here — we control the file)
    const fn = new Function(
      `return ${arrayStr.replace(/\/\/.*$/gm, "")}`
    );
    return fn();
  }
}

// ── Write Equipment File ─────────────────────────────────────────────────────

function writeEquipmentFile(items: EquipmentItem[]): void {
  const grouped = new Map<string, EquipmentItem[]>();
  for (const item of items) {
    const list = grouped.get(item.category) || [];
    list.push(item);
    grouped.set(item.category, list);
  }

  let code = `export interface EquipmentItem {
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
  // Generic external (NavLog Pro, ForeFlight, etc.)
  externalUrl?: string;
  // Optional explicit product image URL (must be self-hosted or licensed)
  imageUrl?: string;
}

export const AFFILIATE_TAG = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || "";
export const SPORTYS_AFF_ID = process.env.NEXT_PUBLIC_SPORTYS_AFFILIATE_ID || "";

export function getAffiliateUrl(item: EquipmentItem): string {
  if (item.vendor === "sportys" && item.sportysUrl) {
    if (SPORTYS_AFF_ID) {
      return \`https://sportys.idevaffiliate.com/idevaffiliate.php?id=\${SPORTYS_AFF_ID}&url=\${encodeURIComponent(item.sportysUrl)}\`;
    }
    return item.sportysUrl;
  }
  if (item.vendor === "external" && item.externalUrl) return item.externalUrl;
  if (item.asin) return \`https://www.amazon.com/dp/\${item.asin}?tag=\${AFFILIATE_TAG}\`;
  if (item.searchQuery) return \`https://www.amazon.com/s?k=\${encodeURIComponent(item.searchQuery)}&tag=\${AFFILIATE_TAG}\`;
  return "#";
}

export function getVendorLabel(item: EquipmentItem): string {
  if (item.vendor === "sportys") return "Sporty's";
  if (item.vendor === "external") return "Visit Site";
  return "View on Amazon";
}

export const EQUIPMENT_CATEGORIES = [
`;

  // Write categories
  const categories = [...new Set(items.map((i) => i.category))];
  for (const cat of categories) {
    code += `  "${cat}",\n`;
  }
  code += `];\n\n`;

  code += `export const EQUIPMENT_ITEMS: EquipmentItem[] = [\n`;

  for (const [category, catItems] of grouped) {
    code += `\n  // ── ${category} ${"─".repeat(Math.max(0, 68 - category.length))}─\n`;
    for (const item of catItems) {
      code += `  {\n`;
      code += `    id: "${item.id}",\n`;
      code += `    category: "${item.category}",\n`;
      code += `    vendor: "${item.vendor}",\n`;
      code += `    name: ${JSON.stringify(item.name)},\n`;
      code += `    description: ${JSON.stringify(item.description)},\n`;
      if (item.asin) code += `    asin: "${item.asin}",\n`;
      if (item.sportysUrl) code += `    sportysUrl: "${item.sportysUrl}",\n`;
      if (item.externalUrl) code += `    externalUrl: "${item.externalUrl}",\n`;
      if (item.searchQuery) code += `    searchQuery: ${JSON.stringify(item.searchQuery)},\n`;
      if (item.imageUrl) code += `    imageUrl: "${item.imageUrl}",\n`;
      code += `  },\n`;
    }
  }

  code += `];\n`;

  fs.writeFileSync(EQUIPMENT_PATH, code, "utf-8");
}

// ── Update Pilot Levels ──────────────────────────────────────────────────────

function addProductToMilestones(newProductIds: string[], categoryMap: Record<string, string>): void {
  let content = fs.readFileSync(PILOT_LEVELS_PATH, "utf-8");

  for (const productId of newProductIds) {
    const category = categoryMap[productId];
    if (!category) continue;

    const milestones = CATEGORY_MILESTONE_MAP[category] || [];
    for (const milestoneId of milestones) {
      // Check if already present
      const regex = new RegExp(
        `(id:\\s*"${milestoneId}"[\\s\\S]*?recommendedProductIds:\\s*\\[)([^\\]]*)(\\])`
      );
      const match = content.match(regex);
      if (match && !match[2].includes(`"${productId}"`)) {
        // Add to end of array (before closing bracket)
        const existing = match[2].trimEnd();
        const separator = existing.endsWith(",") || existing === "" ? "" : ",";
        content = content.replace(
          regex,
          `$1${existing}${separator}\n      "${productId}",$3`
        );
      }
    }
  }

  fs.writeFileSync(PILOT_LEVELS_PATH, content, "utf-8");
}

// ── Claude AI Product Discovery ──────────────────────────────────────────────

async function discoverNewProducts(
  currentItems: EquipmentItem[],
  categories: string[]
): Promise<EquipmentItem[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.log("⚠ ANTHROPIC_API_KEY not set — skipping product discovery");
    return [];
  }

  const currentList = currentItems
    .map((i) => `- ${i.name} (${i.category}, ${i.vendor}, id: ${i.id})`)
    .join("\n");

  const prompt = `You are helping maintain a pilot equipment recommendation list for a flight training website.

Here are the current products:
${currentList}

Categories: ${categories.join(", ")}

Suggest 5-10 NEW pilot equipment products that are NOT already in the list above. Focus on:
1. Popular products on Amazon and Sporty's for student/private pilots
2. Items that fill gaps in the current list
3. Well-reviewed, current products (not discontinued)

For each product, provide a JSON object with these fields:
- id: kebab-case unique identifier
- category: one of the existing categories
- name: product name
- description: 1-2 sentence description for pilots
- vendor: "amazon" or "sportys"
- asin: Amazon ASIN (10-char alphanumeric) if vendor is amazon
- sportysUrl: full Sporty's product URL if vendor is sportys
- searchQuery: Amazon/Google search query for fallback

Return ONLY a JSON array of product objects, no other text.`;

  const body = JSON.stringify({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2000,
    messages: [{ role: "user", content: prompt }],
  });

  return new Promise((resolve) => {
    const req = https.request(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const response = JSON.parse(data);
            const text = response.content?.[0]?.text || "";
            // Extract JSON array from response
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
              const products: EquipmentItem[] = JSON.parse(jsonMatch[0]);
              console.log(`✓ Claude suggested ${products.length} new products`);
              resolve(products);
            } else {
              console.log("⚠ Could not parse Claude response as JSON array");
              resolve([]);
            }
          } catch (err) {
            console.log("⚠ Error parsing Claude response:", err);
            resolve([]);
          }
        });
      }
    );
    req.on("error", (err) => {
      console.log("⚠ Claude API request failed:", err.message);
      resolve([]);
    });
    req.write(body);
    req.end();
  });
}

// ── Email Report ─────────────────────────────────────────────────────────────

async function sendReport(report: SyncReport): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("⚠ RESEND_API_KEY not set — skipping email report");
    return;
  }

  const subject = report.errors.length > 0
    ? "Equipment sync completed with errors"
    : "Equipment sync completed";

  const body = [
    `<h3>Equipment Sync Report</h3>`,
    `<p><strong>Removed:</strong> ${report.removed.length} items</p>`,
    report.removed.length > 0
      ? `<ul>${report.removed.map((r) => `<li>${r}</li>`).join("")}</ul>`
      : "",
    `<p><strong>Updated:</strong> ${report.updated.length} items</p>`,
    report.updated.length > 0
      ? `<ul>${report.updated.map((u) => `<li>${u}</li>`).join("")}</ul>`
      : "",
    `<p><strong>Added:</strong> ${report.added.length} items</p>`,
    report.added.length > 0
      ? `<ul>${report.added.map((a) => `<li>${a}</li>`).join("")}</ul>`
      : "",
    `<p><strong>Unchanged:</strong> ${report.unchanged} items</p>`,
    report.errors.length > 0
      ? `<p style="color:red"><strong>Errors:</strong></p><ul>${report.errors.map((e) => `<li>${e}</li>`).join("")}</ul>`
      : "",
  ].join("\n");

  const emailBody = JSON.stringify({
    from: "noreply@iwanttobeapilot.online",
    to: "jjjjj_enterprises_llc@protonmail.com",
    subject: `[I Want To Be A Pilot] ${subject}`,
    html: `<div style="font-family:sans-serif;font-size:14px;max-width:700px;margin:auto">${body}</div>`,
  });

  return new Promise((resolve) => {
    const req = https.request(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      },
      (res) => {
        res.on("data", () => {});
        res.on("end", () => resolve());
      }
    );
    req.on("error", () => resolve());
    req.write(emailBody);
    req.end();
  });
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🔄 Equipment sync starting...\n");

  const report: SyncReport = {
    removed: [],
    updated: [],
    added: [],
    errors: [],
    unchanged: 0,
  };

  // 1. Parse current equipment
  let items: EquipmentItem[];
  try {
    items = parseEquipmentFile();
    console.log(`📦 Loaded ${items.length} equipment items\n`);
  } catch (err) {
    console.error("✗ Failed to parse equipment.ts:", err);
    process.exit(1);
  }

  // 2. Validate existing URLs
  console.log("🔗 Validating existing product URLs...");
  const validItems: EquipmentItem[] = [];

  for (const item of items) {
    const url = getItemUrl(item);
    if (!url) {
      validItems.push(item);
      report.unchanged++;
      continue;
    }

    const status = await checkUrl(url);

    if (status === "ok") {
      validItems.push(item);
      report.unchanged++;
    } else if (status === "redirect") {
      // Keep item but note the redirect
      validItems.push(item);
      report.updated.push(`${item.name}: URL redirected (kept)`);
      console.log(`  ↪ ${item.name}: redirect (kept)`);
    } else {
      // Dead URL — check if searchQuery fallback works
      if (item.searchQuery) {
        console.log(`  ✗ ${item.name}: primary URL dead, keeping with search fallback`);
        validItems.push(item);
        report.updated.push(`${item.name}: primary URL dead, search fallback active`);
      } else {
        console.log(`  ✗ ${item.name}: REMOVED (404, no fallback)`);
        report.removed.push(item.name);
      }
    }
  }

  console.log(
    `\n✓ Validation: ${report.unchanged} ok, ${report.updated.length} updated, ${report.removed.length} removed\n`
  );

  // 3. Discover new products via Claude AI
  console.log("🤖 Discovering new products via Claude AI...");
  const categories = [...new Set(items.map((i) => i.category))];
  const suggestions = await discoverNewProducts(validItems, categories);

  // 4. Validate suggested product URLs
  const newItems: EquipmentItem[] = [];
  const newProductCategories: Record<string, string> = {};

  for (const suggestion of suggestions) {
    // Skip if ID already exists
    if (validItems.some((i) => i.id === suggestion.id)) {
      console.log(`  ⊘ ${suggestion.name}: ID already exists, skipping`);
      continue;
    }

    // Validate the suggested URL
    const url = getItemUrl(suggestion);
    if (url) {
      const status = await checkUrl(url);
      if (status === "dead" && !suggestion.searchQuery) {
        console.log(`  ✗ ${suggestion.name}: suggested URL dead, skipping`);
        report.errors.push(`AI suggestion "${suggestion.name}" had dead URL`);
        continue;
      }
    }

    // Validate category
    if (!categories.includes(suggestion.category)) {
      console.log(`  ✗ ${suggestion.name}: invalid category "${suggestion.category}", skipping`);
      continue;
    }

    newItems.push(suggestion);
    newProductCategories[suggestion.id] = suggestion.category;
    report.added.push(suggestion.name);
    console.log(`  ✓ ${suggestion.name}: added`);
  }

  console.log(`\n✓ Added ${newItems.length} new products\n`);

  // 5. Combine and write updated equipment file
  const allItems = [...validItems, ...newItems];

  if (report.removed.length > 0 || report.added.length > 0) {
    writeEquipmentFile(allItems);
    console.log("✓ Updated equipment.ts");

    // 6. Add new products to relevant milestones in pilot-levels.ts
    if (newItems.length > 0) {
      addProductToMilestones(
        newItems.map((i) => i.id),
        newProductCategories
      );
      console.log("✓ Updated pilot-levels.ts with new product references");
    }
  } else {
    console.log("✓ No changes needed to equipment files");
  }

  // 7. Send email report
  const hasChanges =
    report.removed.length > 0 ||
    report.added.length > 0 ||
    report.updated.length > 0;

  if (hasChanges || report.errors.length > 0) {
    await sendReport(report);
    console.log("✓ Email report sent");
  }

  // 8. Print summary
  console.log("\n── Summary ──────────────────────────────────────────────");
  console.log(`  Removed:   ${report.removed.length}`);
  console.log(`  Updated:   ${report.updated.length}`);
  console.log(`  Added:     ${report.added.length}`);
  console.log(`  Unchanged: ${report.unchanged}`);
  console.log(`  Errors:    ${report.errors.length}`);
  console.log("────────────────────────────────────────────────────────\n");

  if (hasChanges) {
    console.log("📝 Files modified — commit and push needed.");
    // Exit with code 0 — the workflow will detect changes via git diff
  } else {
    console.log("✓ No changes to commit.");
  }
}

main().catch((err) => {
  console.error("✗ Fatal error:", err);
  process.exit(1);
});
