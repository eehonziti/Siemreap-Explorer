"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import StockPanel from "@/components/StockPanel";
import WeatherPanel from "@/components/WeatherPanel";
import { fetchCityCoords } from "@/lib/fetchCityCoords";
import { fetchStocks } from "@/lib/fetchStocks";
import { fetchWeather } from "@/lib/fetchWeather";
import { Coords, StockData, WeatherData } from "@/types";

const MapPanel = dynamic(() => import("@/components/MapPanel"), { ssr: false });

interface EmptyStateCardProps {
    title: string;
    message: string;
}

function EmptyStateCard({ title, message }: EmptyStateCardProps) {
    return (
        <article className="panel-rise rounded-2xl border border-white/70 bg-white/75 p-5 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                {title}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>
        </article>
    );
}

function getErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof Error && error.message.trim()) {
        return error.message;
    }

    return fallback;
}

export default function Home() {
    const [city, setCity] = useState<string>("Siem Reap");
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [stocks, setStocks] = useState<StockData[] | null>(null);
    const [coords, setCoords] = useState<Coords>({ lat: 13.3671, lng: 103.8448 });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [notices, setNotices] = useState<string[]>([]);
    const [hasSearched, setHasSearched] = useState<boolean>(false);

    const handleSearch = async (cityName: string): Promise<void> => {
        const trimmedCity = cityName.trim();
        if (!trimmedCity) {
            return;
        }

        setLoading(true);
        setHasSearched(true);
        setError("");
        setNotices([]);

        try {
            const geocodedCoords = await fetchCityCoords(trimmedCity);

            setCity(trimmedCity);
            setCoords(geocodedCoords);

            const [weatherResult, stocksResult] = await Promise.allSettled([
                fetchWeather(trimmedCity),
                fetchStocks(),
            ]);

            const nextNotices: string[] = [];

            if (weatherResult.status === "fulfilled") {
                setWeather(weatherResult.value);
                setCoords({ lat: weatherResult.value.lat, lng: weatherResult.value.lng });
            } else {
                setWeather(null);
                nextNotices.push(
                    `Weather unavailable: ${getErrorMessage(
                        weatherResult.reason,
                        "Unable to fetch weather data."
                    )}`
                );
            }

            if (stocksResult.status === "fulfilled") {
                setStocks(stocksResult.value);
            } else {
                setStocks(null);
                nextNotices.push(
                    `Stocks unavailable: ${getErrorMessage(
                        stocksResult.reason,
                        "Unable to fetch stock data."
                    )}`
                );
            }

            setNotices(nextNotices);
        } catch (searchError: unknown) {
            setWeather(null);
            setStocks(null);
            setError(getErrorMessage(searchError, "City not found. Please try another name."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_15%_20%,#cffafe_0%,#ecfeff_22%,#f8fafc_56%,#fff7ed_100%)] px-4 py-8 sm:px-6">
            <div className="mx-auto max-w-5xl space-y-6">
                <header className="panel-rise rounded-2xl border border-white/70 bg-white/75 p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
                        Explore smarter
                    </p>
                    <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                        City Explorer
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
                        Search any city to move the map instantly and pull weather and market
                        snapshots when APIs are available.
                    </p>
                </header>

                <section className="panel-rise rounded-2xl border border-white/70 bg-white/75 p-4 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur sm:p-5">
                    <SearchBar onSearch={handleSearch} />
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="rounded-full bg-slate-900 px-3 py-1 font-medium text-white">
                            Active city: {city}
                        </span>
                        <span className="rounded-full bg-white px-3 py-1">Map source: OpenStreetMap</span>
                        {loading && (
                            <span className="rounded-full bg-cyan-100 px-3 py-1 font-medium text-cyan-800">
                                Updating...
                            </span>
                        )}
                    </div>
                </section>

                {error && (
                    <p className="panel-rise rounded-2xl border border-red-200 bg-red-50/90 px-4 py-3 text-sm text-red-700">
                        {error}
                    </p>
                )}

                {notices.length > 0 && (
                    <section className="panel-rise rounded-2xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm text-amber-800">
                        <p className="font-semibold">Some live data is unavailable right now:</p>
                        <ul className="mt-1 list-disc pl-5">
                            {notices.map((notice) => (
                                <li key={notice}>{notice}</li>
                            ))}
                        </ul>
                    </section>
                )}

                <section className="panel-rise">
                    <MapPanel lat={coords.lat} lng={coords.lng} cityName={city} />
                </section>

                {(weather || stocks || notices.length > 0) && (
                    <section className="grid gap-4 md:grid-cols-2">
                        {weather ? (
                            <WeatherPanel weather={weather} />
                        ) : (
                            <EmptyStateCard
                                title="Weather"
                                message="Weather data is unavailable. Add a valid OpenWeather key in .env.local to enable this panel."
                            />
                        )}
                        {stocks ? (
                            <StockPanel stocks={stocks} />
                        ) : (
                            <EmptyStateCard
                                title="Markets"
                                message="Stock data is unavailable. Add a valid Finnhub key in .env.local to enable this panel."
                            />
                        )}
                    </section>
                )}

                {!hasSearched && !loading && (
                    <p className="text-center text-sm text-slate-500">
                        Search a city above to move the map and fetch weather and market data.
                    </p>
                )}
            </div>
        </main>
    );
}
