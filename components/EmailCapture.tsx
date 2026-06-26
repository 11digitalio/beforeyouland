"use client";

import { BellRinging } from "@phosphor-icons/react/dist/ssr";
import { FormEvent, useState } from "react";
import { IconTile } from "@/components/IconTile";
import { trackEvent } from "@/lib/analytics";

const STORAGE_KEY = "before-you-land:email-signups";

export function EmailCapture({ source }: { source: string }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) return;

    const saved = readStoredEmails();
    const nextEmails = Array.from(new Set([...saved, trimmedEmail]));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextEmails));
    trackEvent("email_submitted", { source, total: nextEmails.length });

    setEmail("");
    setMessage("You are on the list.");
  }

  return (
    <section className="no-print rounded-[1.75rem] bg-paper p-5 shadow-card sm:p-6">
      <div className="flex max-w-xl items-start gap-3">
        <IconTile icon={BellRinging} tone="orange" />
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-clay">Updates</p>
          <h2 className="mt-1 text-2xl font-black tracking-normal text-ink">Want more cities?</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Get notified when new arrival checklists launch.
          </p>
        </div>
      </div>

      <form className="mt-5 flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor={`email-${source}`}>
          Email
        </label>
        <input
          className="min-h-12 flex-1 rounded-full bg-linen px-4 text-sm font-semibold text-ink outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-pine/10"
          id={`email-${source}`}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
          type="email"
          value={email}
        />
        <button
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-pine px-5 text-sm font-black text-white shadow-tile transition hover:bg-ink"
          type="submit"
        >
          Notify me
        </button>
      </form>

      {message ? <p className="mt-3 text-sm font-black text-pine">{message}</p> : null}
    </section>
  );
}

function readStoredEmails() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}
