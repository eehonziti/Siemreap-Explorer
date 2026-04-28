import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-heading",
});

const sourceSans = Source_Sans_3({
    subsets: ["latin"],
    variable: "--font-body",
});

export const metadata: Metadata = {
    title: "Siem Reap Tourism Website",
    description: "Discover weather, maps, and live exchange rates for Siem Reap",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${playfair.variable} ${sourceSans.variable}`}>{children}</body>
        </html>
    );
}
