export interface WhopWebhook {
  id: string;
  type: string;
  api_version: "v1";
  api_version_date?: string | null;
  account_id?: string | null;
  company_id?: string | null;
  data: Record<string, any>;
}
export class WebhookRequestError extends Error { status: number; }
export function readWhopWebhook(request: Request): Promise<WhopWebhook>;
