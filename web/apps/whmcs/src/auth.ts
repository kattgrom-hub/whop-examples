import { createWhopAuth } from "@whop-examples/auth";

export const { auth, handlers, signIn, signOut } = createWhopAuth({
  scopes: ["user:balance:read"],
  pages: { signIn: "/wallet" },
});
