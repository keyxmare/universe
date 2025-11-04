// Application layer: orchestrates ping use case
import type { PingResult } from '@domain/ping';
import { pingHttpGateway } from '@infra/pingGateway';

export async function executePingUseCase(): Promise<PingResult> {
  return pingHttpGateway.executePing();
}
