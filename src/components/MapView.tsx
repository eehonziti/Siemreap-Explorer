"use client";

import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const places = [
    {
        name: "Angkor Wat",
        lat: 13.4125,
        lng: 103.867,
        tip: "Arrive before sunrise for best views",
    },
    {
        name: "Bayon Temple",
        lat: 13.4414,
        lng: 103.8593,
        tip: "Look for the 216 stone faces",
    },
    {
        name: "Pub Street",
        lat: 13.3622,
        lng: 103.8597,
        tip: "Best nightlife in Siem Reap",
    },
    {
        name: "Old Market",
        lat: 13.3608,
        lng: 103.8561,
        tip: "Great for souvenirs & street food",
    },
    {
        name: "Tonle Sap Lake",
        lat: 13.1,
        lng: 103.8667,
        tip: "Best visited Oct-Dec",
    },
    {
        name: "Ta Prohm Temple",
        lat: 13.435,
        lng: 103.8893,
        tip: "The Tomb Raider temple",
    },
];

interface MapViewProps {
    heightClassName?: string;
}

export default function MapView({ heightClassName = "h-[500px]" }: MapViewProps) {
    useEffect(() => {
        // Fix Leaflet default marker icons in Next.js by explicitly setting image URLs.
        delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
            iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });
    }, []);

    return (
        <div className={`overflow-hidden rounded-2xl border border-[var(--gold)]/40 shadow-lg ${heightClassName}`}>
            <MapContainer
                center={[13.3633, 103.8564]}
                zoom={13}
                scrollWheelZoom={true}
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {places.map((place) => (
                    <Marker key={place.name} position={[place.lat, place.lng]}>
                        <Popup>
                            <strong>{place.name}</strong>
                            <br />
                            {place.tip}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
