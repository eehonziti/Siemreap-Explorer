import Image from "next/image";
import { WeatherData } from "@/types";

interface WeatherPanelProps {
    weather: WeatherData;
}

export default function WeatherPanel({ weather }: WeatherPanelProps) {
    return (
        <section className="panel-rise rounded-2xl border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <p className="text-5xl font-bold tracking-tight text-slate-900">
                        {weather.temp}°C
                    </p>
                    <p className="capitalize text-slate-600">{weather.condition}</p>
                </div>
                <Image
                    src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                    alt={weather.condition}
                    className="h-16 w-16"
                    width={64}
                    height={64}
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Humidity</p>
                    <p className="text-lg font-semibold text-slate-900">{weather.humidity}%</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Wind speed</p>
                    <p className="text-lg font-semibold text-slate-900">{weather.windSpeed} km/h</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Feels like</p>
                    <p className="text-lg font-semibold text-slate-900">{weather.feelsLike}°C</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Country</p>
                    <p className="text-lg font-semibold text-slate-900">{weather.country}</p>
                </div>
            </div>

            <p className="mt-4 text-right text-xs text-slate-400">OpenWeatherMap API</p>
        </section>
    );
}
