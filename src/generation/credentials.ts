export const PLATFORM_KEY_COOKIE = "api_key";

export const PLATFORM_KEY_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

export class MissingCredentialsError extends Error {
  constructor() {
    super("Missing platform key");
    this.name = "MissingCredentialsError";
  }
}

export function encodeCredentials(apiKey: string): string {
  return JSON.stringify({ apiKey });
}

export function decodeCredentials(raw: string | undefined): { apiKey: string } | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    const apiKey = (parsed as { apiKey?: unknown }).apiKey;
    if (typeof apiKey !== "string" || !apiKey.trim()) return null;
    return { apiKey: apiKey.trim() };
  } catch {
    return null;
  }
}

export function parseCredentialInput(data: unknown): { apiKey: string } {
  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("Enter your API credentials");
  }
  const record = data as {
    apiKey?: unknown;
    api_key?: unknown;
    keyId?: unknown;
    key_id?: unknown;
    secretKey?: unknown;
    secret_key?: unknown;
  };

  const rawKey = record.apiKey ?? record.api_key;
  const rawId = record.keyId ?? record.key_id;
  const rawSecret = record.secretKey ?? record.secret_key;

  if (typeof rawId === "string" || typeof rawSecret === "string") {
    let id = typeof rawId === "string" ? rawId.trim() : "";
    let secret = typeof rawSecret === "string" ? rawSecret.trim() : "";

    id = id.replace(/^(key|bearer)\s+/i, "");
    secret = secret.replace(/^(key|bearer)\s+/i, "");

    if (id.includes(":")) {
      const parts = id.split(":");
      if (parts.length > 2) {
        throw new Error("That doesn’t look like a Key ID and Secret Key pair. Paste the Key ID and Secret Key separately.");
      }
      id = parts[0].trim();
      secret = parts[1].trim();
    }

    if (!id) throw new Error("Enter your Key ID");
    if (!secret) throw new Error("Paste your Secret Key too.");
    if (!/^\S+$/.test(id)) throw new Error("Key ID must not contain spaces or line breaks");
    if (!/^\S+$/.test(secret)) throw new Error("Secret Key must not contain spaces or line breaks");

    return { apiKey: `${id}:${secret}` };
  }

  if (typeof rawKey === "string") {
    const trimmed = rawKey.trim().replace(/^(key|bearer)\s+/i, "");
    if (!trimmed) throw new Error("Enter an API key");
    if (!/^\S+$/.test(trimmed)) throw new Error("API key must not contain spaces or line breaks");
    return { apiKey: trimmed };
  }

  throw new Error("Enter your Key ID and Secret Key");
}

export function toAuthorizationHeader(apiKey: string): string {
  const trimmed = apiKey.trim();
  if (/^(key|bearer) /i.test(trimmed)) {
    return trimmed;
  }
  return `Key ${trimmed}`;
}
