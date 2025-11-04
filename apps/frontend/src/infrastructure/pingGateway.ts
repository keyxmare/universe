// Infrastructure layer: HTTP gateway
import type { PingResult } from '@domain/ping';
import { apiBase } from '@infra/config';
import { HttpError } from '@infra/errors';

/**
 * Effectue un ping API.
 * @throws HttpError si le statut HTTP n'est pas OK.
 */
function buildPingEndpoint(baseApiUrl: string): string {
  return `${baseApiUrl}/ping`;
}

async function executePingRequest(url: string, signal?: AbortSignal): Promise<Response> {
  return fetch(url, { signal });
}

async function parsePingResponse(response: Response, url: string): Promise<PingResult> {
  if (!response.ok) {
    throw new HttpError(`Ping failed with status ${response.status}`, response.status, url);
  }
  return (await response.json()) as PingResult;
}

async function executePing(signal?: AbortSignal): Promise<PingResult> {
  const baseApiUrl = apiBase();
  const url = buildPingEndpoint(baseApiUrl);
  const response = await executePingRequest(url, signal);
  return parsePingResponse(response, url);
}

export const pingHttpGateway = { executePing };
