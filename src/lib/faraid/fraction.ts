export interface Fraction {
  n: number;
  d: number;
}

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a || 1;
}

function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

export function frac(n: number, d = 1): Fraction {
  if (d === 0) throw new Error("Fraction denominator cannot be zero");
  if (d < 0) {
    n = -n;
    d = -d;
  }
  const g = gcd(n, d);
  return { n: n / g, d: d / g };
}

export const ZERO: Fraction = { n: 0, d: 1 };
export const ONE: Fraction = { n: 1, d: 1 };

export function add(a: Fraction, b: Fraction): Fraction {
  return frac(a.n * b.d + b.n * a.d, a.d * b.d);
}

export function sub(a: Fraction, b: Fraction): Fraction {
  return frac(a.n * b.d - b.n * a.d, a.d * b.d);
}

export function mul(a: Fraction, b: Fraction): Fraction {
  return frac(a.n * b.n, a.d * b.d);
}

export function div(a: Fraction, b: Fraction): Fraction {
  return frac(a.n * b.d, a.d * b.n);
}

export function isZero(a: Fraction): boolean {
  return a.n === 0;
}

/** Returns a negative, zero, or positive number if a < b, a == b, or a > b. */
export function compare(a: Fraction, b: Fraction): number {
  return a.n * b.d - b.n * a.d;
}

export function sum(items: Fraction[]): Fraction {
  return items.reduce((acc, x) => add(acc, x), ZERO);
}

/** Least common multiple of a list of fraction denominators. */
export function commonDenominator(items: Fraction[]): number {
  return items.reduce((acc, x) => lcm(acc, x.d), 1);
}

export function toText(a: Fraction): string {
  if (a.n === 0) return "0";
  if (a.d === 1) return String(a.n);
  return `${a.n}/${a.d}`;
}

export function toPercent(a: Fraction, digits = 2): number {
  return Number(((a.n / a.d) * 100).toFixed(digits));
}
