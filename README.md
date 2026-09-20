# Islamic Inheritance Calculator

A static web app that calculates Islamic inheritance shares. A step-by-step
questionnaire asks about the surviving relatives. The app then shows the
fraction, percentage, and amount for each heir. It applies fixed shares
(furud), residue (asaba), blocking (hajb), 'awl, and radd.

Version 1.0 is for education. It is not a religious or legal ruling.

## Stack

- Next.js 16 (App Router) with React 19, built as a static export
- TypeScript
- Tailwind CSS 4
- Vitest for unit tests

The app is fully client-side. `next build` writes static HTML, CSS, and JS to
`out/`. It needs no server at runtime.

## Version 1.0 features

- Branching questions. The form hides relatives who cannot inherit.
- A first question that opens one of four school calculators (Hanafi, Maliki,
  Shafi'i, Hanbali)
- Help text for each heir in plain English
- Debts and funeral costs before any heir
- Optional will (wasiyyah), capped at one-third of the net estate
- Answer summary, copy-link, and print on the results page
- Bookmarkable URLs for a saved case
- Scope page that states what the tool covers
- Guide pages for Faraid, heirs, Quranic shares, blocking, 'awl, radd, the will, schools, and FAQ

## Supported heirs

- Husband or wives (up to 4)
- Father, mother, paternal grandfather, and grandmothers (paternal and maternal)
- Sons, daughters, grandsons, and granddaughters (son's line, one generation)
- Full, paternal half, and maternal (uterine) siblings
- Brothers' sons, paternal uncles, and their sons

### Notes on rulings

- You choose a school of thought first. Each school has its own calculator.
- Share numbers in this version still follow one engine. The paternal grandfather
  blocks all siblings, as in the Hanafi position.
- Grandparents and grandchildren cover one generation each.
- The tool does not cover distant kindred, successive deaths, unborn children,
  missing persons, or difference of religion.
- Read `/scope` for the full list.

## Development

This project uses `pnpm`.

```bash
pnpm install            # install dependencies
pnpm dev                # start the dev server on http://localhost:3000
pnpm test               # run the unit tests
pnpm run typecheck      # run the TypeScript compiler
pnpm run lint           # run ESLint
pnpm run build          # build the static site into out/
```

## Deployment (Netlify)

The project builds a static site, so any static host works. `netlify.toml`
sets the build command and publish directory:

- Build command: `pnpm run build`
- Publish directory: `out`

To preview the static build locally:

```bash
pnpm run build
python3 -m http.server 4000 --directory out
# open http://localhost:4000
```

## Calculation engine

The engine lives in `src/lib/faraid/`:

- `fraction.ts` - exact fraction arithmetic
- `calculator.ts` - the share rules (furud, asaba, 'awl, radd)
- `estate.ts` - debts, funeral costs, and the one-third will cap
- `steps.ts` - which questions to show
- `calculator.test.ts` - tests based on classic examples
