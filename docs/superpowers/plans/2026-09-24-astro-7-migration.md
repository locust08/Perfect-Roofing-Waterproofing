# Astro 7 Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the static Perfect Roofting site from Astro 5.18.2 through Astro 6 to Astro 7.3.4, eliminating the remaining dependency audit findings without changing design, content, routes, or Cloudflare deployment architecture.

**Architecture:** Keep Astro's `output: "static"` build and continue publishing `dist/` through Cloudflare Workers Static Assets. Upgrade one Astro major at a time, require a successful 22-page build at the Astro 6 checkpoint, commit it, then repeat validation on Astro 7.

**Tech Stack:** Node.js 22.23.1, npm 10.9.8, Astro, Wrangler, Cloudflare Workers Static Assets.

**Spec:** User request in the current task.

## Global Constraints

- Start from the latest local `revamp-foundation` commit on branch `migration/astro-7`.
- Upgrade Astro 5.18.2 to Astro 6 first and commit the working checkpoint.
- Upgrade Astro 6 to Astro 7 only after the Astro 6 build succeeds.
- Do not change website design, content, routes, or Cloudflare setup.
- Preserve static Astro output and Workers Static Assets; do not add SSR or migrate frameworks.
- Final verification must run `npm ci`, `npm run build`, and `npm audit`.

## Review Focus

- Node must remain at or above Astro 6's documented minimum of 22.12.0; verify with `node --version` before both migration stages.
- All 22 existing static routes must still be generated; verify the route list and final build count after each major upgrade.
- Astro 7's Rust compiler must accept all existing templates without markup-driven route or visual changes; use the full build as the compiler gate.
- Astro 7's whitespace and Markdown defaults must not alter this site; confirm there are no Markdown sources/plugins and retain existing configuration unless a concrete failure requires a compatibility setting.
- Cloudflare architecture must remain static-assets-only; verify `astro.config.mjs` still uses `output: "static"` and `wrangler.jsonc` is unchanged.

---

### Task 1: Astro 6 checkpoint

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Verify unchanged: `astro.config.mjs`
- Verify unchanged: `wrangler.jsonc`

**Interfaces:**
- Consumes: Astro 5.18.2 static project and Node.js 22.23.1 runtime.
- Produces: Reproducible Astro 6 dependency tree that generates the same 22 routes.

- [ ] **Step 1: Install the latest Astro 6 release**

Run: `npm install astro@6`

Expected: `package.json` remains on Astro major 6 and npm updates only dependency metadata.

- [ ] **Step 2: Verify the Astro 6 version and architecture**

Run: `npm ls astro && node --version && git diff -- astro.config.mjs wrangler.jsonc`

Expected: Astro resolves to 6.x, Node is at least 22.12.0, and neither architecture file changed.

- [ ] **Step 3: Compile all routes**

Run: `npm run build`

Expected: exit code 0 and exactly 22 pages built. If the command fails, use the reported file and official Astro 6 migration guidance to make only the smallest compatibility fix, then rerun the complete build.

- [ ] **Step 4: Commit the working checkpoint**

Run: `git add package.json package-lock.json docs/superpowers/plans/2026-09-24-astro-7-migration.md && git commit -m "chore: migrate to Astro 6"`

Expected: a commit containing the reproducible Astro 6 state and this migration record.

### Task 2: Astro 7 migration and security verification

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify only on concrete compiler failure: the specific `.astro` template named by Astro 7
- Verify unchanged: `astro.config.mjs`
- Verify unchanged: `wrangler.jsonc`

**Interfaces:**
- Consumes: committed Astro 6 checkpoint from Task 1.
- Produces: Astro 7.3.4 static build with the same 22 routes and no npm audit findings.

- [ ] **Step 1: Install Astro 7**

Run: `npm install astro@7`

Expected: Astro resolves to the latest 7.x stable release and the lockfile records Vite 8/Rolldown-compatible dependencies.

- [ ] **Step 2: Run a migration build**

Run: `npm run build`

Expected: exit code 0 and exactly 22 pages built. On Rust compiler errors, repair only invalid/unclosed markup explicitly identified by the compiler and rerun the full build.

- [ ] **Step 3: Verify a clean install**

Run: `npm ci`

Expected: exit code 0 using the committed manifest and lockfile dependency graph.

- [ ] **Step 4: Run final build and audit gates**

Run: `npm run build` and then `npm audit`

Expected: build exit code 0 with 22 pages and audit exit code 0 with zero vulnerabilities.

- [ ] **Step 5: Verify scope and commit**

Run: `git diff --check && git diff --name-only && git diff -- astro.config.mjs wrangler.jsonc`

Expected: no whitespace errors, no UI/content/route changes, and unchanged static/Cloudflare configuration.

Run: `git add package.json package-lock.json && git commit -m "chore: migrate to Astro 7"`

Expected: final migration commit on `migration/astro-7`.
