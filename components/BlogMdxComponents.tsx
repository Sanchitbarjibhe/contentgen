import type { ReactNode } from "react";

type CalloutProps = {
    children: ReactNode;
    title?: string;
    type?: string;
};

type ButtonProps = {
    children?: ReactNode;
    href?: string;
    buttonLink?: string;
};

type CTASectionProps = {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
};

export function Callout({ children, title, type = "info" }: CalloutProps) {
    const accent = type === "warning"
        ? "border-amber-400/40 bg-amber-400/10"
        : type === "success"
            ? "border-emerald-400/40 bg-emerald-400/10"
            : "border-purple-400/40 bg-purple-400/10";

    return (
        <aside className={`my-8 rounded-2xl border p-6 text-slate-200 ${accent}`} role="note">
            {title && <p className="mb-2 font-bold text-white">{title}</p>}
            {children}
        </aside>
    );
}

export function Button({ children, href, buttonLink }: ButtonProps) {
    const link = href || buttonLink;
    const className = "inline-flex items-center justify-center rounded-xl bg-purple-400 px-5 py-3 font-bold text-slate-950 no-underline transition hover:bg-purple-300";

    return link ? (
        <a
            href={link}
            className={className}
            target={/^https?:\/\//i.test(link) ? "_blank" : undefined}
            rel={/^https?:\/\//i.test(link) ? "noreferrer" : undefined}
        >
            {children}
        </a>
    ) : (
        <span className={className}>{children}</span>
    );
}

export function CTASection({ title, description, buttonText, buttonLink }: CTASectionProps) {
    return (
        <aside className="my-10 rounded-3xl border border-purple-400/30 bg-gradient-to-br from-purple-950 via-slate-900 to-blue-950 p-7 shadow-xl shadow-purple-950/20 sm:p-9">
            <h3 className="m-0 text-2xl font-extrabold tracking-tight text-white">{title}</h3>
            <p className="mt-3 text-slate-300">{description}</p>
            <a
                href={buttonLink}
                className="mt-3 inline-flex items-center justify-center rounded-xl bg-purple-400 px-5 py-3 font-bold text-slate-950 no-underline transition hover:bg-purple-300"
                target={/^https?:\/\//i.test(buttonLink) ? "_blank" : undefined}
                rel={/^https?:\/\//i.test(buttonLink) ? "noreferrer" : undefined}
            >
                {buttonText}
            </a>
        </aside>
    );
}

export const blogMdxComponents = {
    Button,
    Callout,
    CTASection,
    h1: ({ children }: { children?: ReactNode }) => <h2>{children}</h2>,
    h4: ({ children }: { children?: ReactNode }) => <h3>{children}</h3>,
    h5: ({ children }: { children?: ReactNode }) => <h3>{children}</h3>,
    h6: ({ children }: { children?: ReactNode }) => <h3>{children}</h3>,
};
