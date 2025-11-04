// Centralisation de la configuration runtime
// Valide et expose les variables requises pour l'infrastructure.

function required(key: string, value: string | undefined): string {
  if (!value) throw new Error(`Variable d'environnement manquante: ${key}`);
  return value;
}

export function apiBase(): string {
  const base = import.meta.environment?.VITE_API_BASE;
  if (!base) {
    // Fallback silencieux en environnement de test pour éviter échec global
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
      return 'http://api.test';
    }
    return required('VITE_API_BASE', base);
  }
  return base;
}
