export interface WeatherData {
    temp: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    condition: string;
    icon: string;
    lat: number;
    lng: number;
    country: string;
}

export interface StockData {
    symbol: string;
    price: string;
    change: string;
    changePercent: string;
}

export interface Coords {
    lat: number;
    lng: number;
}
