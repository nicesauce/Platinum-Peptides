import { cookies } from "next/headers";
import { createHmac } from "crypto";

const COOKIE_NAME = "pp_admin";

function expectedToken(): string {
  const password = process.env.ADMIN_PASSWORD ?? "";
  const secret = process.env.ADMIN_SECRET ?? "fallback-secret";
  return createHmac("sha256", secret).update(password).digest("hex");
}

export function checkPassword(password: string): boolean {
  const real = process.env.ADMIN_PASSWORD ?? "";
  if (!real) return false;
  // constant-time-ish compare
  if (password.length !== real.length) return false;
  let diff = 0;
  for (let i = 0; i < real.length; i++) {
    diff |= password.charCodeAt(i) ^ real.charCodeAt(i);
  }
  return diff === 0;
}

export function makeSessionValue(): string {
  return expectedToken();
}

export const ADMIN_COOKIE = COOKIE_NAME;

/** Read-side check used in server components / API routes. */
export function isAdminRequest(): boolean {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return false;
  return token === expectedToken();
}
