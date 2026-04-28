import type { ExchangeApiResponse } from "@/types/exchange";

const trackedCurrencies = [
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
type TrackedCurrency = (typeof trackedCurrencies)[number];

interface ExchangeCardProps {
    exchangeData: ExchangeApiResponse | null;
}

function toKhrRate(exchangeData: ExchangeApiResponse, currency: TrackedCurrency) {
    const khrPerUsd = exchangeData.conversion_rates.KHR;
    const currencyPerUsd = exchangeData.conversion_rates[currency];
    if (!khrPerUsd || !currencyPerUsd) {
        return null;
    }

    if (currency === "USD") {
        return khrPerUsd;
    }

    return khrPerUsd / currencyPerUsd;
}

export default function ExchangeCard({ exchangeData }: ExchangeCardProps) {
    if (!exchangeData) {
        return (
            <article className="rounded-2xl border border-[var(--gold)]/30 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-[var(--stone)]">Exchange Rates</h2>
                <p className="mt-3 text-[var(--stone)]/80">
                    Exchange rates are currently unavailable. Please try again shortly.
                </p>
            </article>
        );
    }

    return (
        <article className="rounded-2xl border border-[var(--gold)]/30 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[var(--stone)]">Currency to KHR</h2>
            <p className="mt-1 text-sm text-[var(--stone)]/70">
                Updated: {exchangeData.time_last_update_utc}
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {trackedCurrencies.map((currency) => (
                    <div
                        key={currency}
                        className="flex items-center justify-between rounded-lg bg-[var(--ivory)] px-3 py-2 text-sm"
                    >
                        <span className="font-semibold text-[var(--stone)]">{currency}</span>
                        <span className="text-[var(--stone)]">
                            {toKhrRate(exchangeData, currency)?.toLocaleString("en-US", {
                                maximumFractionDigits: 2,
                            }) ?? "--"}{" "}
                            {toKhrRate(exchangeData, currency) ? "KHR" : ""}
                        </span>
                    </div>
                ))}
            </div>
        </article>
    );
}
