# Islamic Inheritance Calculator

A static web app that calculates Islamic inheritance (Faraid) shares. A
step-by-step questionnaire asks about the surviving relatives. The app then
shows the fraction, percentage, and amount for each individual heir. It applies
fixed shares (furud), residue (asaba), blocking (hajb), 'awl (increase), and
radd (return).

## Stack

- Next.js 16 (App Router) with React 19, built as a static export
- TypeScript
- Tailwind CSS 4
- Vitest for unit tests

The app is fully client-side. `next build` writes static HTML, CSS, and JS to
`out/`. It needs no server at runtime.

## Supported heirs

The engine covers the full classic set of heirs:

- Husband or wives (up to 4)
- Father, mother, paternal grandfather, and grandmothers (paternal and maternal)
- Sons, daughters, grandsons, and granddaughters (son's line)
- Full, paternal half (consanguine), and maternal (uterine) siblings
- Extended agnates: brothers' sons, paternal uncles, and their sons

### Notes on rulings

- The paternal grandfather follows the Hanafi position: he blocks all siblings,
  exactly as the father does.
- Grandparents and grandchildren cover one generation each.
- Use the tool for education only. It is not a religious or legal ruling.

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
- `calculator.test.ts` - tests based on classic Faraid examples
