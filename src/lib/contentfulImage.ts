// Pure helper, safe for client bundles (no contentful SDK import).
/**
 * Transforms a Contentful asset URL to use the Contentful Image API.
 * Requests WebP format, dimensions, quality, and fit mode to drastically
 * reduce bandwidth consumption (up to 99% reduction).
 */
export function optimizeContentfulImage(
  url?: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'jpg' | 'png';
    fit?: 'pad' | 'fill' | 'scale' | 'crop' | 'thumb';
  } = {}
): string | undefined {
  if (!url) return undefined;

  // If local static asset, return as-is
  if (url.startsWith('/') || !url.includes('ctfassets.net')) {
    return url;
  }

  // Ensure protocol
  const fullUrl = url.startsWith('//') ? `https:${url}` : url;

  try {
    const parsed = new URL(fullUrl);
    const { width, height, quality = 80, format = 'webp', fit = 'fill' } = options;

    if (width) parsed.searchParams.set('w', String(width));
    if (height) parsed.searchParams.set('h', String(height));
    if (quality) parsed.searchParams.set('q', String(quality));
    if (format) parsed.searchParams.set('fm', format);
    if (fit) parsed.searchParams.set('fit', fit);

    return parsed.toString();
  } catch {
    return fullUrl;
  }
}
