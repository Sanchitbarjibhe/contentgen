import Link from "next/link";

export default function RelatedLinks({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <nav aria-label={title} className="mt-12 rounded-xl border border-slate-800 p-6">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="underline underline-offset-4 text-purple-300 hover:text-purple-200"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
