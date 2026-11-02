/**
 * Same-origin API proxy for Cloudflare Pages.
 * Configure a Pages service binding named PORTFOLIO_API pointing to
 * the deployed `umar-sadiq-portfolio-api` Worker.
 * Keeping /api on the portfolio origin allows HttpOnly session cookies
 * without cross-origin credentialed requests.
 */
export async function onRequest({ request, env }) {
  if (!env.PORTFOLIO_API) {
    return new Response(JSON.stringify({
      error: 'API service binding PORTFOLIO_API is not configured.'
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
    });
  }
  return env.PORTFOLIO_API.fetch(request);
}
