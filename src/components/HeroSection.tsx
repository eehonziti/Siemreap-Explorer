import type { WeatherCurrent } from "@/types/weather";

interface HeroSectionProps {
    weather: WeatherCurrent | null;
    weatherLabel: string;
}

export default function HeroSection({ weather, weatherLabel }: HeroSectionProps) {
    return (
        <section className="fade-in rounded-2xl border border-[var(--gold)]/30 bg-white p-6 shadow-sm md:p-8">
            <p className="text-sm font-medium uppercase tracking-wide text-[var(--forest)]">
                Siem Reap Travel Guide
            </p>
            <h1 className="mt-2 text-3xl font-bold text-[var(--stone)] md:text-4xl">
                Discover the Wonders of Siem Reap
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[var(--stone)]/80 md:text-base">
                Live weather, exchange rates, and a simple map to help plan your trip.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--ivory)] px-3 py-2 text-sm">
                <span className="font-semibold text-[var(--stone)]">Weather:</span>
                {weather ? (
                    <span className="text-[var(--stone)]">
                        {Math.round(weather.temperature_2m)}C, {weatherLabel}
                    </span>
                ) : (
                    <span className="text-[var(--stone)]/70">Unavailable right now</span>
                )}
            </div>
        </section>
    );
}
