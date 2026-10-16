import "server-only";

export interface CreditMasteryRelease {
  environment: "sandbox" | "production";
  companyId: string;
  productId: string;
  planId: string;
  checkoutUrl: string;
  // Links to the reviewed test report and dedicated native-delivery configuration.
  verificationReport: string;
  deliveryConfiguration: string;
}

// Intentionally absent. Only populate in a reviewed change after EVERY launch
// contract check passes. Existing Whop/Dropify environment flags cannot open sales.
export const creditMasteryRelease: CreditMasteryRelease | null = null;
