"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import Link from "next/link";
import {
  RESOURCE_CATEGORY_LABELS,
  isPersistedCreatorResource,
  type CreatorResource,
  type ResourceCardData,
  type ResourceCategory,
} from "@/data/resources";
import ResourceCard from "@/components/resources/ResourceCard";

type ResourceFilter = "all" | ResourceCategory;

const filters: { value: ResourceFilter; label: string }[] = [
  { value: "all", label: "All Resources" },
  { value: "swipe-files", label: "📚 Swipe Files" },
  { value: "prompt-packs", label: "⚡ Prompt Packs" },
  { value: "checklists", label: "✅ Checklists" },
  { value: "templates", label: "📝 Templates" },
];

export default function ResourceHub({
  resources: initialResources,
}: {
  resources: CreatorResource[];
}) {
  const [activeFilter, setActiveFilter] = useState<ResourceFilter>("all");
  const [query, setQuery] = useState("");
  const [resourceItems, setResourceItems] =
    useState<ResourceCardData[]>(initialResources);

  useEffect(() => {
    const controller = new AbortController();
    function syncLikeState(event: Event) {
      if (!(event instanceof CustomEvent)) return;
      const detail: unknown = event.detail;
      if (
        typeof detail !== "object" ||
        detail === null ||
        !("resourceId" in detail) ||
        typeof detail.resourceId !== "string" ||
        !("likesCount" in detail) ||
        typeof detail.likesCount !== "number" ||
        !("liked" in detail) ||
        typeof detail.liked !== "boolean"
      ) {
        return;
      }

      const { resourceId, likesCount, liked } = detail;
      setResourceItems((current) =>
        current.map((resource) =>
          resource.id === resourceId
            ? { ...resource, likesCount, liked }
            : resource,
        ),
      );
    }

    window.addEventListener("resource-like-updated", syncLikeState);

    void fetch("/api/resources", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Resource request failed with status ${response.status}.`);
        }
        const payload: unknown = await response.json();
        if (
          typeof payload !== "object" ||
          payload === null ||
          !("data" in payload) ||
          !Array.isArray(payload.data) ||
          !payload.data.every(isPersistedCreatorResource)
        ) {
          throw new Error("Resource response has an invalid shape.");
        }
        if (!controller.signal.aborted) {
          setResourceItems(payload.data);
        }
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        console.error("[resources] unable to load database resources; using local data:", error);
      });

    return () => {
      controller.abort();
      window.removeEventListener("resource-like-updated", syncLikeState);
    };
  }, []);

  const visibleResources = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return resourceItems.filter((resource) => {
      const matchesCategory =
        activeFilter === "all" || resource.category === activeFilter;
      const searchableContent = [
        resource.title,
        resource.description,
        RESOURCE_CATEGORY_LABELS[resource.category],
        resource.platforms.join(" "),
        resource.niches.join(" "),
        resource.category === "swipe-files"
          ? resource.hook
          : resource.category === "prompt-packs"
            ? resource.prompt
            : resource.category === "checklists"
              ? resource.items.join(" ")
              : resource.content,
      ]
        .join(" ")
        .toLowerCase();

      return (
        matchesCategory &&
        (!normalizedQuery || searchableContent.includes(normalizedQuery))
      );
    });
  }, [activeFilter, query, resourceItems]);

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#0d1021] px-4 pb-20 pt-10 text-slate-100 sm:px-6 sm:pt-16 lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/4 size-[28rem] rounded-full bg-indigo-600/15 blur-[130px]" />
        <div className="absolute right-[-12rem] top-[35rem] size-[26rem] rounded-full bg-emerald-500/10 blur-[130px]" />
      </div>

      <div className="mx-auto max-w-7xl">
        <header className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/[0.08] px-3 py-1.5 text-xs font-semibold tracking-wide text-indigo-200">
            <Sparkles aria-hidden="true" className="size-3.5" />
            THE CREATOR TOOLKIT
          </span>
          <h1 className="mt-5 text-balance text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Creator Resource Hub &amp; Swipe Files
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
            Proven viral hook checklists, ChatGPT prompt packs, and ready-to-use
            script templates
          </p>
          <p className="mt-3 text-sm text-slate-400">
            Need examples?{" "}
            <Link
              className="font-semibold text-indigo-300 underline decoration-indigo-400/50 underline-offset-4 hover:text-white"
              href="/blog/10-viral-hooks-for-reels"
            >
              Explore Instagram Reels hook ideas and examples
            </Link>
            .
          </p>
        </header>

        <section aria-label="Browse creator resources" className="mt-9 sm:mt-12">
          <div className="mx-auto max-w-3xl">
            <label className="sr-only" htmlFor="resource-search">
              Search resources or platforms
            </label>
            <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-700/80 bg-slate-900/60 px-4 shadow-lg shadow-black/10 backdrop-blur-xl focus-within:border-indigo-400/60 focus-within:ring-2 focus-within:ring-indigo-500/20">
              <Search aria-hidden="true" className="size-5 shrink-0 text-slate-400" />
              <input
                autoComplete="off"
                className="min-h-14 min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-slate-500 sm:text-base"
                id="resource-search"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search hooks, templates, TikTok, Reels..."
                type="search"
                value={query}
              />
            </div>
          </div>

          <div
            aria-label="Resource categories"
            className="mt-5 flex flex-wrap justify-center gap-2"
            role="group"
          >
            {filters.map((filter) => {
              const isActive = activeFilter === filter.value;
              return (
                <button
                  key={filter.value}
                  aria-pressed={isActive}
                  className={`min-h-10 rounded-full border px-3.5 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm ${
                    isActive
                      ? "border-indigo-400/50 bg-indigo-500/20 text-indigo-100"
                      : "border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-500 hover:text-white"
                  }`}
                  onClick={() => setActiveFilter(filter.value)}
                  type="button"
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </section>

        <section
          aria-label="Creator resources"
          aria-live="polite"
          className="mt-8 grid min-w-0 gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visibleResources.map((resource) => (
            <ResourceCard key={`${resource.category}-${resource.slug}`} resource={resource} />
          ))}
        </section>

        {visibleResources.length === 0 && (
          <p className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center text-sm text-slate-400">
            No resources match that search. Try another keyword or platform.
          </p>
        )}

        <p className="mt-8 text-center text-xs text-slate-500">
          {visibleResources.length} of {resourceItems.length} resources
        </p>
      </div>
    </main>
  );
}
