# Perfect Roofting deployment guide

Date: 2026-09-23

## Environments

| Environment | Source | Destination | Purpose |
| --- | --- | --- | --- |
| Local | Feature branch or `revamp-foundation` | Developer machine | Implementation and local QA |
| Preview/staging | `revamp-foundation` after verification | `perfect-roofting.easondev.workers.dev` | Cloudflare and stakeholder verification |
| Production | `main` after explicit approval | **TBC — production Worker/domain required** | Approved public release only |

No production domain is connected. Do not use the current preview/staging Worker as the final production release target.

## Local commands

Install exactly from the lockfile:

```bash
npm ci
```

Run Astro locally:

```bash
npm run dev
```

Create the static build:

```bash
npm run build
```

Preview the generated site with Astro:

```bash
npm run preview
```

Preview Workers Static Assets locally:

```bash
npm run preview:cloudflare
```

## Preview/staging deployment

`wrangler.jsonc` is the source of truth. It selects the authenticated Cloudflare account, names the Worker `perfect-roofting`, and publishes `dist/` using Workers Static Assets.

From a clean `revamp-foundation` branch:

```bash
npm ci
npm run build
npm run deploy
```

`npm run deploy` rebuilds before invoking Wrangler. After deployment, verify the home, about, contact, service index, service-detail, static asset, navigation, and 404 paths. Do not submit real personal information during QA.

## Production strategy

Production configuration is intentionally absent. Before the first production release:

1. Confirm the final production domain and verified business information.
2. Confirm a production Worker/environment isolated from `perfect-roofting` preview/staging.
3. Add production-only Wrangler configuration and secrets without reusing staging secrets.
4. Verify the exact commit on preview/staging.
5. Merge the approved pull request to `main`.
6. Deploy that exact `main` commit to production.
7. Attach the custom domain and change DNS only under a separate approved change.

## Git workflow

```text
feature branch
↓
pull request into `revamp-foundation`
↓
preview/staging deployment
↓
technical, visual, content, and stakeholder verification
↓
pull request into `main`
↓
production deployment
```

Do not merge branches automatically. `main` preserves the accepted baseline/release history; ongoing foundation work belongs on `revamp-foundation` or a short-lived feature branch.

## Doppler usage

Doppler authentication is available, and the currently reachable runtime config is development-like. This folder does not yet have a directory-scoped Doppler project/config selection, so deployments must not assume that the implicit shared scope belongs to Perfect Roofting.

Before secret-dependent work, confirm and scope a dedicated project/config for local development and preview/staging. Use `doppler run -- <command>` so values remain in the process environment. Never print, commit, or place private values in `wrangler.jsonc`, `.env`, client JavaScript, build logs, or documentation. Production must use a separately approved configuration.

## Rollback

For a bad preview/staging deployment:

1. Stop further deployment work and identify the last healthy Worker version with `npx wrangler deployments list --name perfect-roofting`.
2. Use `npx wrangler rollback <version-id>` for an immediate Cloudflare rollback when appropriate.
3. Revert the offending Git commit on its working branch, rebuild, and redeploy so source control again matches the live Worker.
4. Re-run route, asset, browser-console, and 404 checks.

For production, use the same version rollback pattern against the future isolated production Worker, then restore Git history through a reviewed revert. Never repair production by making uncommitted dashboard-only changes.

