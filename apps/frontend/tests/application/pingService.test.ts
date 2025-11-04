import { describe, it, expect, vi } from 'vitest';
import { executePingUseCase } from '../../src/application/pingService';

describe('performPing use case', () => {
  it('returns domain PingResult with pong true', async () => {
    const originalFetch = global.fetch;
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ pong: true })
    }) as unknown as typeof fetch;

    const result = await executePingUseCase();
    expect(result.pong).toBe(true);

    global.fetch = originalFetch;
  });
});
