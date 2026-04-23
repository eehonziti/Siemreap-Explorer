"use client";

import React, { useEffect, useRef } from "react";

interface MapPanelProps {
    lat: number;
    lng: number;
    cityName: string;
}

export default function MapPanel({ lat, lng, cityName }: MapPanelProps) {
    const mapRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null!);
    const instanceRef: React.MutableRefObject<import("leaflet").Map | null> =
        useRef<import("leaflet").Map | null>(null);
    const markerRef: React.MutableRefObject<import("leaflet").Marker | null> =
        useRef<import("leaflet").Marker | null>(null);

    useEffect(() => {
        let isCancelled = false;

        const setupMap = async (): Promise<void> => {
            await import("leaflet/dist/leaflet.css");
            const L = await import("leaflet");

            if (isCancelled || !mapRef.current) {
                return;
            }

            delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl:
                    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            });

            if (!instanceRef.current) {
                instanceRef.current = L.map(mapRef.current).setView([lat, lng], 11);

                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    attribution: "&copy; OpenStreetMap contributors",
                }).addTo(instanceRef.current);
            } else {
                instanceRef.current.setView([lat, lng], 11);
            }

            if (markerRef.current) {
                markerRef.current.remove();
            }

            markerRef.current = L.marker([lat, lng])
                .addTo(instanceRef.current)
                .bindPopup(cityName)
                .openPopup();
        };

        void setupMap();

        return () => {
            isCancelled = true;
        };
    }, [lat, lng, cityName]);

    useEffect(() => {
        return () => {
            markerRef.current = null;
            if (instanceRef.current) {
                instanceRef.current.remove();
                instanceRef.current = null;
            }
        };
    }, []);

    return (
        <div className="overflow-hidden rounded-2xl border border-white/70 bg-white/80 p-2 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
            <div ref={mapRef} style={{ height: "320px", width: "100%" }} />
        </div>
    );
}
