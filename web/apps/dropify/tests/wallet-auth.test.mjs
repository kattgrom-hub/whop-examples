import test from "node:test";
import assert from "node:assert/strict";
import { loadTs } from "./load-ts.mjs";

test("browser session omits OAuth credential while encrypted JWT retains expiry and grants", () => {
  let options;
  loadTs("src/auth.ts", { "@whop-examples/auth": { createWhopAuth(value) { options=value; return {}; } } });
  const token=options.callbacks.jwt({token:{accessToken:"private-oauth"},account:{scope:"openid wallet:test",expires_at:12345}});
  assert.equal(token.walletScopes,"openid wallet:test");
  assert.equal(token.walletExpiresAt,12345);
  assert.equal(token.walletEnvironment,"production");
  const session=options.callbacks.session({session:{user:{id:"user_Test"},accessToken:token.accessToken}});
  assert.equal(session.accessToken,undefined);
  assert.equal(JSON.stringify(session).includes("private-oauth"),false);
});

test("credential reader uses authenticated encrypted cookie with HTTPS secure-cookie selection", async () => {
  let input;
  const {getWalletCredential}=loadTs("src/lib/wallet-auth.ts",{"next-auth/jwt":{getToken:async value=>{input=value;return {id:"user_Test"};}}});
  const request={nextUrl:{protocol:"https:"}};
  await getWalletCredential(request);
  assert.equal(input.req,request); assert.equal(input.secureCookie,true);
});
