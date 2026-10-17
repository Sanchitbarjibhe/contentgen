"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/changelog", label: "What's New" },
  { href: "/audio", label: "Trending Audio" },
  { href: "/hashtag", label: "Top Hashtags" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
];

function isActiveLink(pathname: string, href: string) {
  return href === "/blog" ? pathname === href || pathname.startsWith(`${href}/`) : pathname === href;
}

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="flex items-center justify-between py-4">
          <Link
            href="/"
            className="whitespace-nowrap text-lg font-extrabold tracking-tight text-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text"
          >
            HookTos AI
          </Link>

          <nav aria-label="Main navigation" className="hidden items-center gap-6 text-sm font-semibold text-slate-300 md:flex sm:gap-8 sm:text-base">
            {links.map(({ href, label }) => {
              const active = isActiveLink(pathname, href);

              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`relative whitespace-nowrap py-2 transition-colors duration-200 hover:text-white ${
                    active
                      ? "text-white after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:rounded-full after:bg-purple-400"
                      : ""
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-lg border border-slate-700/80 text-slate-200 transition hover:border-slate-500 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400 md:hidden"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsOpen((open) => !open)}
          >
            <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              {isOpen ? (
                <path d="m6 6 12 12M18 6 6 18" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        <div
          id="mobile-navigation"
          aria-hidden={!isOpen}
          className={`overflow-hidden transition-[max-height,opacity,visibility] duration-200 ease-out md:hidden ${
            isOpen ? "visible max-h-96 opacity-100" : "invisible max-h-0 opacity-0 delay-200"
          }`}
        >
          <nav aria-label="Mobile navigation" className="flex flex-col border-t border-slate-800/60 py-2">
            {links.map(({ href, label }) => {
              const active = isActiveLink(pathname, href);

              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  tabIndex={isOpen ? 0 : -1}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-lg px-3 py-3 text-sm font-semibold transition-colors duration-200 hover:bg-slate-800/60 hover:text-white ${
                    active ? "text-purple-300" : "text-slate-300"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
