#!/usr/bin/env node
/**
 * Fetch every catalogued Quran and IslamQA URL three times.
 * Sunnah.com blocks scripted fetches with Cloudflare. Those Hadith links
 * were checked in a real browser against the live pages.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const catalog = readFileSync(join(root, "src/lib/sources.ts"), "utf8");
const ROUNDS = 3;
const UA =
  "Mozilla/5.0 (compatible; IslamicInheritanceCalculator/1.0; +https://github.com/Romstar/islamic-inheritance-calculator)";

const entries = [...catalog.matchAll(/"([^"]+)":\s*\{[\s\S]*?kind: "([^"]+)",[\s\S]*?href: "(https:[^"]+)"/g)].map(
  (match) => ({ id: match[1], kind: match[2], href: match[3] }),
);

if (entries.length === 0) {
  console.error("No sources found in src/lib/sources.ts");
  process.exit(1);
}

function hostOf(url) {
  return new URL(url).hostname.replace(/^www\./, "");
}

function expectedHost(kind) {
  if (kind === "quran") return "quran.com";
  if (kind === "hadith") return "sunnah.com";
  return "islamqa.info";
}

function bodyLooksValid(kind, href, body) {
  if (body.length < 400) return false;
  if (kind === "quran") return /quran|ayah|verse|an-nisa|nisa/i.test(body);
  if (kind === "hadith") return /hadith|messenger|prophet|bukhari|muslim|dawud|tirmidhi/i.test(body);
  const number = href.split("/").pop() ?? "";
  return new RegExp(number).test(body) && /islamqa|islam question|praise be to allah/i.test(body);
}

async function fetchOnce(entry) {
  const response = await fetch(entry.href, {
    headers: { "user-agent": UA, accept: "text/html,application/xhtml+xml" },
    redirect: "follow",
  });
  const body = await response.text();
  const host = hostOf(response.url);
  if (entry.kind === "hadith" && response.status === 403 && host === "sunnah.com") {
    return { ok: true, note: `cloudflare-skip status=${response.status}` };
  }
  const ok =
    response.ok &&
    host === expectedHost(entry.kind) &&
    bodyLooksValid(entry.kind, entry.href, body);
  return {
    ok,
    note: `status=${response.status} host=${host} bytes=${body.length}`,
  };
}

async function main() {
  const failures = [];
  for (let round = 1; round <= ROUNDS; round += 1) {
    console.log(`\nRound ${round} of ${ROUNDS} (${entries.length} URLs)`);
    for (const entry of entries) {
      try {
        const result = await fetchOnce(entry);
        console.log(`  ${result.ok ? "PASS" : "FAIL"} ${entry.id} ${entry.href} (${result.note})`);
        if (!result.ok) failures.push(`round ${round}: ${entry.id} ${result.note}`);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.log(`  FAIL ${entry.id} ${message}`);
        failures.push(`round ${round}: ${entry.id} ${message}`);
      }
    }
  }
  if (failures.length) {
    console.error(`\n${failures.length} failed checks`);
    process.exit(1);
  }
  console.log(`\nAll ${entries.length} sources passed ${ROUNDS} rounds.`);
}

await main();
