"use client";

import { MapPinPlus } from "@phosphor-icons/react/dist/ssr";
import { FormEvent, useState } from "react";
import { IconTile } from "@/components/IconTile";
import { trackEvent } from "@/lib/analytics";

const STORAGE_KEY = "before-you-land:requested-cities";

export function CityRequestForm({ source }: { source: string }) {
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const requestedCity = city.trim();
    if (!requestedCity) return;

    const saved = readStoredCities();
    const nextCities = [...saved, requestedCity];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextCities));
    trackEvent("city_requested", { source, city: requestedCity });

    setCity("");
    setMessage("Request saved.");
  }

  return (
    <section className="no-print rounded-[1.75rem] bg-paper p-5 shadow-card sm:p-6">
      <div className="flex items-start gap-3">
        <IconTile icon={MapPinPlus} tone="blue" />
        <div>
          <h2 className="text-xl font-black tracking-normal text-ink">Request a destination</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Tell us which arrival checklist should come next.
          </p>
        </div>
      </div>

      <form className="mt-5 flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor={`city-${source}`}>
          Request a city
        </label>
        <input
          className="min-h-12 flex-1 rounded-full bg-linen px-4 text-sm font-semibold text-ink outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-pine/10"
          id={`city-${source}`}
          onChange={(event) => setCity(event.target.value)}
          placeholder="Request a city"
          required
          type="text"
          value={city}
        />
        <button
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-ink px-5 text-sm font-black text-white shadow-tile transition hover:bg-pine"
          type="submit"
        >
          Submit
        </button>
      </form>

      {message ? <p className="mt-3 text-sm font-black text-pine">{message}</p> : null}
    </section>
  );
}

function readStoredCities() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}
