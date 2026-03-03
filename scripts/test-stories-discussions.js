/**
 * Integration test: Stories & Discussions features
 * - Creates 3 test users directly in DB (bypasses email flow)
 * - Signs in via NextAuth credentials to get session cookies
 * - Exercises all stories + discussions API endpoints
 * - Generates a test report
 * - Removes all test data on completion
 */

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const db = new PrismaClient();
const BASE = "http://localhost:3000";
const NEXTAUTH_COOKIE = "authjs.session-token";

// ─── Test users ──────────────────────────────────────────────────────────────
const USERS = [
  { email: "test_iwbap_alpha@test.invalid", password: "TestPass!1", name: "IWBAP Test Alpha", tier: "pro" },
  { email: "test_iwbap_beta@test.invalid",  password: "TestPass!2", name: "IWBAP Test Beta",  tier: "pro" },
  { email: "test_iwbap_gamma@test.invalid", password: "TestPass!3", name: "IWBAP Test Gamma", tier: "free" },
];

// ─── State ────────────────────────────────────────────────────────────────────
const state = {
  users: {},      // email → { id, cookie }
  storyIds: [],
  postIds: [],
  replyIds: [],
};

// ─── Reporting ────────────────────────────────────────────────────────────────
const results = [];
function pass(name, detail = "") { results.push({ status: "PASS", name, detail }); console.log(`  ✓ ${name}${detail ? " — " + detail : ""}`); }
function fail(name, detail = "") { results.push({ status: "FAIL", name, detail }); console.log(`  ✗ ${name}${detail ? " — " + detail : ""}`); }
function info(msg)               { console.log(`\n${msg}`); }

// ─── HTTP helpers ─────────────────────────────────────────────────────────────
async function req(method, path, { body, cookie, form } = {}) {
  const headers = {};
  let bodyStr;
  if (form) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    bodyStr = new URLSearchParams(form).toString();
  } else if (body) {
    headers["Content-Type"] = "application/json";
    bodyStr = JSON.stringify(body);
  }
  if (cookie) headers["Cookie"] = cookie;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: bodyStr,
    redirect: "manual",
  });

  let data = null;
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    try { data = await res.json(); } catch {}
  }
  // Collect Set-Cookie
  const setCookie = res.headers.getSetCookie?.() ?? [];
  return { status: res.status, data, headers: res.headers, setCookie };
}

// ─── Auth: sign in, return session cookie string ──────────────────────────────
async function signIn(email, password) {
  // Step 1: get CSRF token + its cookie
  const csrfRaw = await fetch(`${BASE}/api/auth/csrf`);
  const { csrfToken } = await csrfRaw.json();
  if (!csrfToken) throw new Error("No CSRF token");
  const csrfCookieHdr = (csrfRaw.headers.getSetCookie?.() ?? []).map(c => c.split(";")[0]).join("; ");

  // Step 2: POST credentials with CSRF cookie attached
  const loginRes = await fetch(`${BASE}/api/auth/callback/credentials?`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": csrfCookieHdr,
    },
    body: new URLSearchParams({ csrfToken, email, password, redirect: "false", callbackUrl: BASE + "/" }).toString(),
    redirect: "manual",
  });

  const cookies = loginRes.headers.getSetCookie?.() ?? [];
  const sessionCookie = cookies.find(c => c.includes(NEXTAUTH_COOKIE));
  if (!sessionCookie) {
    const loc = loginRes.headers.get("location") ?? "";
    throw new Error(`No session cookie for ${email}. Status: ${loginRes.status}, Location: ${loc}`);
  }
  return sessionCookie.split(";")[0]; // name=value only
}

// ─── Setup ────────────────────────────────────────────────────────────────────
async function setup() {
  info("── SETUP: Creating test users ──");
  for (const u of USERS) {
    // Remove if exists
    await db.user.deleteMany({ where: { email: u.email } });
    const hash = await bcrypt.hash(u.password, 10);
    const user = await db.user.create({
      data: {
        email: u.email,
        name: u.name,
        hashedPassword: hash,
        emailVerified: new Date(),
        tier: u.tier,
        role: "user",
        status: "active",
        sessionVersion: 0,
      },
    });
    const cookie = await signIn(u.email, u.password);
    state.users[u.email] = { id: user.id, cookie };
    console.log(`  Created & signed in: ${u.name} (${u.tier}) [id: ${user.id.slice(0, 8)}...]`);
  }
}

// ─── Get discussion categories ─────────────────────────────────────────────────
async function getCategories() {
  const r = await req("GET", "/api/discussions/categories");
  if (r.status === 200 && r.data?.categories?.length > 0) return r.data.categories;
  throw new Error("No discussion categories found — run db:seed first");
}

// ─────────────────────────────────────────────────────────────────────────────
// TEST SUITES
// ─────────────────────────────────────────────────────────────────────────────

// ── Stories ───────────────────────────────────────────────────────────────────
async function testStories(categories) {
  info("── STORIES ──");
  const alpha = state.users[USERS[0].email];
  const beta  = state.users[USERS[1].email];
  const gamma = state.users[USERS[2].email]; // free tier

  // 1. Create story as pro user (alpha)
  let story1;
  {
    const r = await req("POST", "/api/stories", {
      cookie: alpha.cookie,
      body: {
        title: "[TEST] Alpha's Journey to Private Pilot",
        body: "This is a detailed test story about my journey to getting my private pilot certificate. I trained at a local flight school for about 6 months.",
        pilotLevels: ["private"],
        totalMonths: 6,
        totalCost: 12000,
        salaryRange: null,
      },
    });
    if (r.status === 201 && r.data?.story?.id) {
      story1 = r.data.story;
      state.storyIds.push(story1.id);
      pass("Create story as pro user", `id: ${story1.id.slice(0, 8)}`);
    } else {
      fail("Create story as pro user", `status: ${r.status} — ${JSON.stringify(r.data)}`);
    }
  }

  // 2. Create second story as beta (pro)
  let story2;
  {
    const r = await req("POST", "/api/stories", {
      cookie: beta.cookie,
      body: {
        title: "[TEST] Beta's Commercial Pilot Path",
        body: "My experience going from zero to commercial pilot. It took longer than expected but was worth every hour in the cockpit.",
        pilotLevels: ["commercial"],
        totalMonths: 24,
        totalCost: 85000,
        salaryRange: "$40,000 – $60,000",
      },
    });
    if (r.status === 201 && r.data?.story?.id) {
      story2 = r.data.story;
      state.storyIds.push(story2.id);
      pass("Create second story as different pro user", `id: ${story2.id.slice(0, 8)}`);
    } else {
      fail("Create second story as different pro user", `status: ${r.status}`);
    }
  }

  // 3. Reject story creation from free-tier user
  {
    const r = await req("POST", "/api/stories", {
      cookie: gamma.cookie,
      body: {
        title: "[TEST] Should be blocked",
        body: "This should not be saved.",
        pilotLevels: ["private"],
      },
    });
    if (r.status === 403) {
      pass("Block story creation for free-tier user", "403 as expected");
    } else {
      fail("Block story creation for free-tier user", `got ${r.status} instead of 403`);
    }
  }

  // 4. Reject story creation without auth
  {
    const r = await req("POST", "/api/stories", {
      body: { title: "[TEST] No auth", body: "test", pilotLevels: ["private"] },
    });
    if (r.status === 401) {
      pass("Block story creation without auth", "401 as expected");
    } else {
      fail("Block story creation without auth", `got ${r.status}`);
    }
  }

  // 5. Validation: missing required fields
  {
    const r = await req("POST", "/api/stories", {
      cookie: alpha.cookie,
      body: { title: "[TEST] No body or levels" },
    });
    if (r.status === 400) {
      pass("Validation: reject story with missing body/pilotLevels", "400 as expected");
    } else {
      fail("Validation: reject story with missing body/pilotLevels", `got ${r.status}`);
    }
  }

  // 6. List stories (public)
  {
    const r = await req("GET", "/api/stories?limit=50");
    const ids = r.data?.stories?.map(s => s.id) ?? [];
    const hasAlpha = story1 && ids.includes(story1.id);
    const hasBeta  = story2 && ids.includes(story2.id);
    if (r.status === 200 && hasAlpha && hasBeta) {
      pass("List stories (public)", `found both test stories among ${ids.length} total`);
    } else {
      fail("List stories (public)", `status: ${r.status}, hasAlpha: ${hasAlpha}, hasBeta: ${hasBeta}`);
    }
  }

  // 7. Get single story by ID
  if (story1) {
    const r = await req("GET", `/api/stories/${story1.id}`);
    if (r.status === 200 && r.data?.story?.id === story1.id) {
      pass("Get single story by ID", `title: "${r.data.story.title.slice(0, 40)}..."`);
    } else {
      fail("Get single story by ID", `status: ${r.status}`);
    }
  }

  // 8. Get non-existent story returns 404
  {
    const r = await req("GET", "/api/stories/nonexistent_id_12345");
    if (r.status === 404) {
      pass("Non-existent story returns 404");
    } else {
      fail("Non-existent story returns 404", `got ${r.status}`);
    }
  }

  // 9. Beta cannot delete alpha's story
  if (story1) {
    const r = await req("DELETE", `/api/stories/${story1.id}`, { cookie: beta.cookie });
    if (r.status === 403) {
      pass("Cannot delete another user's story", "403 as expected");
    } else {
      fail("Cannot delete another user's story", `got ${r.status}`);
    }
  }

  // 10. Author can delete own story
  if (story2) {
    const r = await req("DELETE", `/api/stories/${story2.id}`, { cookie: beta.cookie });
    if (r.status === 200 && r.data?.success) {
      state.storyIds = state.storyIds.filter(id => id !== story2.id);
      pass("Author can delete own story");
    } else {
      fail("Author can delete own story", `status: ${r.status}`);
    }
  }

  // 11. Verify story 2 gone
  if (story2) {
    const r = await req("GET", `/api/stories/${story2.id}`);
    if (r.status === 404) {
      pass("Deleted story returns 404");
    } else {
      fail("Deleted story returns 404", `got ${r.status}`);
    }
  }
}

// ── Discussions ───────────────────────────────────────────────────────────────
async function testDiscussions(categories) {
  info("── DISCUSSIONS ──");
  const alpha = state.users[USERS[0].email];
  const beta  = state.users[USERS[1].email];
  const gamma = state.users[USERS[2].email];

  const cat1 = categories[0];
  const cat2 = categories[1] ?? categories[0];

  // 1. List categories (public)
  {
    const r = await req("GET", "/api/discussions/categories");
    if (r.status === 200 && r.data?.categories?.length > 0) {
      pass("List discussion categories (public)", `${r.data.categories.length} categories`);
    } else {
      fail("List discussion categories (public)", `status: ${r.status}`);
    }
  }

  // 2. Create post as pro user
  let post1;
  {
    const r = await req("POST", "/api/discussions", {
      cookie: alpha.cookie,
      body: {
        categoryId: cat1.id,
        title: "[TEST] Best flight schools in Texas?",
        body: "Looking for recommendations on flight schools around the DFW area. I have about $15k to spend and want to get my PPL. Any experience with schools in the area?",
      },
    });
    if (r.status === 201 && r.data?.post?.id) {
      post1 = r.data.post;
      state.postIds.push(post1.id);
      pass("Create discussion post as pro user", `id: ${post1.id.slice(0, 8)}`);
    } else {
      fail("Create discussion post as pro user", `status: ${r.status} — ${JSON.stringify(r.data)}`);
    }
  }

  // 3. Create second post (beta, different category)
  let post2;
  {
    const r = await req("POST", "/api/discussions", {
      cookie: beta.cookie,
      body: {
        categoryId: cat2.id,
        title: "[TEST] Instrument rating — worth it before commercial?",
        body: "I'm about to get my PPL and wondering whether to pursue instrument rating immediately or go straight for the commercial certificate. What do you think?",
      },
    });
    if (r.status === 201 && r.data?.post?.id) {
      post2 = r.data.post;
      state.postIds.push(post2.id);
      pass("Create second discussion post (different user)", `id: ${post2.id.slice(0, 8)}`);
    } else {
      fail("Create second discussion post (different user)", `status: ${r.status}`);
    }
  }

  // 4. Block post creation for free tier
  {
    const r = await req("POST", "/api/discussions", {
      cookie: gamma.cookie,
      body: { categoryId: cat1.id, title: "[TEST] Should be blocked", body: "nope" },
    });
    if (r.status === 403) {
      pass("Block discussion post for free-tier user", "403 as expected");
    } else {
      fail("Block discussion post for free-tier user", `got ${r.status}`);
    }
  }

  // 5. Block post creation without auth
  {
    const r = await req("POST", "/api/discussions", {
      body: { categoryId: cat1.id, title: "[TEST] No auth", body: "test" },
    });
    if (r.status === 401) {
      pass("Block discussion post without auth", "401 as expected");
    } else {
      fail("Block discussion post without auth", `got ${r.status}`);
    }
  }

  // 6. Validation: missing fields
  {
    const r = await req("POST", "/api/discussions", {
      cookie: alpha.cookie,
      body: { categoryId: cat1.id, title: "[TEST] No body" },
    });
    if (r.status === 400) {
      pass("Validation: reject post with missing body", "400 as expected");
    } else {
      fail("Validation: reject post with missing body", `got ${r.status}`);
    }
  }

  // 7. List posts (public)
  {
    const r = await req("GET", "/api/discussions?limit=50");
    const ids = r.data?.posts?.map(p => p.id) ?? [];
    const has1 = post1 && ids.includes(post1.id);
    const has2 = post2 && ids.includes(post2.id);
    if (r.status === 200 && has1 && has2) {
      pass("List all discussion posts (public)", `found both test posts among ${ids.length} total`);
    } else {
      fail("List all discussion posts (public)", `status: ${r.status}, has1: ${has1}, has2: ${has2}`);
    }
  }

  // 8. List posts filtered by category
  if (post1) {
    const r = await req("GET", `/api/discussions?categoryId=${cat1.id}&limit=50`);
    const ids = r.data?.posts?.map(p => p.id) ?? [];
    if (r.status === 200 && ids.includes(post1.id)) {
      pass("Filter discussion posts by category");
    } else {
      fail("Filter discussion posts by category", `status: ${r.status}, found: ${ids.includes(post1.id)}`);
    }
  }

  // 9. View post (GET single — increments viewCount)
  let viewCountBefore, viewCountAfter;
  if (post1) {
    const r1 = await req("GET", `/api/discussions/${post1.id}`);
    viewCountBefore = r1.data?.post?.viewCount;
    const r2 = await req("GET", `/api/discussions/${post1.id}`);
    viewCountAfter = r2.data?.post?.viewCount;
    if (r1.status === 200 && typeof viewCountBefore === "number") {
      pass("Get single discussion post returns full data");
    } else {
      fail("Get single discussion post returns full data", `status: ${r1.status}`);
    }
    if (viewCountAfter > viewCountBefore) {
      pass("View count increments on each GET", `${viewCountBefore} → ${viewCountAfter}`);
    } else {
      fail("View count increments on each GET", `before: ${viewCountBefore}, after: ${viewCountAfter}`);
    }
  }

  // 10. Add reply from beta on post1
  let reply1;
  if (post1) {
    const r = await req("POST", `/api/discussions/${post1.id}/replies`, {
      cookie: beta.cookie,
      body: { body: "[TEST] I trained at ATP Flight School in Addison — highly recommend. Accelerated program, great instructors." },
    });
    if (r.status === 201 && r.data?.reply?.id) {
      reply1 = r.data.reply;
      state.replyIds.push({ replyId: reply1.id, postId: post1.id });
      pass("Add reply to post", `id: ${reply1.id.slice(0, 8)}`);
    } else {
      fail("Add reply to post", `status: ${r.status} — ${JSON.stringify(r.data)}`);
    }
  }

  // 11. Add second reply from alpha (same post)
  let reply2;
  if (post1) {
    const r = await req("POST", `/api/discussions/${post1.id}/replies`, {
      cookie: alpha.cookie,
      body: { body: "[TEST] Thanks for the ATP recommendation! Did you find the accelerated pace manageable as a complete beginner?" },
    });
    if (r.status === 201 && r.data?.reply?.id) {
      reply2 = r.data.reply;
      state.replyIds.push({ replyId: reply2.id, postId: post1.id });
      pass("Add second reply from different user (same post)");
    } else {
      fail("Add second reply from different user (same post)", `status: ${r.status}`);
    }
  }

  // 12. Block reply from free-tier user
  if (post1) {
    const r = await req("POST", `/api/discussions/${post1.id}/replies`, {
      cookie: gamma.cookie,
      body: { body: "[TEST] Should be blocked" },
    });
    if (r.status === 403) {
      pass("Block reply for free-tier user", "403 as expected");
    } else {
      fail("Block reply for free-tier user", `got ${r.status}`);
    }
  }

  // 13. Replies appear in post GET
  if (post1 && reply1 && reply2) {
    const r = await req("GET", `/api/discussions/${post1.id}`);
    const replyIds = r.data?.post?.replies?.map(rep => rep.id) ?? [];
    if (replyIds.includes(reply1.id) && replyIds.includes(reply2.id)) {
      pass("Replies appear in post detail response", `${replyIds.length} replies total`);
    } else {
      fail("Replies appear in post detail response", `got ids: ${replyIds.join(", ")}`);
    }
  }

  // 14. Reply author can delete their own reply
  if (reply1) {
    const r = await req("DELETE", `/api/discussions/${post1.id}/replies`, {
      cookie: beta.cookie,
      body: { replyId: reply1.id },
    });
    if (r.status === 200 && r.data?.success) {
      state.replyIds = state.replyIds.filter(x => x.replyId !== reply1.id);
      pass("Reply author can delete own reply");
    } else {
      fail("Reply author can delete own reply", `status: ${r.status}`);
    }
  }

  // 15. Cannot delete another user's reply
  if (reply2) {
    const r = await req("DELETE", `/api/discussions/${post1.id}/replies`, {
      cookie: beta.cookie,
      body: { replyId: reply2.id },
    });
    if (r.status === 403) {
      pass("Cannot delete another user's reply", "403 as expected");
    } else {
      fail("Cannot delete another user's reply", `got ${r.status}`);
    }
  }

  // 16. Non-existent post returns 404
  {
    const r = await req("GET", "/api/discussions/nonexistent_post_12345");
    if (r.status === 404) {
      pass("Non-existent post returns 404");
    } else {
      fail("Non-existent post returns 404", `got ${r.status}`);
    }
  }
}

// ─── Cleanup ──────────────────────────────────────────────────────────────────
async function cleanup() {
  info("── CLEANUP ──");

  // Delete remaining stories
  for (const id of state.storyIds) {
    await db.story.deleteMany({ where: { id } });
  }
  if (state.storyIds.length) console.log(`  Deleted ${state.storyIds.length} test stories`);

  // Delete remaining replies (posts cascade handles them but be explicit)
  for (const { replyId } of state.replyIds) {
    await db.discussionReply.deleteMany({ where: { id: replyId } });
  }

  // Delete posts (cascades replies)
  for (const id of state.postIds) {
    await db.discussionPost.deleteMany({ where: { id } });
  }
  if (state.postIds.length) console.log(`  Deleted ${state.postIds.length} test posts`);

  // Delete test users (cascades all their content)
  const emails = USERS.map(u => u.email);
  const del = await db.user.deleteMany({ where: { email: { in: emails } } });
  console.log(`  Deleted ${del.count} test users`);

  // Sanity check
  const remaining = await db.user.findMany({ where: { email: { in: emails } } });
  if (remaining.length === 0) {
    console.log("  ✓ All test users removed from DB");
  } else {
    console.log(`  ✗ WARNING: ${remaining.length} test users still in DB`);
  }
}

// ─── Report ───────────────────────────────────────────────────────────────────
function printReport() {
  const passed = results.filter(r => r.status === "PASS").length;
  const failed = results.filter(r => r.status === "FAIL").length;
  const total  = results.length;

  console.log("\n" + "═".repeat(60));
  console.log("  TEST REPORT — Stories & Discussions");
  console.log("  " + new Date().toISOString());
  console.log("═".repeat(60));
  console.log(`  Total: ${total}  |  Passed: ${passed}  |  Failed: ${failed}`);
  console.log("═".repeat(60));

  if (failed > 0) {
    console.log("\n  FAILED TESTS:");
    results.filter(r => r.status === "FAIL").forEach(r => {
      console.log(`    ✗ ${r.name}`);
      if (r.detail) console.log(`      ${r.detail}`);
    });
  }

  console.log("\n  ALL RESULTS:");
  results.forEach(r => {
    const icon = r.status === "PASS" ? "✓" : "✗";
    console.log(`    ${icon} ${r.name}`);
    if (r.status === "FAIL" && r.detail) console.log(`      → ${r.detail}`);
  });

  console.log("\n" + "═".repeat(60));
  console.log(failed === 0 ? "  ALL TESTS PASSED" : `  ${failed} TEST(S) FAILED`);
  console.log("═".repeat(60));
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("\niwanttobeapilot — Stories & Discussions Integration Test");
  console.log("Testing against: " + BASE);
  console.log("─".repeat(60));

  try {
    await setup();
    const categories = await getCategories();
    console.log(`  Found ${categories.length} discussion categories`);
    await testStories(categories);
    await testDiscussions(categories);
  } catch (err) {
    console.error("\nFATAL ERROR:", err.message);
    fail("Test suite aborted", err.message);
  } finally {
    await cleanup();
    await db.$disconnect();
    printReport();
    process.exit(results.some(r => r.status === "FAIL") ? 1 : 0);
  }
}

main();
