import { currentUser } from "@clerk/nextjs/server";

function getAllowedAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export function hasAdminAllowlist(): boolean {
  return getAllowedAdminEmails().length > 0;
}

export function isAdminEmail(email: string | null | undefined): boolean {
  return Boolean(
    email && getAllowedAdminEmails().includes(email.trim().toLowerCase()),
  );
}

export async function requireAdmin() {
  const user = await currentUser();
  if (!user || !isAdminEmail(user.primaryEmailAddress?.emailAddress)) {
    throw new Error("Forbidden");
  }
  return user;
}
