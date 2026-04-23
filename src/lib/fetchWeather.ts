import { WeatherData } from "@/types";

export async function fetchWeather(city: string): Promise<WeatherData> {
    const key = process.env.NEXT_PUBLIC_OPENWEATHER_KEY?.trim();

    if (!key || key === "your_openweather_key_here") {
        throw new Error("OpenWeather API key is missing. Add NEXT_PUBLIC_OPENWEATHER_KEY in .env.local.");
    }

    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${key}&units=metric`
    );

    if (!response.ok) {
        let message = "City not found";

        try {
            const errorData = (await response.json()) as { message?: string };

            if (response.status === 401) {
                message = "OpenWeather API key is invalid or inactive.";
            } else if (errorData.message) {
                message = errorData.message;
            }
        } catch {
            if (response.status === 401) {
                message = "OpenWeather API key is invalid or inactive.";
            }
        }

        throw new Error(message);
    }

    const data = await response.json();

    return {
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6),
        condition: data.weather[0].description,
        icon: data.weather[0].icon,
        lat: data.coord.lat,
        lng: data.coord.lon,
        country: data.sys.country,
    };
}
