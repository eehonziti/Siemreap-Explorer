import { StockData } from "@/types";

export async function fetchStocks(): Promise<StockData[]> {
    const key = process.env.NEXT_PUBLIC_FINNHUB_KEY?.trim();

    if (!key || key === "your_finnhub_key_here") {
        throw new Error("Finnhub API key is missing. Add NEXT_PUBLIC_FINNHUB_KEY in .env.local.");
    }

    const symbols = ["AAPL", "TSLA", "GOOGL", "AMZN", "MSFT"];

    const stocks = await Promise.all(
        symbols.map(async (symbol): Promise<StockData> => {
            const response = await fetch(
                `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${key}`
            );

            if (!response.ok) {
                let message = "Failed to fetch stock data.";

                try {
                    const errorData = (await response.json()) as { error?: string };

                    if (response.status === 401) {
                        message = "Finnhub API key is invalid or inactive.";
                    } else if (errorData.error) {
                        message = errorData.error;
                    }
                } catch {
                    if (response.status === 401) {
                        message = "Finnhub API key is invalid or inactive.";
                    }
                }

                throw new Error(message);
            }

            const data = (await response.json()) as {
                c?: number;
                d?: number;
                dp?: number;
            };

            const priceValue = typeof data.c === "number" ? data.c : 0;
            const changeValue = typeof data.d === "number" ? data.d : 0;
            const percentValue = typeof data.dp === "number" ? data.dp : 0;

            return {
                symbol,
                price: priceValue.toFixed(2),
                change: changeValue.toFixed(2),
                changePercent: percentValue.toFixed(2),
            };
        })
    );

    return stocks;
}
