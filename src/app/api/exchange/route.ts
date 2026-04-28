import { NextResponse } from "next/server";
import type { ExchangeApiResponse } from "@/types/exchange";

export async function GET() {
    const apiKey = process.env.EXCHANGE_API_KEY;
    if (!apiKey) {
        return NextResponse.json(
            { error: "Exchange service is not configured. Please set EXCHANGE_API_KEY in .env." },
            { status: 500 }
        );
    }

    try {
        // ExchangeRate-API integration: fetch latest USD base rates in real-time (no cache).
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`, {
            cache: "no-store",
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: "Unable to fetch exchange rates right now." },
                { status: response.status }
            );
        }

        const data = (await response.json()) as ExchangeApiResponse;
        return NextResponse.json(data);
    } catch {
        return NextResponse.json(
            { error: "Exchange service is temporarily unavailable. Please try again later." },
            { status: 500 }
        );
    }
}
