# Workout Solutions by Roy — Briefing for Claude Code

> **Read this file BEFORE every task.** It is the context anchor. If you find a
> contradiction in the code, ask — and update this file too, never change the
> code silently. All facts come EXCLUSIVELY from this file — do not "supplement"
> from the web. (We once identified the wrong Roy; hence the strictness.)

---

## What is this?

Public marketing website + (later) coaching web app for **Roy Fokken**, an
international strength & lifestyle coach. Official brand name:
**"Workout Solutions by Roy"** (the generic + Roy as the brand).

**Phases:**
- **Phase 1 (now):** Public marketing site — landing + `/program` subpage.
  English, i18n-ready (DE + ES to follow). No DB needed. Deploy via Vercel.
- **Phase 2:** Auth + admin/client accounts, workout builder with exercise GIFs,
  Supabase backend (schema already designed below).
- **Phase 3:** Client logbook (volume tracking).

---

## Roy — verified facts (use ONLY these)

- Born & raised in Germany, in North America since 1993, **now back in Germany**.
  Works as an **international online coach** — clients in USA, Canada, Mexico,
  and Germany.
- Certified Personal Trainer, **20+ years of experience**.
- Trains the **full spectrum**: beginners, **women** (among his most loyal
  clients), **children**, as well as pro athletes, bodybuilders, fighters, and
  actors.
- Make **NO** vegetarian/nutrition statement about Roy.
- Team "Iron Force Powerlifting": exists, but **do not feature prominently**
  (Roy himself doesn't stress it).

**Motto (central brand line):**
> "You are born frail and weak and you will die frail and weak — what you look
> like in between is up to you."

**Powerlifting titles:**
- WNPF National (USA) Champion 1999 & 2000
- WNPF World Champion 1999 & 2000
- WNPF Lifter of the Year 1999-2000
- AAU National (USA) World Champion 1999
- IPA World Champion 2000
- CPA Canadian-American Benchpress Champion 2001
- **World Record Benchpresser**
- Powerlifting USA Magazine Achievement Awards (165 / 132 lbs weightclass)

**Bodybuilding titles:**
- NPC Mister Philadelphia
- NPC Pennsylvania / Philadelphia / North Coast / East Coast Champion
- NABBA Keystone Lightweight Champion
- WBFF British Columbia Lightweight Champion

**Prices:** outdated -> **do not mention.** CTA leads with "Book a Consultation".

---

## Brand & tone

**Conceptual north star: "World Class Lifestyle"** (Roy's real claim).
Transformation and excellence for *everyone* — not "Iron/Forge" masculinity.
Premium, stoic, proven, disciplined, international — AND welcoming to women,
beginners, and children.

**Inclusivity is mandatory, not decoration.** Roy's own logo shows a male AND a
female figure. Women & children are a core audience. Therefore:
- Mandatory element "Who Roy Trains": *"From first-timers to world champions —
  women, men, and kids. Beginners, athletes, fighters, and actors."*
- Image placeholders for results/testimonials show **diverse** people (women,
  beginners, children), not only male bodybuilders. The hero may show Roy
  (credential proof).
- The motto stays as a powerful moment; the copy directly beneath it is warmer
  and broader.

---

## Design system (CI v1 — approved, swappable)

CSS variables / Tailwind theme tokens:

```
--forge-black:  #0C0C0E   /* base background */
--surface:      #15141A   /* cards */
--raised:       #1D1C24   /* elevated */
--gold:         #C8A14B   /* primary accent (championship) */
--gold-bright:  #E6C260   /* highlight / CTA hover */
--bronze:       #9C6B3C   /* secondary accent */
--bone:         #EFEBE3   /* primary text */
--ash:          #8E8A82   /* muted text */
```

**Typography (via `next/font/google`):**
- **Display:** Bodoni Moda — headlines, motto, section titles, credential
  numbers. Italic carries the philosophical voice. (Elegant-editorial; balances
  the dark base.)
- **Body:** Archivo — body copy, nav, buttons, labels. Uppercase with wide
  tracking (0.2-0.4em) for eyebrows & CTAs.

**Logo:** Current logo ("Roys Training / World Class Lifestyle", gold+silver
figures) is included as reference (`/public/reference/Roy03.jpg`) — do **NOT**
embed it directly. Tonight: a type-based wordmark "WORKOUT SOLUTIONS" + "by Roy"
as a subtitle in CI style. A real logo rebrand is a later task (marketing /
creative direction: Paula).

**Forbidden:** old chrome/metal logo look, gym-bro cliches, hype language,
generic stock aesthetics, purple gradients, Inter/Roboto/Arial.

---

## Tech stack

- **Next.js (App Router), JavaScript/JSX** — no TypeScript
- **Tailwind CSS** — CI tokens as theme extension in `tailwind.config.js`
- **next-intl** for i18n — **all** text as keys in `messages/{locale}.json`.
  Today only `en.json`. `de.json` + `es.json` follow without component changes.
- **react-compare-slider** for before/after
- **next/font** for Bodoni Moda + Archivo
- **Vercel** for deploy (`npx vercel`)
- **Supabase** as the planned backend (Phase 2 — see data model below)

---

## i18n architecture (critical)

**Never hardcode text.** Every visible string lives in `messages/en.json` under
structured keys (e.g. `hero.motto`, `program.phase1.title`). Components pull
text via `useTranslations()`. Language switcher (EN/DE/ES) in the header — today
it shows all three options, only EN is active. Locale routing via next-intl
(`/`, `/de`, `/es`). DE + ES JSON come later — then the switch works immediately,
without touching a single component.

---

## Page structure (Phase 1)

**Landing (`/`):**
1. **Hero** — motto (Bodoni, italic) + credential eyebrow ("4x World Champion ·
   20+ Years") + CTA "Book a Consultation" (mailto) + language switcher
2. **Credentials band** — key numbers (4x, World Record, 20+, 3 continents) +
   title lists (powerlifting / bodybuilding)
3. **About Roy** — bio (verified facts) + photo (`Roy01.jpg`/`Roy02.jpg`)
4. **Who Roy Trains** — inclusivity element (women, men, kids, beginners,
   athletes, fighters, actors)
5. **12-Week Program teaser** — short pitch -> link to `/program`
6. **Before/After** — react-compare-slider, **placeholder images** (Roy supplies
   real ones with his first client batch)
7. **Testimonials** — **placeholders** (clearly marked as such; Roy supplies real)
8. **Contact / CTA** — mailto placeholder (real address to follow; until then a
   `TODO_ROY_EMAIL` constant)
9. **Footer** — brand, social placeholders, EN/DE/ES note

**Program subpage (`/program`):** The 12-week three-phase roadmap (below).

---

## 12-week strawman (placeholder — Roy will refine)

**PHASE 1 — FOUNDATION (W1-4):** assessment, form mastery, rhythm, first
checkpoint.
**PHASE 2 — BUILD (W5-8):** progressive overload, mid-program assessment,
nutrition recalibration.
**PHASE 3 — PEAK (W9-12):** specialization (strength or aesthetics), peak phase,
final reveal + roadmap.

Throughout: email access to Roy, nutrition adjustment, accountability.
**Mark the phase details as provisional** (Roy will replace them).

---

## Planned data model (Phase 2/3 — DOCUMENT ONLY NOW, do not build)

Supabase/Postgres. Do NOT provision today — the marketing site is static. This
is the architectural forward-planning so Phase 2 docks in cleanly:

- **profiles** (extends `auth.users`): id, role (`admin`|`client`), full_name,
  email, locale, avatar_url, created_at
- **clients**: profile_id (FK), goal, start_date, status, assigned_program_id,
  coach_notes
- **exercises**: id, name_key, muscle_group, equipment, gif_url, instructions,
  created_by
- **programs**: id, name, description, duration_weeks, is_template, created_by
- **workouts**: id, program_id (FK), week_number, day_number, title
- **workout_exercises**: id, workout_id (FK), exercise_id (FK), sets, reps,
  rest_seconds, sort_order, notes
- **client_programs**: id, client_id (FK), program_id (FK), start_date, status
- **logbook_entries** (Phase 3): id, client_id (FK), workout_exercise_id (FK),
  logged_at, set_number, weight, reps, rpe, notes
- **testimonials**: id, client_name, quote, photo_url, locale, is_published,
  sort_order
- **before_after**: id, label, before_url, after_url, weeks, caption,
  is_published, sort_order
- **leads**: id, name, email, message, locale, status, created_at

Phase 1 content (testimonials, before/after) lives as placeholders in i18n JSON
today; the tables above are their future CMS home.

---

## Project structure (target)

```
workout-solutions/
|-- app/
|   |-- [locale]/
|   |   |-- layout.jsx        <- fonts, i18n provider, <html lang>
|   |   |-- page.jsx          <- landing
|   |   |-- program/page.jsx  <- 12-week subpage
|   |-- globals.css           <- Tailwind + CI tokens
|-- components/               <- Hero, Credentials, About, WhoRoyTrains,
|                                ProgramTeaser, BeforeAfter, Testimonials,
|                                Contact, Footer, LanguageSwitcher, Nav
|-- messages/
|   |-- en.json               <- ALL text (de.json/es.json later)
|-- public/
|   |-- Roy01.jpg  Roy02.jpg  <- hero/about
|   |-- reference/Roy03.jpg   <- logo reference (do not embed)
|   |-- placeholders/         <- before/after + testimonial placeholders
|-- tailwind.config.js        <- CI tokens
|-- next.config.js            <- next-intl plugin
|-- CLAUDE.md
```

---

## Guardrails

1. **No hardcoded text** — everything via i18n keys in `messages/en.json`
2. **Do not invent testimonials/client names/before-after** — only clearly
   marked placeholders
3. **No nutrition/vegetarian statement** about Roy
4. **Do not show prices** (outdated)
5. **Do not feature Iron Force prominently**
6. **Stay inclusive** — women & children visible, not only male physique
7. **Old chrome/metal logo look = forbidden**
8. **Facts only from this file** — do not supplement from the web
9. **Mobile-first** (Widu lesson) — test every component at ~390px
10. **Do not build the backend today** — the schema is documentation only

---

## Workflow per task

1. Read this CLAUDE.md
2. Formulate a plan, present it to the user, wait for OK
3. Edit + show the diff
4. For new packages: check the version (Widu lesson: lucide icon white-screen)
5. With `npm run dev` running -> verify visually, including mobile
