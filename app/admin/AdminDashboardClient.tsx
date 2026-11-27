"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  deleteBusinessListing,
  setBusinessListingApproval,
} from "@/app/actions/admin";

type RecentUser = {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  plan: string;
  generationCount: number;
};

type Listing = {
  id: string;
  name: string;
  slug: string;
  category: string;
  tag: string;
  websiteUrl: string;
  isApproved: boolean;
  isPaid: boolean;
  createdAt: string;
};

type WaitlistEntry = {
  id: string;
  email: string;
  feedback: string | null;
  source: string;
  createdAt: string;
};

type AdminDashboardClientProps = {
  recentUsers: RecentUser[] | null;
  listings: Listing[] | null;
  waitlistEntries: WaitlistEntry[] | null;
};

const tableClass =
  "min-w-full divide-y divide-white/[0.07] text-left text-sm";
const cellClass = "px-4 py-3 align-top";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AdminDashboardClient({
  recentUsers,
  listings,
  waitlistEntries,
}: AdminDashboardClientProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const filteredWaitlist = waitlistEntries?.filter((entry) => {
    const searchText =
      `${entry.email} ${entry.feedback ?? ""} ${entry.source}`.toLowerCase();
    return searchText.includes(query.trim().toLowerCase());
  });

  async function runAction(id: string, action: () => Promise<{ ok: boolean }>) {
    setBusyId(id);
    setActionError(null);
    try {
      await action();
      router.refresh();
    } catch (error) {
      console.error("[admin] listing action failed:", error);
      setActionError(
        error instanceof Error ? error.message : "The listing action failed.",
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-8">
      {actionError ? (
        <p
          aria-live="polite"
          className="rounded-xl border border-rose-400/20 bg-rose-400/[0.08] px-4 py-3 text-sm text-rose-200"
        >
          {actionError}
        </p>
      ) : null}

      <section
        aria-labelledby="users-title"
        className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.035] shadow-xl shadow-black/10"
      >
        <div className="border-b border-white/[0.07] px-5 py-4">
          <h2 className="font-semibold text-white" id="users-title">
            Recent SaaS users
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Read-only account summary. Credentials and billing identifiers are never shown.
          </p>
        </div>
        {recentUsers === null ? (
          <Unavailable />
        ) : recentUsers.length === 0 ? (
          <EmptyState>No registered accounts yet.</EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead className="text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className={cellClass}>Account</th>
                  <th className={cellClass}>Plan</th>
                  <th className={cellClass}>Generations</th>
                  <th className={cellClass}>Signed up</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05] text-slate-300">
                {recentUsers.map((user) => (
                  <tr key={user.id}>
                    <td className={cellClass}>
                      <p className="font-medium text-slate-100">
                        {user.name || "Unnamed account"}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">{user.email}</p>
                    </td>
                    <td className={cellClass}>{user.plan}</td>
                    <td className={cellClass}>{user.generationCount}</td>
                    <td className={cellClass}>{formatDate(user.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section
        aria-labelledby="listings-title"
        className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.035] shadow-xl shadow-black/10"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.07] px-5 py-4">
          <div>
            <h2 className="font-semibold text-white" id="listings-title">
              Marketplace moderation
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Review pending submissions and update approved listings.
            </p>
          </div>
          <span className="text-xs text-slate-500">
            {listings?.length ?? "—"} recent listings
          </span>
        </div>
        {listings === null ? (
          <Unavailable />
        ) : listings.length === 0 ? (
          <EmptyState>No marketplace listings to review.</EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead className="text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className={cellClass}>Business</th>
                  <th className={cellClass}>Status</th>
                  <th className={cellClass}>Submitted</th>
                  <th className={cellClass}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05] text-slate-300">
                {listings.map((listing) => (
                  <tr key={listing.id}>
                    <td className={cellClass}>
                      <p className="font-medium text-slate-100">{listing.name}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {listing.category} · {listing.tag}
                      </p>
                      <p className="mt-1 max-w-56 truncate text-xs text-slate-400">
                        {listing.websiteUrl}
                      </p>
                    </td>
                    <td className={cellClass}>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          listing.isApproved
                            ? "bg-emerald-400/10 text-emerald-200"
                            : "bg-amber-400/10 text-amber-200"
                        }`}
                      >
                        {listing.isApproved ? "Approved" : "Pending"}
                      </span>
                      <p className="mt-2 text-xs text-slate-500">
                        {listing.isPaid ? "Paid" : "Free"}
                      </p>
                    </td>
                    <td className={cellClass}>{formatDate(listing.createdAt)}</td>
                    <td className={cellClass}>
                      <div className="flex flex-wrap gap-2">
                        <button
                          className="rounded-lg border border-indigo-300/20 bg-indigo-400/10 px-2.5 py-1.5 text-xs font-medium text-indigo-100 hover:bg-indigo-400/20 disabled:opacity-50"
                          disabled={busyId === listing.id}
                          onClick={() =>
                            runAction(listing.id, () =>
                              setBusinessListingApproval(
                                listing.id,
                                !listing.isApproved,
                              ),
                            )
                          }
                          type="button"
                        >
                          {listing.isApproved ? "Unapprove" : "Approve"}
                        </button>
                        <button
                          className="rounded-lg border border-rose-300/15 px-2.5 py-1.5 text-xs font-medium text-rose-200 hover:bg-rose-400/10 disabled:opacity-50"
                          disabled={busyId === listing.id}
                          onClick={() => {
                            if (window.confirm(`Delete ${listing.name}?`)) {
                              void runAction(listing.id, () =>
                                deleteBusinessListing(listing.id),
                              );
                            }
                          }}
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section
        aria-labelledby="waitlist-title"
        className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.035] shadow-xl shadow-black/10"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-5 py-4">
          <div>
            <h2 className="font-semibold text-white" id="waitlist-title">
              Waitlist &amp; feedback
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Most recent submissions. Search email, feedback, or source.
            </p>
          </div>
          <label className="sr-only" htmlFor="waitlist-search">
            Search waitlist
          </label>
          <input
            className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-indigo-400/50 sm:max-w-64"
            id="waitlist-search"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search submissions..."
            type="search"
            value={query}
          />
        </div>
        {waitlistEntries === null ? (
          <Unavailable />
        ) : filteredWaitlist?.length === 0 ? (
          <EmptyState>
            {query ? "No submissions match your search." : "No waitlist submissions yet."}
          </EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead className="text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className={cellClass}>Email</th>
                  <th className={cellClass}>Feedback / workflow</th>
                  <th className={cellClass}>Source</th>
                  <th className={cellClass}>Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05] text-slate-300">
                {filteredWaitlist?.map((entry) => (
                  <tr key={entry.id}>
                    <td className={`${cellClass} whitespace-nowrap text-slate-100`}>
                      {entry.email}
                    </td>
                    <td className={`${cellClass} min-w-56 max-w-xl whitespace-pre-wrap text-slate-400`}>
                      {entry.feedback || "—"}
                    </td>
                    <td className={cellClass}>{entry.source}</td>
                    <td className={`${cellClass} whitespace-nowrap`}>
                      {formatDate(entry.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function EmptyState({ children }: { children: string }) {
  return <p className="px-5 py-8 text-sm text-slate-400">{children}</p>;
}

function Unavailable() {
  return (
    <p className="px-5 py-8 text-sm text-amber-200">
      Data unavailable. The table may not exist yet or the database may be offline.
    </p>
  );
}
