export interface EstateInput {
  gross: number;
  debts: number;
  funeral: number;
  wasiyyah: number;
}

export interface EstateBreakdown {
  gross: number;
  debts: number;
  funeral: number;
  /** Estate after debts and funeral costs. */
  net: number;
  wasiyyahRequested: number;
  /** One-third of the net estate. */
  wasiyyahCap: number;
  /** Bequest after the one-third cap. */
  wasiyyahAllowed: number;
  wasiyyahCapped: boolean;
  /** Amount left for Quranic and residuary heirs. */
  distributable: number;
}

function nonNegative(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

/**
 * Apply debts, funeral costs, then a will (wasiyyah) capped at one-third of
 * the net estate. Faraid shares apply to the remaining distributable amount.
 */
export function settleEstate(input: EstateInput): EstateBreakdown {
  const gross = nonNegative(input.gross);
  const debts = nonNegative(input.debts);
  const funeral = nonNegative(input.funeral);
  const wasiyyahRequested = nonNegative(input.wasiyyah);
  const net = Math.max(0, gross - debts - funeral);
  const wasiyyahCap = net / 3;
  const wasiyyahAllowed = Math.min(wasiyyahRequested, wasiyyahCap);
  const wasiyyahCapped = wasiyyahRequested > wasiyyahCap && net > 0;
  const distributable = Math.max(0, net - wasiyyahAllowed);
  return {
    gross,
    debts,
    funeral,
    net,
    wasiyyahRequested,
    wasiyyahCap,
    wasiyyahAllowed,
    wasiyyahCapped,
    distributable,
  };
}
