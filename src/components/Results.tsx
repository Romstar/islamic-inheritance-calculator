"use client";

import { calculate } from "@/lib/faraid/calculator";
import { settleEstate } from "@/lib/faraid/estate";
import { allocateAmounts, formatMoney, parseMoneyField } from "@/lib/faraid/money";
import { SCHOOLS, type SchoolId } from "@/lib/faraid/schools";
import type { HeirInput } from "@/lib/faraid/types";
import { isZero, toPercent, toText } from "@/lib/faraid/fraction";
import SuccessiveDeath from "./SuccessiveDeath";

const METHOD_LABEL: Record<string, string> = {
  normal: "Standard shares",
  awl: "'Awl (shares reduced)",
  radd: "Radd (remainder returned)",
};

const METHOD_STYLE: Record<string, string> = {
  normal: "bg-emerald-100 text-emerald-800",
  awl: "bg-amber-100 text-amber-800",
  radd: "bg-zinc-200 text-zinc-700",
};

export default function Results({
  school,
  heirs,
  gross,
  debts,
  funeral,
  wasiyyah,
}: {
  school: SchoolId;
  heirs: HeirInput;
  gross: string;
  debts: string;
  funeral: string;
  wasiyyah: string;
}) {
  const result = calculate(heirs, school);
  const grossField = parseMoneyField(gross);
  const debtsField = parseMoneyField(debts);
  const funeralField = parseMoneyField(funeral);
  const willField = parseMoneyField(wasiyyah);
  const moneyInvalid =
    grossField.invalid || debtsField.invalid || funeralField.invalid || willField.invalid;
  const estate = settleEstate({
    gross: grossField.amount,
    debts: debtsField.amount,
    funeral: funeralField.amount,
    wasiyyah: willField.amount,
  });
  const enteredMoney =
    gross.trim() !== "" || debts.trim() !== "" || funeral.trim() !== "" || wasiyyah.trim() !== "";
  const showMoney = enteredMoney && estate.gross > 0;
  const amounts = showMoney
    ? allocateAmounts(
        [
          ...result.shares.map((share) => share.share),
          ...(isZero(result.treasury) ? [] : [result.treasury]),
        ],
        estate.distributable,
      )
    : [];
  const perPersonAmounts = showMoney
    ? result.shares.map((share, index) =>
        share.count > 1 ? amounts[index] / share.count : amounts[index],
      )
    : [];

  if (result.errors.length > 0) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <ul className="list-inside list-disc space-y-1">
          {result.errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">Inheritance shares</h2>
          <span
            className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${METHOD_STYLE[result.method]}`}
          >
            {METHOD_LABEL[result.method]}
          </span>
        </div>

        {moneyInvalid && (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            One or more money fields are invalid. Amounts use 0 for those fields.
          </p>
        )}

        {enteredMoney && (
          <div className="overflow-x-auto rounded-lg border border-zinc-200">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Estate deductions</caption>
              <tbody className="divide-y divide-zinc-100">
                <tr>
                  <th className="px-3 py-2 font-medium text-zinc-600">Gross estate</th>
                  <td className="px-3 py-2 text-right text-zinc-900">{formatMoney(estate.gross)}</td>
                </tr>
                <tr>
                  <th className="px-3 py-2 font-medium text-zinc-600">Debts</th>
                  <td className="px-3 py-2 text-right text-zinc-900">−{formatMoney(estate.debts)}</td>
                </tr>
                <tr>
                  <th className="px-3 py-2 font-medium text-zinc-600">Funeral costs</th>
                  <td className="px-3 py-2 text-right text-zinc-900">
                    −{formatMoney(estate.funeral)}
                  </td>
                </tr>
                <tr>
                  <th className="px-3 py-2 font-medium text-zinc-600">Net estate</th>
                  <td className="px-3 py-2 text-right font-medium text-zinc-900">
                    {formatMoney(estate.net)}
                  </td>
                </tr>
                <tr>
                  <th className="px-3 py-2 font-medium text-zinc-600">
                    Will
                    {estate.wasiyyahCapped ? " (capped at one-third)" : ""}
                  </th>
                  <td className="px-3 py-2 text-right text-zinc-900">
                    −{formatMoney(estate.wasiyyahAllowed)}
                  </td>
                </tr>
                <tr className="bg-zinc-50">
                  <th className="px-3 py-2 font-semibold text-zinc-900">Amount for heirs</th>
                  <td className="px-3 py-2 text-right font-semibold text-zinc-900">
                    {formatMoney(estate.distributable)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {estate.net === 0 && enteredMoney && (
          <p className="text-sm text-amber-800">
            Nothing remains after debts and funeral costs. The fractions below show how heirs would
            share any remainder.
          </p>
        )}

        <div className="overflow-x-auto rounded-lg border border-zinc-200">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-3 py-2 font-medium">Heir</th>
                <th className="px-3 py-2 font-medium">Share</th>
                <th className="px-3 py-2 font-medium">Percent</th>
                {showMoney && <th className="px-3 py-2 text-right font-medium">Amount</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {result.shares.map((share, index) => (
                <tr key={share.key} className="align-top">
                  <td className="px-3 py-3">
                    <span className="block font-medium text-zinc-900">
                      {share.label}
                      {share.count > 1 && (
                        <span className="ml-1 text-zinc-400">×{share.count}</span>
                      )}
                    </span>
                    <span className="block text-xs text-zinc-500">{share.reason}</span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 font-mono text-zinc-900">
                    {toText(share.share)}
                    {share.count > 1 && (
                      <span className="block text-xs text-zinc-400">
                        {toText(share.perPerson)} each
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-zinc-700">
                    {toPercent(share.share)}%
                    {share.count > 1 && (
                      <span className="block text-xs text-zinc-400">
                        {toPercent(share.perPerson)}% each
                      </span>
                    )}
                  </td>
                  {showMoney && (
                    <td className="whitespace-nowrap px-3 py-3 text-right text-zinc-900">
                      {formatMoney(amounts[index] ?? 0)}
                      {share.count > 1 && (
                        <span className="block text-xs text-zinc-400">
                          {formatMoney(perPersonAmounts[index] ?? 0)} each
                        </span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
              {!isZero(result.treasury) && (
                <tr className="align-top">
                  <td className="px-3 py-3">
                    <span className="block font-medium text-zinc-900">Public treasury</span>
                    <span className="block text-xs text-zinc-500">
                      Remainder that this school does not return by radd.
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 font-mono text-zinc-900">
                    {toText(result.treasury)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-zinc-700">
                    {toPercent(result.treasury)}%
                  </td>
                  {showMoney && (
                    <td className="whitespace-nowrap px-3 py-3 text-right text-zinc-900">
                      {formatMoney(amounts[result.shares.length] ?? 0)}
                    </td>
                  )}
                </tr>
              )}
            </tbody>
            <tfoot className="bg-zinc-50 text-sm font-semibold text-zinc-900">
              <tr>
                <td className="px-3 py-2">Total</td>
                <td className="px-3 py-2">1</td>
                <td className="px-3 py-2">100%</td>
                {showMoney && (
                  <td className="px-3 py-2 text-right">{formatMoney(estate.distributable)}</td>
                )}
              </tr>
            </tfoot>
          </table>
        </div>

        <SuccessiveDeath school={school} first={result} />
      </div>

      <aside className="space-y-5">
        {result.blocked.length > 0 && (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Excluded relatives (hajb)
            </h3>
            <ul className="space-y-1 text-sm text-zinc-600">
              {result.blocked.map((blocked) => (
                <li
                  key={blocked.key}
                  className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4"
                >
                  <span>
                    {blocked.label}
                    {blocked.count > 1 && (
                      <span className="ml-1 text-zinc-400">×{blocked.count}</span>
                    )}
                  </span>
                  <span className="text-xs text-zinc-500 sm:text-right">{blocked.reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.notes.length > 0 && (
          <ul className="space-y-1 text-xs text-zinc-500">
            {result.notes.map((note) => (
              <li key={note} className="flex gap-2">
                <span aria-hidden>•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        )}

        {estate.wasiyyahCapped && (
          <p className="text-xs text-zinc-500">
            The will was reduced to one-third of the net estate ({formatMoney(estate.wasiyyahCap)}).
          </p>
        )}

        <p className="text-xs text-zinc-400">
          Problem base: {result.baseDenominator}. This case uses the {SCHOOLS[school].label} school.
          This tool is for education, not a religious or legal ruling.
        </p>
      </aside>
    </div>
  );
}
