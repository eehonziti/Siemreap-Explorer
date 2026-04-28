"use client";

import { useMemo, useState } from "react";
import type { ExchangeApiResponse } from "@/types/exchange";

const currencies = [
    "USD",
    "EUR",
    "GBP",
    "THB",
    "CNY",
    "KRW",
    "JPY",
    "SGD",
    "MYR",
    "AUD",
    "CAD",
    "INR",
    "VND",
    "PHP",
] as const;
type CurrencyCode = (typeof currencies)[number];

interface CurrencyConverterProps {
    exchangeData: ExchangeApiResponse | null;
}

function convertToKhr(exchangeData: ExchangeApiResponse, amount: number, from: CurrencyCode): number {
    const khrPerUsd = exchangeData.conversion_rates.KHR;
    if (!khrPerUsd) {
        return 0;
    }

    if (from === "USD") {
        return amount * khrPerUsd;
    }

    const fromPerUsd = exchangeData.conversion_rates[from];
    if (!fromPerUsd) {
        return 0;
    }

    return amount * (khrPerUsd / fromPerUsd);
}

export default function CurrencyConverter({ exchangeData }: CurrencyConverterProps) {
    const [amount, setAmount] = useState<string>("100");
    const [fromCurrency, setFromCurrency] = useState<CurrencyCode>("USD");

    const convertedAmount = useMemo(() => {
        if (!exchangeData) {
            return null;
        }

        const parsedAmount = Number(amount);
        if (Number.isNaN(parsedAmount)) {
            return null;
        }

        return convertToKhr(exchangeData, parsedAmount, fromCurrency);
    }, [amount, exchangeData, fromCurrency]);

    return (
        <article className="rounded-2xl border border-[var(--gold)]/30 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[var(--stone)]">Convert to KHR</h2>

            {!exchangeData ? (
                <p className="mt-3 text-[var(--stone)]/80">
                    Converter is unavailable until exchange data is loaded.
                </p>
            ) : (
                <div className="mt-4 space-y-4">
                    <label className="block text-sm text-[var(--stone)]">
                        Amount
                        <input
                            type="number"
                            min="0"
                            value={amount}
                            onChange={(event) => setAmount(event.target.value)}
                            className="mt-1 w-full rounded-xl border border-[var(--gold)]/40 bg-white px-3 py-2 outline-none focus:border-[var(--forest)]"
                        />
                    </label>

                    <label className="block text-sm text-[var(--stone)]">
                        Currency
                        <select
                            value={fromCurrency}
                            onChange={(event) => setFromCurrency(event.target.value as CurrencyCode)}
                            className="mt-1 w-full rounded-xl border border-[var(--gold)]/40 bg-white px-3 py-2 outline-none focus:border-[var(--forest)]"
                        >
                            {currencies.map((currency) => (
                                <option key={currency} value={currency}>
                                    {currency}
                                </option>
                            ))}
                        </select>
                    </label>

                    <div className="rounded-xl bg-[var(--ivory)] p-4 text-[var(--stone)]">
                        <p className="text-sm font-semibold">Converted to KHR</p>
                        <p className="mt-1 text-2xl font-bold">
                            {convertedAmount !== null
                                ? convertedAmount.toLocaleString("en-US", {
                                      maximumFractionDigits: 2,
                                  })
                                : "--"}{" "}
                            KHR
                        </p>
                    </div>
                </div>
            )}
        </article>
    );
}
