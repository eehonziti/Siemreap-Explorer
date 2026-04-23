import { StockData } from "@/types";

interface StockPanelProps {
    stocks: StockData[];
}

export default function StockPanel({ stocks }: StockPanelProps) {
    return (
        <section className="panel-rise rounded-2xl border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Market Snapshot</h2>

            <div>
                {stocks.map((stock, index) => {
                    const isPositive = Number(stock.changePercent) >= 0;

                    return (
                        <div
                            key={stock.symbol}
                            className={`flex items-center justify-between py-3 ${index !== stocks.length - 1 ? "border-b border-slate-200" : ""
                                }`}
                        >
                            <p className="font-medium text-slate-900">{stock.symbol}</p>
                            <div className="text-right">
                                <p className="text-slate-900">${stock.price}</p>
                                <p
                                    className={
                                        isPositive
                                            ? "text-sm font-medium text-green-500"
                                            : "text-sm font-medium text-red-500"
                                    }
                                >
                                    {isPositive ? "+" : ""}
                                    {stock.changePercent}%
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <p className="mt-4 text-right text-xs text-slate-400">Finnhub API</p>
        </section>
    );
}
