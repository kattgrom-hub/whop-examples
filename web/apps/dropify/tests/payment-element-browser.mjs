// Local browser regression checks. Every payment/session response and Whop runtime is mocked.
// Install Playwright separately, or provide PLAYWRIGHT_MODULE_PATH and CHROMIUM_EXECUTABLE_PATH.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { app, require } from './load-ts.mjs';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const base = process.env.DROPIFY_TEST_URL || 'http://127.0.0.1:5019';
let server;
const launch = { headless:true, args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'],
  ...(process.env.CHROMIUM_EXECUTABLE_PATH ? {executablePath:process.env.CHROMIUM_EXECUTABLE_PATH} : {}) };
let browser;
try {
  if (process.env.DROPIFY_TEST_START === '1') {
    server=spawn(process.execPath,[require.resolve('next/dist/bin/next'),'start','-H','127.0.0.1','-p',new URL(base).port],{
      cwd:app,stdio:'ignore',env:{...process.env,NEXT_PUBLIC_WHOP_ENVIRONMENT:'sandbox',
        NEXT_PUBLIC_WHOP_COMPANY_ID:'biz_Test',DROPIFY_PAYMENT_ELEMENT_ENABLED:'true',
        DROPIFY_PAYMENT_ELEMENT_PLAN_ID:'plan_Sandbox',NEXT_PUBLIC_APP_URL:base},
    });
    let ready=false;
    for(let i=0;i<100;i++) {
      try {if((await fetch(`${base}/payment-element`)).ok){ready=true;break;}} catch{}
      await new Promise(resolve=>setTimeout(resolve,200));
    }
    assert.ok(ready,'local server must become ready');
  }
  browser=await chromium.launch(launch);
  async function setup({sessionFailure=false,scriptFailure=false,reserved=false,confirmFailure=false,status='pending'}={}) {
    const page=await browser.newPage();let sessions=0,confirms=0,statusReads=0,scriptLoads=0;
    const blocked=[];
    await page.addInitScript(scriptFailure => {
      window.installMock=()=>{
      window.mockCalls={tokens:0,actions:0,destroys:0,branding:0};
      window.WhopElements=config=>({payments:{
        handleNextAction:async()=>{window.mockCalls.actions++;return {status:'succeeded',redirected:false};},
        create:options=>{
          window.mockOptions={config,options}; const mounted=[];
          return {destroy(){window.mockCalls.destroys++;mounted.forEach(t=>t.replaceChildren());},
            createConfirmationToken:async input=>{window.mockCalls.tokens++;window.mockEmail=input.billingDetails.email;return {confirmationToken:'ctok_Test',type:'card'};},
            create(name,callbacks){return {mount(target){mounted.push(target);
              if(name==='payment') {const button=document.createElement('button');button.type='button';button.textContent='Complete mock payment fields';
                button.onclick=()=>callbacks.onChange({complete:true});target.appendChild(button);}
              if(name==='branding') {window.mockCalls.branding++;target.textContent='Mock Whop branding';options.onLoadingChange(false);}
            }};},
          };
        },
      }});
      };
      if(!scriptFailure)window.installMock();
    },scriptFailure);
    await page.route('**/*',async route=>{
      const url=new URL(route.request().url());
      if(url.origin!==new URL(base).origin){
        if(scriptFailure&&url.hostname==='cdn.whop.com'&&++scriptLoads>1) return route.fulfill({contentType:'application/javascript',body:'window.installMock();'});
        blocked.push(url.hostname);return route.abort();
      }
      if(url.pathname==='/api/payment-element/session') {
        sessions++;
        if(sessionFailure&&sessions===1)return route.fulfill({status:503,json:{error:'Session temporarily unavailable'}});
        return route.fulfill({json:{sessionId:'11111111-1111-4111-8111-111111111111',companyId:'biz_Test',planId:'plan_Sandbox',reserved}});
      }
      if(url.pathname==='/api/payment-element/confirm') {
        confirms++;const payload=route.request().postDataJSON();
        assert.equal(payload.confirmationToken,'ctok_Test');assert.equal(payload.email,'buyer@example.invalid');
        if(confirmFailure)return route.fulfill({status:503,json:{error:'Check the existing attempt'}});
        return route.fulfill({json:{paymentId:'pay_Test',status:'pending',clientSecret:'local-mocked-secret'}});
      }
      if(url.pathname==='/api/payment-element/status') {
        statusReads++;return route.fulfill({json:{status,clientSecret:status==='pending'?'local-mocked-secret':null}});
      }
      return route.continue();
    });
    return {page,setStatus(s){status=s;},counts:()=>({sessions,confirms,statusReads}),blocked};
  }
  const retry=await setup({sessionFailure:true});await retry.page.goto(`${base}/payment-element`);
  await retry.page.getByRole('button',{name:'Retry checkout',exact:true}).click();
  await retry.page.getByRole('button',{name:'Complete mock payment fields'}).waitFor();
  assert.equal(retry.counts().sessions,2);await retry.page.close();

  const payment=await setup();await payment.page.goto(`${base}/payment-element?status=succeeded&client_secret=forged`);
  await payment.page.getByRole('button',{name:'Complete mock payment fields'}).waitFor();
  assert.equal(new URL(payment.page.url()).search,'');
  const pay=payment.page.getByRole('button',{name:'Pay in sandbox',exact:true});
  await payment.page.getByLabel('Email',{exact:true}).fill('buyer@example.invalid');assert.equal(await pay.isEnabled(),false);
  await payment.page.getByRole('button',{name:'Complete mock payment fields'}).click();assert.equal(await pay.isEnabled(),true);
  await payment.page.evaluate(()=>{const form=document.querySelector('input[type=email]').form;
    form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));});
  await payment.page.getByText('Checking the existing attempt. Do not submit another payment.').waitFor();
  assert.equal(payment.counts().confirms,1);assert.equal(await pay.count(),0);
  assert.equal(await payment.page.evaluate(()=>window.mockCalls.tokens),1);
  assert.equal(await payment.page.evaluate(()=>window.mockCalls.branding),1);
  assert.equal(await payment.page.evaluate(()=>window.mockOptions.config.environment),'sandbox');
  // The mocked provider reports success, but server status remains pending.
  assert.equal(await payment.page.getByText('Sandbox payment verified. No kit has been delivered.').count(),0);
  payment.setStatus('succeeded');await payment.page.getByRole('button',{name:'Check payment status'}).click();
  await payment.page.getByText('Sandbox payment verified. No kit has been delivered.').waitFor();await payment.page.close();

  const unknown=await setup({confirmFailure:true,status:'unknown'});await unknown.page.goto(`${base}/payment-element`);
  await unknown.page.getByLabel('Email',{exact:true}).fill('buyer@example.invalid');
  await unknown.page.getByRole('button',{name:'Complete mock payment fields'}).click();
  await unknown.page.getByRole('button',{name:'Pay in sandbox',exact:true}).click();
  await unknown.page.getByRole('button',{name:'Check payment status'}).click();
  await unknown.page.getByText('The attempt needs a status review. Do not submit another payment.').waitFor();
  assert.equal(unknown.counts().confirms,1);assert.equal(await unknown.page.getByRole('button',{name:'Pay in sandbox',exact:true}).count(),0);
  await unknown.page.close();

  const resume=await setup({reserved:true});await resume.page.goto(`${base}/payment-element`);
  await resume.page.getByRole('button',{name:'Continue verification'}).click();
  await resume.page.waitForFunction(()=>window.mockCalls.actions===1);
  assert.equal(await resume.page.evaluate(()=>window.mockCalls.actions),1);assert.equal(resume.counts().confirms,0);await resume.page.close();

  const failed=await setup({scriptFailure:true});await failed.page.goto(`${base}/payment-element`);
  await failed.page.getByRole('button',{name:'Reload payment form'}).waitFor();
  assert.equal(await failed.page.getByRole('button',{name:'Pay in sandbox',exact:true}).isEnabled(),false);
  assert.equal(failed.counts().confirms,0);
  await failed.page.evaluate(()=>window.installMock());
  await failed.page.getByRole('button',{name:'Reload payment form'}).click();
  await failed.page.getByRole('button',{name:'Complete mock payment fields'}).waitFor();
  assert.equal(await failed.page.getByText('The payment form could not load. Retry loading the form.',{exact:true}).count(),0);await failed.page.close();
  console.log('5 PaymentElement browser scenarios passed; all Whop requests were mocked or blocked.');
} finally {await browser?.close();server?.kill();}
