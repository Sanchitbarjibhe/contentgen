import { redirect } from "next/navigation";

interface DirectoryAliasProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function DirectoryAlias({
  searchParams,
}: DirectoryAliasProps) {
  const values = await searchParams;
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(values)) {
    if (Array.isArray(value)) {
      for (const item of value) query.append(key, item);
    } else if (value !== undefined) {
      query.set(key, value);
    }
  }

  redirect(`/marketplace${query.size > 0 ? `?${query.toString()}` : ""}`);
}
