export type MountedElement = {
  mount(target: string | HTMLElement): void;
  destroy?: () => void;
};

export type PaymentsHandle = {
  create(
    element:
      | "payment"
      | "address"
      | "email"
      | "branding",
    options?: Record<string, unknown>
  ): MountedElement;
  createConfirmationToken(): Promise<{ confirmationToken: string }>;
  handleNextAction(input: { clientSecret: string }): Promise<void>;
  destroy?: () => void;
};

export type WalletHandle = {
  create(element: "actions", options?: Record<string, unknown>): MountedElement;
  update(options: { accessToken: string }): void;
  destroy(): void;
};

type Completion = { result: "payment"; paymentId: string; sessionId: string } |
  { result: "setup"; setupIntentId: string; sessionId: string } |
  { result: "waitlist_entry"; entryId: string; sessionId: string };
type ElementHandle = { mount(target: HTMLElement): void; destroy(): void };
export type CheckoutHandle = { create(name: "checkout", options?: { onError?: (event: { code?: string }) => void }): ElementHandle; destroy(): void };

type WhopRoot = {
  checkout: { create(options: { checkoutConfiguration?: string; plan?: string; returnUrl: string; onComplete(event: Completion): void }): CheckoutHandle };
  wallet: {
    create(options: Record<string, unknown>): WalletHandle;
  };
  payments: {
    create(options: Record<string, unknown>): PaymentsHandle;
  };
};

type WhopElementsConstructor = (
  options?: Record<string, unknown>
) => WhopRoot;

declare global {
  interface Window {
    WhopElements?: WhopElementsConstructor;
  }
}

const WHOP_ELEMENTS_SRC =
  "https://cdn.whop.com/elements/amber/elements.js";

let pending: Promise<WhopElementsConstructor> | null = null;

export function loadWhopElements(): Promise<WhopElementsConstructor> {
  if (window.WhopElements) return Promise.resolve(window.WhopElements);
  if (pending) return pending;

  pending = new Promise<WhopElementsConstructor>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>("script[data-whop-elements]");
    const script = existing || document.createElement("script");
    const cleanup = () => {
      clearTimeout(timeout);
      script.removeEventListener("load", finish);
      script.removeEventListener("error", fail);
    };
    const fail = () => {
      cleanup();
      script.remove();
      reject(new Error("Unable to load Whop Elements. Please try again."));
    };
    const finish = () => {
      if (!window.WhopElements) { fail(); return; }
      cleanup();
      resolve(window.WhopElements);
    };
    const timeout = setTimeout(fail, 15000);
    script.addEventListener("load", finish, { once: true });
    script.addEventListener("error", fail, { once: true });
    if (!existing) {
      script.src = WHOP_ELEMENTS_SRC;
      script.async = true;
      script.dataset.whopElements = "";
      document.head.appendChild(script);
    }
  }).catch((error) => { pending = null; throw error; });
  return pending;
}
