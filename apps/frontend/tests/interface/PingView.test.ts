import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import PingView from '../../src/interface/views/PingView.vue';

// Simple fetch mock helper
async function flushPromises() { await new Promise(r => setTimeout(r, 0)); }
function mockFetchOnce(data: unknown, ok = true, status = 200) {
  (globalThis.fetch as unknown as vi.Mock).mockResolvedValueOnce({
    ok,
    status,
    json: async () => data
  });
}

describe('PingView', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  it('performs ping and displays result', async () => {
    mockFetchOnce({ pong: true });
    const wrapper = mount(PingView);

    const button = wrapper.get('button');
    await button.trigger('click');

    await flushPromises();
    await wrapper.vm.$nextTick();

    expect(globalThis.fetch).toHaveBeenCalledWith(`${import.meta.env.VITE_API_BASE}/ping`);
    const pre = wrapper.get('pre');
    expect(pre.text()).toContain('"pong": true');
  });

  it('shows error on failed ping', async () => {
    mockFetchOnce({ message: 'fail' }, false, 500);
    const wrapper = mount(PingView);
    const button = wrapper.get('button');
    await button.trigger('click');
    await flushPromises();
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Ping failed with status 500');
  });
});
