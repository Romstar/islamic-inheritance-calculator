import type { Fraction } from "./fraction";

export function parseMoneyField(value: string): { amount: number; invalid: boolean } {
  const trimmed = value.trim().replace(/,/g, "");
  if (trimmed === "") return { amount: 0, invalid: false };
  const amount = Number(trimmed);
  if (!Number.isFinite(amount) || amount < 0) return { amount: 0, invalid: true };
  return { amount, invalid: false };
}

export function parseMoney(value: string): number {
  return parseMoneyField(value).amount;
}

export function formatMoney(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Split a money total by fractions.
 * Uses largest-remainder rounding so the cent amounts sum to the total.
 */
export function allocateAmounts(shares: Fraction[], total: number): number[] {
  if (shares.length === 0) return [];
  const cents = Math.round(Math.max(0, total) * 100);
  const exact = shares.map((share) => (share.n / share.d) * cents);
  const floors = exact.map((value) => Math.floor(value + 1e-9));
  const remainder = cents - floors.reduce((sum, value) => sum + value, 0);
  const order = exact
    .map((value, index) => ({ index, frac: value - floors[index] }))
    .sort((a, b) => b.frac - a.frac);
  for (let i = 0; i < remainder; i += 1) {
    floors[order[i % order.length].index] += 1;
  }
  return floors.map((value) => value / 100);
}
