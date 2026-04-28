"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import CurrencyConverter from "@/components/CurrencyConverter";
import ExchangeCard from "@/components/ExchangeCard";
import HeroSection from "@/components/HeroSection";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import WeatherCard from "@/components/WeatherCard";
import type { ExchangeApiResponse } from "@/types/exchange";
import type { WeatherApiResponse } from "@/types/weather";

const MapView = dynamic(() => import("../components/MapView"), { ssr: false });

function weatherCodeLabel(code: number): string {
    if (code === 0) return "Clear";
    if (code === 61) return "Rain";
    if (code === 95) return "Thunderstorm";
    return "Partly Cloudy";
}

export default function Home() {
    const [weatherData, setWeatherData] = useState<WeatherApiResponse | null>(null);
    const [exchangeData, setExchangeData] = useState<ExchangeApiResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [lastExchangeRefresh, setLastExchangeRefresh] = useState<string>("");

    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            setErrorMessage("");

            const [weatherResult, exchangeResult] = await Promise.allSettled([
                fetch("/api/weather").then(async (response) => {
                    if (!response.ok) {
                        throw new Error("Weather data is unavailable.");
                    }
                    return (await response.json()) as WeatherApiResponse;
                }),
                fetch("/api/exchange").then(async (response) => {
                    if (!response.ok) {
                        throw new Error("Exchange rate data is unavailable.");
                    }
                    return (await response.json()) as ExchangeApiResponse;
                }),
            ]);

            if (weatherResult.status === "fulfilled") {
                setWeatherData(weatherResult.value);
            } else {
                setWeatherData(null);
            }

            if (exchangeResult.status === "fulfilled") {
                setExchangeData(exchangeResult.value);
                setLastExchangeRefresh(new Date().toLocaleTimeString("en-US"));
            } else {
                setExchangeData(null);
            }

            if (weatherResult.status === "rejected" || exchangeResult.status === "rejected") {
                setErrorMessage(
                    "Some live travel data is currently unavailable. You can still explore the guide and map."
                );
            }

            setIsLoading(false);
        }

        void loadData();
    }, []);

    useEffect(() => {
        const refreshExchange = async () => {
            try {
                const response = await fetch("/api/exchange", { cache: "no-store" });
                if (!response.ok) {
                    throw new Error("Exchange rate data is unavailable.");
                }

                const data = (await response.json()) as ExchangeApiResponse;
                setExchangeData(data);
                setLastExchangeRefresh(new Date().toLocaleTimeString("en-US"));
            } catch {
                setErrorMessage(
                    "Exchange rate updates are temporarily unavailable. Showing the most recent data."
                );
            }
        };

        const intervalId = setInterval(() => {
            void refreshExchange();
        }, 30000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <main className="min-h-screen bg-[var(--ivory)] px-4 py-6 text-[var(--stone)] sm:px-6">
            <div className="mx-auto max-w-6xl space-y-5">
                <HeroSection
                    weather={weatherData?.current ?? null}
                    weatherLabel={weatherCodeLabel(weatherData?.current.weather_code ?? 0)}
                />

                {errorMessage && (
                    <p className="fade-in rounded-2xl border border-[var(--gold)]/40 bg-[var(--gold)]/10 px-4 py-3 text-sm">
                        {errorMessage}
                    </p>
                )}

                <section className="fade-in grid grid-cols-1 gap-4 md:grid-cols-2">
                    {isLoading ? (
                        <>
                            <LoadingSkeleton className="h-44" />
                            <LoadingSkeleton className="h-44" />
                        </>
                    ) : (
                        <>
                            <article className="rounded-2xl border border-[var(--gold)]/30 bg-white p-5 shadow-sm">
                                <h3 className="text-lg font-semibold">Weather Summary</h3>
                                {weatherData ? (
                                    <div className="mt-3 space-y-2 text-sm">
                                        <p>
                                            <strong>Current:</strong>{" "}
                                            {Math.round(weatherData.current.temperature_2m)}C
                                        </p>
                                        <p>
                                            <strong>Condition:</strong>{" "}
                                            {weatherCodeLabel(weatherData.current.weather_code)}
                                        </p>
                                        <p>
                                            <strong>Wind:</strong> {weatherData.current.wind_speed_10m} km/h
                                        </p>
                                    </div>
                                ) : (
                                    <p className="mt-3 text-sm text-[var(--stone)]/80">
                                        Weather data unavailable right now.
                                    </p>
                                )}
                            </article>

                            <article className="rounded-2xl border border-[var(--gold)]/30 bg-white p-5 shadow-sm">
                                <h3 className="text-lg font-semibold">USD to KHR</h3>
                                {exchangeData ? (
                                    <div className="mt-3">
                                        <p className="text-3xl font-bold text-[var(--forest)]">
                                            {exchangeData.conversion_rates.KHR.toLocaleString("en-US", {
                                                maximumFractionDigits: 2,
                                            })}{" "}
                                            KHR
                                        </p>
                                        <p className="mt-1 text-xs text-[var(--stone)]/70">
                                            Live refresh every 30s
                                            {lastExchangeRefresh ? ` • Last sync ${lastExchangeRefresh}` : ""}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="mt-3 text-sm text-[var(--stone)]/80">
                                        Exchange data unavailable right now.
                                    </p>
                                )}
                            </article>
                        </>
                    )}
                </section>

                <section className="fade-in">
                    {isLoading ? (
                        <LoadingSkeleton className="h-80" />
                    ) : (
                        <WeatherCard data={weatherData} weatherCodeLabel={weatherCodeLabel} />
                    )}
                </section>

                <section className="fade-in space-y-2">
                    <h2 className="text-xl font-semibold">Map</h2>
                    <MapView />
                </section>

                <section className="fade-in grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {isLoading ? (
                        <>
                            <LoadingSkeleton className="h-96" />
                            <LoadingSkeleton className="h-96" />
                        </>
                    ) : (
                        <>
                            <ExchangeCard exchangeData={exchangeData} />
                            <CurrencyConverter exchangeData={exchangeData} />
                        </>
                    )}
                </section>

                <footer className="fade-in rounded-2xl border border-[var(--gold)]/30 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold">Quick Travel Tips</h2>
                    <ul className="mt-3 grid gap-2 text-sm">
                        <li>Start temple tours before 6:00 AM to avoid heat and crowds.</li>
                        <li>Carry small USD bills and riel for local markets and tuk-tuks.</li>
                        <li>Wear light, respectful clothing for temple visits.</li>
                        <li>Stay hydrated and plan shaded breaks in midday heat.</li>
                        <li>Book Tonle Sap lake visits in Oct-Dec for better water levels.</li>
                    </ul>
                </footer>
            </div>
        </main>
    );
}
