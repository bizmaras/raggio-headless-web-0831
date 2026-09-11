/**
 * Centralized security helpers for API routes and request validation.
 */

const ALLOWED_HOSTS = new Set([
  'raggiogourmetpizza.com',
  'www.raggiogourmetpizza.com',
  'localhost',
  '127.0.0.1',
]);

/**
 * Validates whether the incoming HTTP request originates from an authorized source.
 * Protects against CSRF and cross-site scraping or quota exhaustion.
 */
export function isValidOrigin(req: Request): boolean {
  // Check Sec-Fetch-Site (modern browsers)
  const secFetchSite = req.headers.get('sec-fetch-site');
  if (secFetchSite === 'cross-site') {
    return false;
  }

  // Check Origin header if present
  const origin = req.headers.get('origin');
  if (origin) {
    try {
      const url = new URL(origin);
      const host = url.hostname.toLowerCase();

      const isAllowed =
        ALLOWED_HOSTS.has(host) ||
        host.endsWith('.raggiogourmetpizza.com') ||
        host.endsWith('.vercel.app');

      if (!isAllowed) {
        return false;
      }
    } catch {
      return false;
    }
  }

  return true;
}
