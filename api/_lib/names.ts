// Matching a hotel across sites by name, where each site spells it slightly differently.

// Words too common in hotel names to tell two places apart.
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'by', 'of', 'at', 'on', 'in', 'hotel', 'hotels', 'guest', 'house', 'guesthouse',
  'lodge', 'spa', 'resort', 'apartments', 'apartment', 'suites', 'boutique', 'villa', 'villas', 'bnb',
  'self', 'catering', 'cape', 'town', 'south', 'africa', 'managed', 'collection',
]);

function nameTokens(name: string): string[] {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’`]/g, '')
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}

// True when the Tripadvisor listing title names the same place as Google.
// "Cape Grace - A Fairmont Managed Hotel" matches "Cape Grace";
// "Tintswalo Atlantic" does not match "Tintswalo Safari Lodge".
export function sameBusiness(googleName: string, listingTitle: string): boolean {
  const a = nameTokens(googleName);
  const b = new Set(nameTokens(listingTitle));
  if (!a.length || !b.size) return false;
  const shared = a.filter((t) => b.has(t));
  if (!shared.length) return false;
  if (shared.length === 1 && shared[0].length < 4) return false;
  return shared.length / Math.min(a.length, b.size) >= 0.6;
}

// Afrikaans names Google sometimes uses in addresses.
const CITY_NAMES: Record<string, string> = { kaapstad: 'Cape Town' };

// The town or city, which narrows a search without pulling in nearby places:
// "Chapmans Peak Dr, Hout Bay, 7806" -> "Hout Bay";
// "Silo Square, Victoria & Alfred Waterfront, Cape Town, 8001" -> "Cape Town"
// (the neighbourhood would also match the Victoria & Alfred Hotel).
export function townFromAddress(address: string): string | undefined {
  const parts = address.split(',').map((p) => p.trim()).filter(Boolean);
  const places = parts.slice(parts.length > 2 ? 1 : 0).filter((p) => !/\d{4}/.test(p) && !/south africa/i.test(p));
  const town = places[places.length - 1];
  return town ? CITY_NAMES[town.toLowerCase()] ?? town : undefined;
}
