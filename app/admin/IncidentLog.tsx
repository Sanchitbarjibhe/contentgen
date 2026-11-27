"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  createAdminIncident,
  resolveAdminIncident,
} from "@/app/actions/admin-incidents";
import type { AdminIncidentRecord } from "@/lib/admin-incidents";

export default function IncidentLog({
  incidents,
}: {
  incidents: AdminIncidentRecord[] | null;
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitIncident(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await createAdminIncident({ title, details });
      setTitle("");
      setDetails("");
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Could not save this incident.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function resolveIncident(id: string) {
    setBusy(true);
    setError(null);
    try {
      await resolveAdminIncident(id);
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Could not resolve this incident.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 shadow-xl shadow-black/10">
      <div>
        <h2 className="font-semibold text-white">Site issues &amp; incident log</h2>
        <p className="mt-1 text-xs leading-5 text-slate-400">
          Manual operational notes are stored in the AdminIncident database table.
          External outage alerts require an uptime monitor to ping /api/health.
        </p>
      </div>

      {error ? (
        <p aria-live="polite" className="mt-4 text-sm text-rose-200">
          {error}
        </p>
      ) : null}

      <form className="mt-5 grid gap-3 md:grid-cols-[1fr_2fr_auto]" onSubmit={submitIncident}>
        <label className="sr-only" htmlFor="incident-title">
          Incident title
        </label>
        <input
          className="min-w-0 rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 disabled:opacity-50"
          disabled={busy || incidents === null}
          id="incident-title"
          maxLength={120}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Issue title"
          required
          value={title}
        />
        <label className="sr-only" htmlFor="incident-details">
          Incident details
        </label>
        <input
          className="min-w-0 rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 disabled:opacity-50"
          disabled={busy || incidents === null}
          id="incident-details"
          maxLength={2000}
          onChange={(event) => setDetails(event.target.value)}
          placeholder="Context or follow-up note (optional)"
          value={details}
        />
        <button
          className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={busy || incidents === null || !title.trim()}
          type="submit"
        >
          Log issue
        </button>
      </form>

      {incidents === null ? (
        <p className="mt-4 rounded-lg border border-amber-300/10 bg-amber-400/[0.06] px-3 py-2 text-sm text-amber-100">
          Incident storage is unavailable. Apply the Prisma schema with{" "}
          <code>npx prisma db push</code> to enable logging.
        </p>
      ) : incidents.length === 0 ? (
        <p className="mt-5 text-sm text-slate-400">No incidents have been logged.</p>
      ) : (
        <ul className="mt-5 divide-y divide-white/[0.07]">
          {incidents.map((incident) => (
            <li
              className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between"
              key={incident.id}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-medium text-slate-100">{incident.title}</h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] ${
                      incident.status === "OPEN"
                        ? "bg-amber-400/10 text-amber-200"
                        : "bg-emerald-400/10 text-emerald-200"
                    }`}
                  >
                    {incident.status === "OPEN" ? "Open" : "Resolved"}
                  </span>
                </div>
                {incident.details ? (
                  <p className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-400">
                    {incident.details}
                  </p>
                ) : null}
                <p className="mt-2 text-xs text-slate-500">
                  Logged {new Date(incident.createdAt).toLocaleString()}
                  {incident.resolvedAt
                    ? ` · Resolved ${new Date(incident.resolvedAt).toLocaleString()}`
                    : ""}
                </p>
              </div>
              {incident.status === "OPEN" ? (
                <button
                  className="self-start rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 transition hover:border-emerald-300/30 hover:text-emerald-200 disabled:opacity-50"
                  disabled={busy}
                  onClick={() => void resolveIncident(incident.id)}
                  type="button"
                >
                  Resolve
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
