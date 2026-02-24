import Whop from "@whop/sdk";

export interface Server {
  id: string;
  name: string;
  isParent: boolean;
}

/**
 * Fetch connected accounts (servers) under a parent company from the Whop API.
 * Runs server-side only (uses WHOP_API_KEY).
 */
export async function fetchServers(
  parentCompanyId: string
): Promise<Server[]> {
  const apiKey = process.env.WHOP_API_KEY;
  if (!apiKey) return [];

  const whop = new Whop({ apiKey });
  const servers: Server[] = [];

  for await (const company of whop.companies.list({
    parent_company_id: parentCompanyId,
  })) {
    servers.push({
      id: company.id,
      name: company.title,
      isParent: false,
    });
  }

  return servers;
}
