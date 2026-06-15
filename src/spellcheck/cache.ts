export const spellCache =
    new Map<string, boolean>();

export const suggestionCache =
    new Map<string, string[]>();

const MAX_CACHE_SIZE = 5000;

export function trimCache<K, V>(cache: Map<K, V>) {
    if (cache.size >= MAX_CACHE_SIZE) {
        const firstKey = cache.keys().next().value;

        if (firstKey !== undefined) {
            cache.delete(firstKey);
        }
    }
}