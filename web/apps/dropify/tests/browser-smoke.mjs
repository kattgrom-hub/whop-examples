// Local browser check. All Whop scripts and order responses are mocked; no payment API is called.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { app } from './load-ts.mjs';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const base = process.env.DROPIFY_TEST_URL || 'http://127.0.0.1:5018';
let server;
if (process.env.DROPIFY_TEST_START === '1') {
  server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','-H','127.0.0.1','-p',String(new URL(base).port)],{cwd:app,env:{...process.env,NEXT_PUBLIC_WHOP_ENVIRONMENT:'sandbox'},stdio:'ignore'});
  let ready=false;
  for(let i=0;i<50;i++) {
    try { if((await fetch(base)).ok) {ready=true;break;} } catch {}
    await new Promise(resolve=>setTimeout(resolve,200));
  }
  if(!ready) {server.kill();throw new Error('Local server could not start');}
}
let launch={headless:true,args:['--no-sandbox']};
if (process.env.CHROMIUM_MODULE_PATH) {
  const {default: bundled}=await import(process.env.CHROMIUM_MODULE_PATH);
  launch={headless:true,executablePath:await bundled.executablePath(),args:bundled.args};
}
if (process.env.CHROMIUM_EXECUTABLE_PATH) launch.executablePath=process.env.CHROMIUM_EXECUTABLE_PATH;
const browser = await chromium.launch(launch);
let passed=0;
try {
  async function setup({status='pending',result='payment',failedScript=false}={}) {
    const page=await browser.newPage();
    let state=status;
    const external=[];
    await page.route('**/*',async route=>{
      const url=new URL(route.request().url());
      if(url.origin===new URL(base).origin) {
        if(url.pathname.startsWith('/api/orders/')) return route.fulfill({json:{orderId:'11111111-1111-4111-8111-111111111111',status:state,paymentId:state==='paid'?'pay_Test':null,planId:'plan_Test',checkoutConfigurationId:'ch_Test'}});
        return route.continue();
      }
      if(url.hostname==='cdn.whop.com') {
        if(failedScript) return route.abort();
        return route.fulfill({contentType:'application/javascript',body:`
          window.WhopElements=options=>({checkout:{create:config=>{
            window.testCheckout={options,config};
            return {destroy(){window.testDestroyed=true},create(){return {mount(target){
              const button=document.createElement('button');button.textContent='Mock complete';
              button.onclick=()=>config.onComplete({result:${JSON.stringify(result)},paymentId:'pay_Test',sessionId:'chs_Test'});
              target.appendChild(button);
            },destroy(){}}}};
          }}});
        `});
      }
      external.push(url.hostname);return route.abort();
    });
    return {page,setState(value){state=value;},external};
  }
  const a=await setup();
  await a.page.goto(`${base}/checkout?orderId=11111111-1111-4111-8111-111111111111`);
  await a.page.getByRole('button',{name:'Mock complete'}).waitFor();
  const config=await a.page.evaluate(()=>({environment:window.testCheckout.options.environment,configuration:window.testCheckout.config.checkoutConfiguration,returnUrl:window.testCheckout.config.returnUrl}));
  assert.equal(config.environment,'sandbox');assert.equal(config.configuration,'ch_Test');
  assert.equal(config.returnUrl,`${base}/checkout?orderId=11111111-1111-4111-8111-111111111111`);
  await a.page.getByRole('button',{name:'Mock complete'}).click();
  await a.page.getByRole('heading',{name:'Confirming your payment'}).waitFor();
  assert.equal(await a.page.getByRole('heading',{name:'Thank you for your order'}).count(),0);
  a.setState('paid');
  await a.page.getByRole('button',{name:'Check again'}).click();
  await a.page.getByRole('heading',{name:'Thank you for your order'}).waitFor();
  passed++;await a.page.close();
  const b=await setup();await b.page.goto(`${base}/checkout?status=success`);
  await b.page.getByRole('heading',{name:'No checkout in progress'}).waitFor();passed++;await b.page.close();
  for(const outcome of ['failed','canceled']) {
    const c=await setup();await c.page.goto(`${base}/checkout?orderId=11111111-1111-4111-8111-111111111111&payment=pay_Test&status=${outcome}`);
    await c.page.getByRole('button',{name:'Retry checkout'}).waitFor();
    assert.equal(await c.page.getByRole('button',{name:'Mock complete'}).count(),0);
    await c.page.getByRole('button',{name:'Retry checkout'}).click();
    await c.page.getByRole('button',{name:'Mock complete'}).waitFor();passed++;await c.page.close();
  }
  for (const outcome of ['succeeded', 'processing', 'requires_action', 'unknown']) {
    const d=await setup();await d.page.goto(`${base}/checkout?orderId=11111111-1111-4111-8111-111111111111&payment=pay_Test&status=${outcome}&client_secret=local-test-only`);
    await d.page.getByRole('heading',{name:'Confirming your payment'}).waitFor();
    assert.equal(await d.page.getByRole('heading',{name:'Thank you for your order'}).count(),0);
    assert.equal(await d.page.getByRole('button',{name:'Mock complete'}).count(),0);
    assert.equal(await d.page.locator('meta[name="referrer"]').getAttribute('content'),'no-referrer');
    d.setState('paid');await d.page.getByRole('button',{name:'Check again'}).click();
    await d.page.getByRole('heading',{name:'Thank you for your order'}).waitFor();
    passed++;await d.page.close();
  }
  const e=await setup({result:'waitlist_entry'});await e.page.goto(`${base}/checkout?orderId=11111111-1111-4111-8111-111111111111`);
  await e.page.getByRole('button',{name:'Mock complete'}).click();
  await e.page.getByText('This checkout did not complete a payment. No order has been confirmed.',{exact:true}).waitFor();assert.equal(await e.page.getByRole('heading',{name:'Thank you for your order'}).count(),0);passed++;await e.page.close();
  const f=await setup({failedScript:true});await f.page.goto(`${base}/checkout?orderId=11111111-1111-4111-8111-111111111111`);
  await f.page.getByText('Checkout could not load. Please retry.',{exact:true}).waitFor();await f.page.getByRole('button',{name:'Retry checkout'}).waitFor();passed++;await f.page.close();
  console.log(`${passed} browser scenarios passed. Whop network requests were intercepted.`);
} finally {await browser.close();server?.kill();}
