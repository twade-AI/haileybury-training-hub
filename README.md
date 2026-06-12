# Tech Tips — Haileybury Staff Training Hub

A static, no-build PWA giving Haileybury staff videos, guides and resources
for the school's digital tools. Plain HTML/CSS/JS — no framework, no bundler.

## Structure

| Path | Purpose |
|------|---------|
| `index.html` | Single page; all views are sections toggled by `js/app.js` |
| `data/content.json` | **All content lives here** — one object per resource |
| `js/app.js` | Rendering, routing, search/filters, modals, analytics hook |
| `js/auth.js` | Optional Google sign-in gate (off until a client ID is set) |
| `js/gamification.js` | XP, streaks, achievements (localStorage; opt-in UI) |
| `js/effects.js`, `js/confetti.js` | Scroll reveals and celebration effects |
| `css/styles.css` | All styling, light + dark themes |
| `sw.js` | Service worker — bump `CACHE_NAME` when shipping asset changes |
| `scripts/` | CI scripts (content validation, browser smoke test) |
| `docs/analytics-setup.md` | How to turn on anonymous usage analytics |

## Adding a resource

1. Upload the file to the team Google Drive and copy its file ID.
2. Add an entry to `data/content.json` (copy a neighbouring entry of the same
   type). Required: unique kebab-case `id`, `title`, `description`, `type`,
   `category`, `dateAdded` (YYYY-MM-DD), and a `driveFileId` / `externalUrl` /
   `youtubeId`. Optional: `tags`, `difficulty`, `strategies`,
   `executiveFunctions`, `departments`, `series` + `seriesOrder`, `featured`,
   `transcript` (searchable), `keywords` (searchable).
3. `node scripts/validate-content.js` — CI runs this on every PR too.
4. New entries show in "What's New" automatically for 30 days.

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on every PR:

- **validate-content** — schema check on `content.json` (unique ids, known
  categories/strategies, valid dates…). Keep its lists in sync with `app.js`
  when adding a category.
- **smoke-test** — headless Chromium loads the site, browses a category,
  searches, opens a modal and toggles gamification; fails on any JS error.

Run locally: `node scripts/validate-content.js` and
`npm i playwright && npx playwright install chromium && node scripts/smoke-test.js`.

## Behaviour worth knowing

- **Gamification is opt-in.** XP, streaks and awards are hidden until a user
  enables them with the eye icon in the header (`tt-focus-mode` in
  localStorage; progress still accumulates silently while hidden).
- **Suggestions** ("Suggest a Topic" button) compose a pre-filled email to
  t.wade@haileybury.com — the site has no backend.
- **Analytics are off** until an endpoint is configured — see
  `docs/analytics-setup.md`.
- **Sign-in is off** until an OAuth client ID is set in `js/auth.js`. When
  enabled, staff must sign in with an @haileybury.com Google account and
  analytics events carry their email (never on localhost/CI) — see
  `docs/analytics-setup.md`.
- **Service worker**: `data/content.json` is fetched network-first (new
  content appears immediately); other assets are cache-first, so bump
  `CACHE_NAME` in `sw.js` whenever CSS/JS changes ship.
- All user state (watched, saved, XP, requests) is localStorage only —
  per browser, per device.
