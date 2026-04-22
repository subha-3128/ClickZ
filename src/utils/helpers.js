export function delay(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function isValidUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function getInitials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0])
    .join('')
    .toUpperCase();
}

export function toLogoSlug(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getHostSlug(link) {
  if (!link) return '';

  try {
    const host = new URL(link).hostname.replace(/^www\./, '');
    return host.split('.')[0] || '';
  } catch {
    return '';
  }
}

export function getAutoLogoCandidates(name, customId, link) {
  const baseCustom = toLogoSlug(customId || '');
  const baseName = toLogoSlug(name || '');
  const baseHost = toLogoSlug(getHostSlug(link));

  const customNormalized = baseCustom
    .replace(/-(main|primary|prod|production|app|site|web)$/g, '')
    .replace(/-\d+$/g, '');

  const namePrimary = baseName.split('-')[0] || '';

  const slugs = [baseCustom, customNormalized, baseName, namePrimary, baseHost]
    .map((slug) => toLogoSlug(slug))
    .filter(Boolean);

  return Array.from(new Set(slugs)).map(
    (slug) => `https://api.iconify.design/logos:${slug}-icon.svg`,
  );
}
