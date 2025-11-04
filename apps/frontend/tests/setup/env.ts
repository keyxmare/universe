// Vitest setup: define minimal import.meta.env values used in tests
// Ensures infrastructure gateway has a base URL without depending on real env
// Provide a basic matchMedia stub for components relying on system theme (always light).
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false
  });
}

import.meta.env = {
  ...(import.meta.env || {}),
  VITE_API_BASE: 'http://api.universe.localhost'
};
