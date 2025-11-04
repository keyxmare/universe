// Application layer: orchestrates ping use case
import type { PingResult } from '@domain/ping';
import { pingGateway } from '@infra/pingGateway';

export async function performPing(): Promise<PingResult> {
  return pingGateway.ping();
}
