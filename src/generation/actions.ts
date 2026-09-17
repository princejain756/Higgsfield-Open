"use server";

import { cookies } from "next/headers";

import { getModel, parseSettings } from "./catalog";
import type { GenerationPlane } from "./catalog/types";
import {
  MissingCredentialsError,
  PLATFORM_KEY_COOKIE,
  PLATFORM_KEY_COOKIE_OPTIONS,
  decodeCredentials,
  encodeCredentials,
  parseCredentialInput,
} from "./credentials";
import { PlatformError, createPlatformClient, type QueuedGeneration, type StatusResult } from "./platform";
import { toPlatform } from "./to-platform";

export type SubmitResult =
  | ({ ok: true } & QueuedGeneration)
  | { ok: false; error: string; status?: number; requiresKey?: boolean };

export async function savePlatformCredentials(data: unknown): Promise<{ ok: boolean; error?: string }> {
  try {
    const { apiKey } = parseCredentialInput(data);
    const jar = await cookies();
    jar.set(PLATFORM_KEY_COOKIE, encodeCredentials(apiKey), PLATFORM_KEY_COOKIE_OPTIONS);
    return { ok: true };
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : "Invalid API key format";
    return { ok: false, error: message };
  }
}

export async function clearPlatformCredentials() {
  const jar = await cookies();
  jar.set(PLATFORM_KEY_COOKIE, "", { ...PLATFORM_KEY_COOKIE_OPTIONS, maxAge: 0 });
}

export async function hasPlatformCredentials() {
  return (await readStoredCredentials()) !== null;
}

export async function submitGeneration(plane: GenerationPlane): Promise<SubmitResult> {
  try {
    const model = getModel(plane.model);
    const parsed: GenerationPlane = {
      ...plane,
      settings: parseSettings(model, plane.settings),
    };
    const { path, body } = toPlatform(parsed);
    const creds = await readCredentials();
    const queued = await createPlatformClient(creds).submit(path, body);
    return { ok: true, ...queued };
  } catch (caught) {
    if (caught instanceof MissingCredentialsError) {
      return { ok: false, error: "Missing platform key", requiresKey: true };
    }
    if (caught instanceof PlatformError) {
      const status = caught.status;
      const requiresKey = status === 401 || status === 403;
      return {
        ok: false,
        error: caught.message,
        status,
        requiresKey,
      };
    }
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "Generation failed",
    };
  }
}

/** Every request in flight, answered in one round trip. Next dispatches server
    actions one at a time per client, so a poll per run would queue ahead of the
    next submit — the fan-out belongs on this side of the call, where it is
    genuinely parallel. */
export async function getGenerationStatuses(data: unknown): Promise<StatusResult[]> {
  let requestIds: string[];
  try {
    requestIds = parseRequestIds(data);
  } catch {
    return [];
  }

  let client;
  try {
    client = createPlatformClient(await readCredentials());
  } catch (caught) {
    if (caught instanceof MissingCredentialsError) {
      return requestIds.map((requestId) => ({
        requestId,
        error: "Missing platform key",
      }));
    }
    const message = caught instanceof Error ? caught.message : String(caught);
    return requestIds.map((requestId) => ({
      requestId,
      error: message,
    }));
  }

  return Promise.all(
    requestIds.map(async (requestId): Promise<StatusResult> => {
      try {
        return { requestId, status: await client.status(requestId) };
      } catch (caught) {
        return { requestId, error: caught instanceof Error ? caught.message : String(caught) };
      }
    }),
  );
}

async function readStoredCredentials() {
  const jar = await cookies();
  return decodeCredentials(jar.get(PLATFORM_KEY_COOKIE)?.value);
}

async function readCredentials() {
  const stored = await readStoredCredentials();
  if (!stored) throw new MissingCredentialsError();
  const baseUrl = process.env.HF_API_BASE_URL;
  if (!baseUrl) throw new Error("Missing HF_API_BASE_URL");
  return { ...stored, baseUrl };
}

function parseRequestIds(data: unknown): string[] {
  const payload = asObject(data, "Invalid status payload");
  const requestIds = payload.requestIds;
  if (!Array.isArray(requestIds) || requestIds.length === 0) {
    throw new Error("Invalid request ids");
  }
  return requestIds.map((requestId) => {
    if (typeof requestId !== "string" || !requestId) throw new Error("Invalid request id");
    return requestId;
  });
}

function asObject(data: unknown, message: string): Record<string, unknown> {
  if (data === null || typeof data !== "object" || Array.isArray(data)) throw new Error(message);
  return data as Record<string, unknown>;
}
