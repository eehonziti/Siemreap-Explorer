import type { WeatherApiResponse } from "@/types/weather";

interface WeatherCardProps {
    data: WeatherApiResponse | null;
    weatherCodeLabel: (code: number) => string;
}

export default function WeatherCard({ data, weatherCodeLabel }: WeatherCardProps) {
    if (!data) {
        return (
            <article className="rounded-2xl border border-[var(--gold)]/40 bg-[var(--ivory)] p-6 shadow-lg">
                <h2 className="text-2xl font-semibold text-[var(--stone)]">Weather Outlook</h2>
                <p className="mt-3 text-[var(--stone)]/80">
                    Weather details are currently unavailable. Please try again shortly.
                </p>
            </article>
        );
    }

    const { current } = data;

    return (
        <article className="rounded-2xl border border-[var(--gold)]/30 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[var(--stone)]">Current Weather</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
                <p className="rounded-xl bg-white/80 p-3 text-sm text-[var(--stone)]">
                    <strong>Temperature:</strong> {Math.round(current.temperature_2m)}C (
                    {weatherCodeLabel(current.weather_code)})
                </p>
                <p className="rounded-xl bg-white/80 p-3 text-sm text-[var(--stone)]">
                    <strong>Wind:</strong> {Math.round(current.wind_speed_10m)} km/h
                </p>
                <p className="rounded-xl bg-white/80 p-3 text-sm text-[var(--stone)]">
                    <strong>Humidity:</strong> {current.relative_humidity_2m}%
                </p>
            </div>

            <p className="mt-4 rounded-xl bg-[var(--ivory)] p-3 text-sm text-[var(--stone)]/80">
                Source: Open-Meteo live snapshot.
            </p>
        </article>
    );
}
