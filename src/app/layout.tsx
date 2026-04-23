import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "City Explorer",
    description: "Search any city to see its map, weather, and markets",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
