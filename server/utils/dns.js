const dns = require('node:dns');

/**
 * Configures DNS server addresses for Node.js's internal c-ares resolver.
 *
 * In production (NODE_ENV === 'production'):
 * - Defaults to the hosting provider's system DNS. Overriding DNS process-wide
 *   in cloud environments (AWS, GCP, Render, Kubernetes, etc.) can break VPC
 *   private endpoints, internal service discovery (e.g. CoreDNS), and fail
 *   if port 53 egress is restricted.
 * - Only sets custom servers if explicitly defined in process.env.DNS_SERVERS.
 *
 * In development / test:
 * - Defaults to public resolvers (Cloudflare 1.1.1.1 and Google 8.8.8.8) to
 *   prevent the common Windows/ISP local DNS failure ("querySrv ECONNREFUSED")
 *   when querying MongoDB Atlas SRV records.
 *
 * Override controls:
 * - DNS_SERVERS=1.1.1.1,8.8.8.8 (comma-separated list of IP addresses)
 * - DNS_SERVERS=off or DNS_SERVERS=false (disables override in any environment)
 */
function configureDns() {
  if (process.env.DNS_SERVERS === 'off' || process.env.DNS_SERVERS === 'false') {
    return;
  }

  const isProduction = process.env.NODE_ENV === 'production';

  // In production, do not override system DNS unless explicitly configured
  if (isProduction && !process.env.DNS_SERVERS) {
    return;
  }

  const servers = process.env.DNS_SERVERS
    ? process.env.DNS_SERVERS.split(',').map(s => s.trim()).filter(Boolean)
    : ['1.1.1.1', '8.8.8.8'];

  try {
    dns.setServers(servers);
  } catch (err) {
    console.warn(`[DNS] Failed to set DNS servers (${servers.join(', ')}):`, err.message);
  }
}

module.exports = { configureDns };
