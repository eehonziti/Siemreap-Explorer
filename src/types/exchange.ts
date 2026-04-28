export interface ExchangeApiResponse {
    result: string;
    time_last_update_utc: string;
    conversion_rates: Record<string, number>;
}
