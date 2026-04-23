"use client";

import { useState } from "react";

interface SearchBarProps {
    onSearch: (city: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [input, setInput] = useState<string>("");

    const submitSearch = (): void => {
        const city = input.trim();
        if (city) {
            onSearch(city);
        }
    };

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                    if (event.key === "Enter") {
                        submitSearch();
                    }
                }}
                placeholder="Enter a city"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
            />
            <button
                type="button"
                onClick={submitSearch}
                className="rounded-xl bg-cyan-700 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-cyan-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            >
                Search
            </button>
        </div>
    );
}
