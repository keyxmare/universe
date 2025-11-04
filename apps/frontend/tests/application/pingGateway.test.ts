import { describe, it, expect, vi, beforeEach } from 'vitest';
import { pingGateway } from '../../src/infrastructure/pingGateway';
import { HttpError } from '../../src/infrastructure/errors';

const API_BASE = 'http://api';
vi.stubGlobal('importMeta', { env: { VITE_API_BASE: API_BASE } });

describe('pingGateway', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  it('retourne les données quand OK', async () => {
    const mock = { pong: true };
    // @ts-expect-error mock fetch
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(mock) });
    const res = await pingGateway.ping();
    expect(res).toEqual(mock);
  });
  it('lève HttpError sur statut non OK', async () => {
    // @ts-expect-error mock fetch
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 });
    await expect(pingGateway.ping()).rejects.toBeInstanceOf(HttpError);
  });
});
