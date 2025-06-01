/**
 * Module cache to prevent unnecessarily reloading components
 */
const moduleCache = new Map();

export function getCachedModule(key, importFunc) {
  if (!moduleCache.has(key)) {
    moduleCache.set(key, importFunc().catch(err => {
      moduleCache.delete(key);
      throw err;
    }));
  }
  return moduleCache.get(key);
}