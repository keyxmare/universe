// Infrastructure layer: HTTP gateway
import type { PingResult } from '@domain/ping';
import { apiBase } from '@infra/config';
import { HttpError } from '@infra/errors';

/**
 * Effectue un ping API.
 * @throws HttpError si le statut HTTP n'est pas OK.
 */
async function ping(signal?: AbortSignal): Promise<PingResult> {
  const url = `${apiBase()}/ping`;
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new HttpError(`Ping failed with status ${res.status}`, res.status, url);
  }
  const data = (await res.json()) as PingResult;
  return data;
}

export const pingGateway = { ping };
