# Agent handoff — Slice 7 (UI / UX)

**Status:** Not started. Read this **and** [slice-7.md](./slice-7.md) before changing anything. Plan: [PLAN.md](../../PLAN.md).

---

## Opener (human can paste)

> PrepPort **slice 7 — UI / UX**. Read `docs/slices/slice-7.md` and this handoff. Slice 6 is live at **https://prepport.duckdns.org**. Focus: React Router, page copy, number-input fix, portion-builder refresh. Structure before visual branding. Pairing: I type; you explain and review. Do not start slice 8 README except tiny deploy-required edits. Shell: `rtk`. Do not commit unless I ask.

---

## What the next agent must know

**Product:** Cronometer *companion*. Sunday: ingredients → prep sessions + batches (raw/cooked) → portion builder → copy-paste export (raw g).

**Stack:** React 18, TypeScript, Vite, Spring API on same host via Nginx. No new backend slice.

**Live demo:** https://prepport.duckdns.org · DuckDNS · Lightsail · `PREPPORT_CORS_ORIGINS=https://prepport.duckdns.org`

**Slice 6 complete:** Docker on server, HTTPS Certbot, frontend `scp` to `/var/www/prepport`.

---

## User feedback driving slice 7 (Aug 2026 dogfood)

| Issue | Planned fix |
|-------|-------------|
| Bare login/register | Auth header + PrepPort title; `/login` `/register` routes |
| Everything on one page | React Router + nav |
| Unclear workflow | Per-page description copy minimum; deeper flow redesign only if still awkward after router |
| Portion builder stale after new prep | Own route + refetch on mount / on navigate to `/portion` |
| Number inputs show `0100` | String state or empty-string display for zero |
| Ugly overall | Light CSS cleanup **after** router; no branding sprint yet |

---

## Repo state

| Piece | Reality |
|-------|---------|
| `App.tsx` | Stacked: Ingredients + PrepSessions + PortionBuilder |
| React Router | **Not installed** |
| `PortionBuilder.tsx` | `useEffect(..., [])` loads prep sessions once |
| Number inputs | `Ingredients`, `PrepSessionDetail`, `PortionBuilder` — `type="number"` + numeric `value` |
| Nginx | SPA `try_files` already on server |
| `frontend/src/App.tsx` | `const [, setIsLoggedIn]` — deploy fix from slice 6 |

---

## Phased work

| Phase | Focus | Status |
|-------|--------|--------|
| 1 | `react-router-dom`, routes, `AppLayout`, protected routes | Not started |
| 2 | Auth headers, page descriptions | Not started |
| 3 | Number input UX | Not started |
| 4 | Portion builder refetch on `/portion` | Not started |
| 5 | Light CSS spacing (no brand system) | Not started |
| Deploy | Rebuild + scp to Lightsail | After each meaningful UI batch |

Full checklist: [slice-7.md](./slice-7.md#done-when).

---

## Conventions

- Frontend-only unless bug requires API tweak
- Human implements; agent reviews
- Deploy: `VITE_API_URL=https://prepport.duckdns.org npm run build` → scp → `sudo cp` to `/var/www/prepport`
- Use fresh scp folder name (`prepport-dist-new`) — avoid nested `dist/` folder mistake from slice 6

## Deferred (not slice 7)

- README + GitHub pin (**slice 8**)
- Templates, USDA (**slice 9**)
- Full visual branding / color system

---

## Exit for this conversation

Multi-page app on live URL; auth and main screens have clear copy; number inputs and portion refresh fixed; Sunday smoke passes on https://prepport.duckdns.org. Hand off to slice 8 for README + screenshots.
