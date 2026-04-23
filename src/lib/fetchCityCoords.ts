import { Coords } from "@/types";

interface NominatimResult {
    lat: string;
    lon: string;
}

export async function fetchCityCoords(city: string): Promise<Coords> {
    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(city)}`,
        {
            headers: {
                Accept: "application/json",
            },
        }
    );

    if (!response.ok) {
        throw new Error("Unable to look up this city right now.");
    }

    const data = (await response.json()) as NominatimResult[];

    if (!Array.isArray(data) || data.length === 0) {
        throw new Error("City not found. Try a more specific name.");
    }

    const lat = Number(data[0].lat);
    const lng = Number(data[0].lon);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        throw new Error("Could not read city coordinates from search result.");
    }

    return { lat, lng };
}
