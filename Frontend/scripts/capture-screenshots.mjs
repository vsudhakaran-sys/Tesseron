// ─────────────────────────────────────────────────────────────────────────────
// TESSERON UI screenshot tool
//
// Drives headless Chromium (Playwright) against the running Vite dev server and
// writes landscape PNGs. Handles the localStorage auth gate, locale, and modal
// /detail interactions.
//
//   cd Frontend
//   node scripts/capture-screenshots.mjs                 # curated TARGETS set
//   node scripts/capture-screenshots.mjs /vehicles /drivers   # ad-hoc routes
//
// Config via env vars (all optional):
//   TESSERON_BASE   base URL (default: auto-detect 8081→8085, then 5173)
//   TESSERON_OUT    output dir (default: ./screenshots)
//   TESSERON_W      viewport width  (default: 1600)
//   TESSERON_H      viewport height (default: 900)
//   TESSERON_SCALE  device scale factor (default: 2)
//   TESSERON_LOCALE "en" | "nl" (default: en)
//   TESSERON_TOKEN  value written to localStorage.TESSERON_token (default: dev)
//   TESSERON_HEADED "1" to watch the run in a real window
// ─────────────────────────────────────────────────────────────────────────────
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const env = process.env;
const OUT = env.TESSERON_OUT || "./screenshots";
const VIEWPORT = { width: +(env.TESSERON_W || 1600), height: +(env.TESSERON_H || 900) };
const SCALE = +(env.TESSERON_SCALE || 2);
const LOCALE = env.TESSERON_LOCALE || "en";
const TOKEN = env.TESSERON_TOKEN || "dev";
const HEADED = env.TESSERON_HEADED === "1";

async function detectBase() {
  if (env.TESSERON_BASE) return env.TESSERON_BASE;
  for (const port of [8081, 8082, 8083, 8084, 8085, 5173]) {
    try {
      const r = await fetch(`http://localhost:${port}`, { signal: AbortSignal.timeout(800) });
      if (r.ok) return `http://localhost:${port}`;
    } catch { /* port not serving */ }
  }
  return "http://localhost:8081";
}

// ─── Interaction helpers (reused by TARGETS below) ───────────────────────────
const clickRow = (n = 1) => async (p) => {
  await p.locator(`table tbody tr:nth-child(${n})`).first().click();
  await p.waitForTimeout(700);
};
const openDialog = (button) => async (p) => {
  await p.getByRole("button", { name: button }).first().click();
  await p.getByRole("dialog").waitFor({ timeout: 10000 });
};
const clickButtonThenHeading = (button, heading) => async (p) => {
  await p.getByRole("button", { name: button }).first().click();
  await p.getByRole("heading", { name: heading }).first().waitFor({ timeout: 10000 });
};

// ─── Curated target set (the /settings admin area) ───────────────────────────
// Each target: { name, path, heading?, action? }
//   heading – a visible h1/h2/h3 to wait for (NOT plain text — that can match
//             hidden <option> labels in the mobile nav <select>).
//   action  – async (page) => {}  for clicks, modals, detail drill-ins.
const TARGETS = [
  { name: "01-users-list",        path: "/settings?section=users",         heading: "All users" },
  { name: "02-user-detail",       path: "/settings?section=users",         heading: "All users", action: clickRow(1) },
  { name: "03-invite-user-modal", path: "/settings?section=users",         heading: "All users", action: openDialog("Invite user") },
  { name: "04-roles-list",        path: "/settings?section=roles",         heading: "Roles & permissions" },
  { name: "05-role-matrix",       path: "/settings?section=roles",         heading: "Roles & permissions", action: clickRow(2) },
  { name: "06-create-role",       path: "/settings?section=roles",         heading: "Roles & permissions", action: clickButtonThenHeading("Create role", "Permissions matrix") },
  { name: "07-organizations",     path: "/settings?section=organizations", heading: "Organization tree" },
  { name: "08-add-suborg-modal",  path: "/settings?section=organizations", heading: "Organization tree", action: openDialog("New sub-organization") },
  { name: "09-audit-log",         path: "/settings?section=audit",         heading: "Administrative activity" },
  { name: "10-general",           path: "/settings?section=general",       heading: "General settings" },
  { name: "11-account",           path: "/settings?section=account" },
  { name: "12-leasing-scaffold",  path: "/settings?section=leasing",       heading: "Leasing" },
];

// Ad-hoc routes from CLI args → screenshot each, derive a name from the path.
function targetsFromArgs(args) {
  return args.map((raw, i) => {
    const path = raw.startsWith("/") ? raw : `/${raw}`;
    const slug = path.replace(/^\//, "").replace(/[^a-z0-9]+/gi, "-").replace(/-+$/g, "") || "root";
    return { name: `${String(i + 1).padStart(2, "0")}-${slug}` };
  }).map((t, i) => ({ ...t, path: args[i].startsWith("/") ? args[i] : `/${args[i]}` }));
}

// ─── Run ─────────────────────────────────────────────────────────────────────
const BASE = await detectBase();
const cliArgs = process.argv.slice(2);
const targets = cliArgs.length ? targetsFromArgs(cliArgs) : TARGETS;
mkdirSync(OUT, { recursive: true });

console.log(`base=${BASE}  viewport=${VIEWPORT.width}x${VIEWPORT.height}@${SCALE}x  locale=${LOCALE}  out=${OUT}`);

const errors = [];
const browser = await chromium.launch({ headless: !HEADED, args: ["--no-sandbox"] });
const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: SCALE });

// Seed auth + locale before any app script runs (AppLayout reads TESSERON_token).
await context.addInitScript(([token, locale]) => {
  localStorage.setItem("TESSERON_token", token);
  localStorage.setItem("TESSERON_user", JSON.stringify({ email: "anna.mueller@mueller.de", role: "ADMIN" }));
  localStorage.setItem("TESSERON_language", locale);
}, [TOKEN, LOCALE]);

const page = await context.newPage();
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push(String(e)));

for (const t of targets) {
  await page.goto(`${BASE}${t.path}`, { waitUntil: "domcontentloaded" });
  if (t.heading) {
    await page.getByRole("heading", { name: t.heading, exact: false }).first()
      .waitFor({ timeout: 20000 })
      .catch(() => console.warn(`  ! heading "${t.heading}" not found for ${t.name}`));
  } else {
    await page.locator("main").first().waitFor({ timeout: 20000 }).catch(() => {});
  }
  await page.waitForTimeout(800); // settle fade-in animations
  if (t.action) {
    await t.action(page);
    await page.waitForTimeout(500);
  }
  await page.screenshot({ path: `${OUT}/${t.name}.png` });
  console.log("captured", t.name);
}

await browser.close();
console.log("\nConsole errors:", errors.length ? errors : "none");


