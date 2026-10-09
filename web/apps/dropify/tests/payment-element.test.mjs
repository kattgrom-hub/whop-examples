import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { loadTs, require, app } from './load-ts.mjs';
const { NextRequest } = require('next/server');
const env = { DROPIFY_PAYMENT_ELEMENT_ENABLED:'true', DROPIFY_PAYMENT_ELEMENT_PLAN_ID:'plan_Sandbox',
  NEXT_PUBLIC_WHOP_ENVIRONMENT:'sandbox', NEXT_PUBLIC_WHOP_COMPANY_ID:'biz_Test',
  DROPIFY_SUPABASE_URL:'https://database.example.invalid',DROPIFY_SUPABASE_SERVICE_ROLE_KEY:'test-service-role',
  CHECKOUT_SIGNING_SECRET:'local-test-secret-at-least-32-characters',NEXT_PUBLIC_APP_URL:'http://localhost:5007', WHOP_API_KEY:'sandbox-local-test-only' };
Object.assign(process.env, env);
const session = {id:randomUUID(),company_id:'biz_Test',plan_id:'plan_Sandbox',reserved:false,payment_id:null};
const body = {confirmationToken:'ctok_Test',email:'buyer@example.invalid',plan:'plan_Attacker',amount:0};
function request(input=body, origin='http://localhost:5007') {
  return new NextRequest('http://localhost:5007/api/payment-element/confirm', {method:'POST',
    headers:{origin,'content-type':'application/json'},body:JSON.stringify(input)});
}
test('PaymentElement cannot be enabled for production, Preview production or an unconfigured plan', () => {
  const {elementConfig} = loadTs('src/lib/payment-element-server.ts');
  assert.equal(elementConfig().planId,'plan_Sandbox');
  for (const change of [{DROPIFY_PAYMENT_ELEMENT_ENABLED:'false'}, {NEXT_PUBLIC_WHOP_ENVIRONMENT:'production'},
    {VERCEL_ENV:'production'}, {DROPIFY_PAYMENT_ELEMENT_PLAN_ID:'plan_xxxxxxxx'}]) {
    Object.assign(process.env,change); assert.throws(elementConfig);
    delete process.env.VERCEL_ENV; Object.assign(process.env,env);
  }
});
test('sandbox form requires every configured payment and storage prerequisite',()=>{
  const {requireElementSetup}=loadTs('src/lib/payment-element-server.ts');
  assert.equal(requireElementSetup().planId,'plan_Sandbox');
  for(const name of ['WHOP_API_KEY','DROPIFY_SUPABASE_URL','DROPIFY_SUPABASE_SERVICE_ROLE_KEY','CHECKOUT_SIGNING_SECRET']) {
    const saved=process.env[name];delete process.env[name];
    try {assert.throws(requireElementSetup);}finally{process.env[name]=saved;}
  }
});
test('payment identity rejects a different seller, plan, attempt and payment id', () => {
  const {elementPayment} = loadTs('src/lib/payment-element-server.ts');
  const payment={id:'pay_Test',company:{id:'biz_Test'},plan:{id:'plan_Sandbox'},
    metadata:{type:'dropify_element_test',element_session:session.id},status:'paid',substatus:'succeeded'};
  assert.equal(elementPayment(session,payment).status,'succeeded');
  assert.equal(elementPayment(session,{...payment,status:'processing'}).status,'pending');
  for(const substatus of ['blocked','price_too_low','uncollectible','refunded','auto_refunded','partially_refunded','dispute_lost','resolution_lost']) {
    const result=elementPayment(session,{...payment,substatus,client_secret:'secret'});
    assert.equal(result.status,'failed');assert.equal(result.clientSecret,null);
  }
  assert.equal(elementPayment(session,{...payment,status:'uncollectible'}).status,'failed');
  assert.equal(elementPayment(session,{...payment,status:'void'}).status,'canceled');
  for (const change of [{id:'bad'}, {company:{id:'biz_Attacker'}}, {plan:{id:'plan_Attacker'}},
    {metadata:{type:'dropify_element_test',element_session:randomUUID()}}]) assert.throws(()=>elementPayment(session,{...payment,...change}));
  assert.throws(()=>elementPayment({...session,payment_id:'pay_Other'},payment));
});
function mocks() {
  let reserved=false; const calls=[];
  const real=loadTs('src/lib/payment-element-server.ts');
  return {calls,lib:{...real,readElementSession:async()=>session,
    reserveElementSession:async()=>{if(reserved)return false;reserved=true;return true;},
    releaseElementSession:async()=>{reserved=false;calls.push(['release']);},
    attachElementPayment:async(...args)=>calls.push(['attach',...args]),
    elementApi:async(path,input)=>{calls.push(['api',path,input]);return {id:'pay_Test',company:{id:session.company_id},
      plan:{id:session.plan_id},metadata:input.metadata,status:'processing',client_secret:'scoped-test-secret'};},
  }};
}
test('concurrent confirmations create one charge using only the server plan',async()=>{
  const {lib,calls}=mocks(); const {POST}=loadTs('src/app/api/payment-element/confirm/route.ts',{'@/lib/payment-element-server':lib});
  const responses=await Promise.all([POST(request()),POST(request())]);
  assert.deepEqual(responses.map(r=>r.status).sort(),[200,409]);
  const charge=calls.filter(c=>c[0]==='api'); assert.equal(charge.length,1);
  assert.equal(charge[0][2].plan,'plan_Sandbox'); assert.equal(charge[0][2].account_id,'biz_Test');
  assert.equal(charge[0][2].amount,undefined); assert.equal(charge[0][2].return_url,'http://localhost:5007/payment-element');
  assert.equal(calls[1][0],'attach');
});
test('invalid input, unauthorized session and cross-site requests never charge',async()=>{
  const {lib,calls}=mocks(); let {POST}=loadTs('src/app/api/payment-element/confirm/route.ts',{'@/lib/payment-element-server':lib});
  assert.equal((await POST(request({...body,confirmationToken:'pay_Forged'}))).status,400);
  assert.equal((await POST(request({...body,email:'bad'}))).status,400);
  assert.equal((await POST(request(body,'https://attacker.example'))).status,503);
  ({POST}=loadTs('src/app/api/payment-element/confirm/route.ts',{'@/lib/payment-element-server':{...lib,readElementSession:async()=>null}}));
  assert.equal((await POST(request())).status,404); assert.equal(calls.length,0);
});
test('provider timeout leaves reservation locked, never creates a second attempt',async()=>{
  const {lib}=mocks(); let calls=0;lib.elementApi=async()=>{calls++;throw new Error('timeout');};
  const {POST}=loadTs('src/app/api/payment-element/confirm/route.ts',{'@/lib/payment-element-server':lib});
  assert.equal((await POST(request())).status,503); assert.equal((await POST(request())).status,409);assert.equal(calls,1);
});
test('definitive provider rejection releases a session; server failures stay locked',async()=>{
  for(const status of [400,401,403,404,422,429,408,409,500]) {
    const {lib,calls}=mocks();let attempts=0;
    lib.elementApi=async()=>{attempts++;throw [400,401,403,404,422,429].includes(status)?new lib.ElementApiRejection(status):new Error('ambiguous');};
    const {POST}=loadTs('src/app/api/payment-element/confirm/route.ts',{'@/lib/payment-element-server':lib});
    assert.equal((await POST(request())).status,503);
    const rejected=[400,401,403,404,422,429].includes(status);
    assert.equal(calls.some(c=>c[0]==='release'),rejected);
    assert.equal((await POST(request())).status,rejected?503:409);assert.equal(attempts,rejected?2:1);
  }
});
test('missing API credentials cannot permanently reserve an unsubmitted attempt',async()=>{
  const {lib}=mocks();let reserved=0;lib.reserveElementSession=async()=>{reserved++;return true;};
  const {POST}=loadTs('src/app/api/payment-element/confirm/route.ts',{'@/lib/payment-element-server':lib});
  const saved=process.env.WHOP_API_KEY;delete process.env.WHOP_API_KEY;
  try { assert.equal((await POST(request())).status,503);assert.equal(reserved,0); }
  finally { process.env.WHOP_API_KEY=saved; }
});
test('status ignores forged URL success and reports an unresolved reservation as unknown',async()=>{
  const {lib}=mocks();lib.readElementSession=async()=>({...session,reserved:true});
  const {GET}=loadTs('src/app/api/payment-element/status/route.ts',{'@/lib/payment-element-server':lib});
  const response=await GET(new NextRequest('http://localhost:5007/api/payment-element/status?status=succeeded&payment=pay_Forged'));
  assert.equal((await response.json()).status,'unknown'); assert.equal(response.headers.get('cache-control'),'no-store');
});
test('session resumes an existing reservation and does not expose its access hash',async()=>{
  const {lib}=mocks();lib.readElementSession=async()=>({...session,reserved:true,access_hash:'private'});
  lib.createElementSession=async()=>{throw new Error('must not start again');};
  const {POST}=loadTs('src/app/api/payment-element/session/route.ts',{'@/lib/payment-element-server':lib});
  const response=await POST(request()); const data=await response.json();
  assert.equal(response.status,200);assert.equal(data.reserved,true);assert.equal(data.access_hash,undefined);
});
test('sandbox database limits attempts, denies buyer access and reserves exactly once',async()=>{
  const {PGlite}=require('@electric-sql/pglite');const db=new PGlite();
  try {
    await db.exec('create role anon; create role authenticated; create role service_role bypassrls;');
    await db.exec(fs.readFileSync(path.join(app,'database/orders.sql'),'utf8'));
    await db.exec(fs.readFileSync(path.join(app,'database/payment-element.sql'),'utf8'));
    await db.exec('set role anon');await assert.rejects(db.query('select * from public.dropify_element_sessions'),/permission denied/);
    await assert.rejects(db.query('select public.dropify_create_element_session($1,$2,$3,$4,$5)',
      [session.id,'a'.repeat(64),'biz_Test','plan_Sandbox','b'.repeat(64)]),/permission denied/);
    await db.exec('reset role; set role service_role');
    for(let i=0;i<6;i++) {
      const id=i===0?session.id:randomUUID();
      const result=await db.query('select (public.dropify_create_element_session($1,$2,$3,$4,$5)).id as id',
        [id,'a'.repeat(64),'biz_Test','plan_Sandbox','b'.repeat(64)]);
      assert.equal(result.rows[0].id,i===5?null:id);
    }
    const reserve=()=>db.query('update public.dropify_element_sessions set reserved=true where id=$1 and reserved=false returning id',[session.id]);
    const results=await Promise.all([reserve(),reserve()]);assert.equal(results.reduce((n,r)=>n+r.rows.length,0),1);
  }finally{await db.close();}
});
