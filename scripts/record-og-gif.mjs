#!/usr/bin/env node
// Records public/og-image.gif by driving the home page in preview mode
// with Playwright and converting the result to a looping GIF via ffmpeg.
//
// Prereqs:
//   - MOCK_DATA=true npm run dev   (running on http://localhost:3000)
//   - playwright + chromium installed (npx playwright install chromium)
//   - ffmpeg on PATH
//
// Usage:
//   node scripts/record-og-gif.mjs

import { execSync } from 'node:child_process';
import { mkdtempSync, readdirSync, renameSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { chromium } from 'playwright';

const URL = process.env.PREVIEW_URL ?? 'http://localhost:3000/?preview=1';
const VIEWPORT = { width: 1200, height: 1200 };
// Empirically: fully-settled BREAK arrives around t=7.65s.
// One BREAK<->GUESS cycle ends at the second BREAK settle around t=17.5s.
// Capture a full cycle so frame 0 and the loop wrap both land on the
// settled "BREAK THE CODE" hero shot.
const TRIM_START_S = 7.65;
const TRIM_DUR_S = 9.9;
// Tell Playwright to keep recording until both the trim window and a small
// buffer have elapsed.
const PAGELOAD_BUFFER_MS = 500;
const RECORD_MS = Math.round(
  (TRIM_START_S + TRIM_DUR_S) * 1000 + PAGELOAD_BUFFER_MS,
);
const OUT = 'public/og-image.gif';

const videoDir = mkdtempSync(join(tmpdir(), 'og-record-'));

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: VIEWPORT,
  deviceScaleFactor: 1,
  recordVideo: { dir: videoDir, size: VIEWPORT },
});
const page = await ctx.newPage();
console.log(`Loading ${URL}`);
await page.goto(URL, { waitUntil: 'networkidle' });
console.log(`Recording for ${RECORD_MS}ms`);
await page.waitForTimeout(RECORD_MS);
await ctx.close();
await browser.close();

const [webm] = readdirSync(videoDir).filter((f) => f.endsWith('.webm'));
if (!webm) throw new Error('Playwright produced no video file');
const webmPath = join(videoDir, webm);
console.log(`Captured ${webmPath}`);

// Build a high-quality looping GIF from the recording.
// - palettegen/paletteuse keeps colours sharp and reduces banding
// - Trim starts at the moment "BREAK THE CODE" is fully settled so frame 0
//   of the GIF (used by crawlers as the static preview) is the hero shot.
const cmd =
  `ffmpeg -y -hide_banner -loglevel error -i "${webmPath}" ` +
  `-ss ${TRIM_START_S.toFixed(2)} -t ${TRIM_DUR_S.toFixed(2)} ` +
  `-vf "fps=15,scale=1200:1200:flags=lanczos,split[s0][s1];` +
  `[s0]palettegen=stats_mode=full[p];[s1][p]paletteuse=dither=bayer:bayer_scale=5" ` +
  `-loop 0 "${OUT}"`;
console.log(cmd);
execSync(cmd, { stdio: 'inherit' });

const size = execSync(`stat -c %s ${OUT}`).toString().trim();
console.log(`Wrote ${OUT} (${size} bytes)`);
rmSync(videoDir, { recursive: true, force: true });
