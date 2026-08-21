# Islamic Inheritance Calculator

A web app that calculates Islamic inheritance (Faraid) shares. Enter the
surviving heirs. The app shows each fixed share (fard) and the residue
(asaba). It applies 'awl (increase) and radd (return) when needed.

## Stack

- Next.js 16 (App Router) with React 19, built as a static export
- TypeScript
- Tailwind CSS 4
- Vitest for unit tests

The app is fully client-side. `next build` writes static HTML, CSS, and JS to
`out/`. It needs no server at runtime.

## Supported heirs

- Husband or wives (up to 4)
- Father and mother
- Sons and daughters
- Full (germane) brothers and sisters
- Maternal (uterine) siblings

The engine does not cover grandparents, grandchildren, or consanguine
siblings. Use the tool for education only. It is not a religious or legal
ruling.

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
