// Vitest setup: define minimal import.meta.env values used in tests
// Ensures infrastructure gateway has a base URL without depending on real env
import.meta.env = {
  ...(import.meta.env || {}),
  VITE_API_BASE: 'http://api.universe.localhost'
};
