// Infrastructure layer: HTTP gateway
import type { PingResult } from '../domain/ping';

async function ping(): Promise<PingResult> {
  const res = await fetch(`${import.meta.env.VITE_API_BASE}/ping`);
  if (!res.ok) {
    throw new Error(`Ping failed with status ${res.status}`);
  }
  const data = (await res.json()) as PingResult;
  return data;
}

export const pingGateway = { ping };
