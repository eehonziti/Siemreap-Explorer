import { NextResponse } from "next/server";
import type { WeatherApiResponse } from "@/types/weather";

const WEATHER_URL =
    "https://api.open-meteo.com/v1/forecast?latitude=11.5564&longitude=104.9282&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code";

export async function GET() {
    try {
        // Open-Meteo integration: fetch live current weather snapshot for display.
        const response = await fetch(WEATHER_URL, {
            next: { revalidate: 1800 },
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: "Unable to fetch weather data right now." },
                { status: response.status }
            );
        }

        const data = (await response.json()) as WeatherApiResponse;
        return NextResponse.json(data);
    } catch {
        return NextResponse.json(
            { error: "Weather service is temporarily unavailable. Please try again later." },
            { status: 500 }
        );
    }
}
