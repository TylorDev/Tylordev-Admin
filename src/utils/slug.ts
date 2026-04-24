export function createBaseSlug(title: string) {
  const normalized = title
    .trim()
    .replace(/\d+/g, (match) => match.padStart(2, '0'))
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .toLowerCase();

  return normalized || 'item';
}
