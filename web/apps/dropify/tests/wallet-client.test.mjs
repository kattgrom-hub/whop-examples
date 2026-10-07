import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTs } from './load-ts.mjs';

test('wallet renews tokens and closes on renewal denial; unmount clears controllers', async () => {
  const original={fetch:globalThis.fetch,setTimeout:globalThis.setTimeout,clearTimeout:globalThis.clearTimeout};
  const timers=new Map(); let cleanup, updates=0, destroyed=0, deny=false;
  const wallet={create:(_,options)=>({mount(){options.onReady();}}),update(){updates++;},destroy(){destroyed++;}};
  globalThis.setTimeout=(fn,delay)=>{timers.set(fn,delay);return fn;};
  globalThis.clearTimeout=id=>timers.delete(id);
  globalThis.fetch=async()=>({ok:!deny,json:async()=>deny?{error:'Session expired'}:{token:'mock',accountId:'user_Test',expiresAt:new Date(Date.now()+900000).toISOString()}});
  try {
    const {WhopWallet}=loadTs('src/components/whop-wallet.tsx',{
      react:{useRef:()=>({current:{}}),useState:value=>[value,()=>{}],useEffect:fn=>{cleanup=fn();}},
      'next-auth/react':{signIn:()=>{}},
      '@/lib/checkout-config':{getWhopEnvironment:()=> 'sandbox'},
      '@/lib/whop-elements':{loadWhopElements:async()=>()=>({wallet:{create:()=>wallet}})},
    });
    WhopWallet(); await new Promise(setImmediate);
    const refresh=[...timers].find(([,delay])=>delay>800000)[0];
    timers.delete(refresh); await refresh(); assert.equal(updates,1);
    deny=true; const next=[...timers].find(([,delay])=>delay>800000)[0];
    timers.delete(next); await next(); assert.equal(destroyed,1);assert.equal(timers.size,0);
    cleanup();assert.equal(timers.size,0);
  } catch(error) { console.error(error); throw error; } finally {cleanup?.();Object.assign(globalThis,original);}
});

for (const scenario of ['mount error','ready timeout','account changed','late renewal']) {
  test(`wallet fails closed on ${scenario}`,async()=>{
    const original={fetch:globalThis.fetch,setTimeout:globalThis.setTimeout,clearTimeout:globalThis.clearTimeout};
    const timers=new Map();let cleanup,options,updates=0,destroyed=0,calls=0,resolvePending;
    const wallet={create:(_,value)=>{options=value;return {mount(){if(scenario==='mount error')options.onError();else if(scenario!=='ready timeout')options.onReady();}}},update(){updates++;},destroy(){destroyed++;}};
    globalThis.setTimeout=(fn,delay)=>{timers.set(fn,delay);return fn;};globalThis.clearTimeout=id=>timers.delete(id);
    const response=accountId=>({ok:true,json:async()=>({token:'mock',accountId,expiresAt:new Date(Date.now()+900000).toISOString()})});
    globalThis.fetch=async()=>{
      calls++;
      if(calls>1&&scenario==='late renewal')return new Promise(resolve=>{resolvePending=resolve;});
      return response(calls>1?'user_Other':'user_Test');
    };
    try {
      const {WhopWallet}=loadTs('src/components/whop-wallet.tsx',{
        react:{useRef:()=>({current:{}}),useState:value=>[value,()=>{}],useEffect:fn=>{cleanup=fn();}},
        'next-auth/react':{signIn:()=>{}},'@/lib/checkout-config':{getWhopEnvironment:()=> 'sandbox'},
        '@/lib/whop-elements':{loadWhopElements:async()=>()=>({wallet:{create:()=>wallet}})},
      });
      WhopWallet();await new Promise(setImmediate);
      if(scenario==='ready timeout'){
        const timer=[...timers].find(([,delay])=>delay===15000)[0];timers.delete(timer);timer();
      }
      if(scenario==='account changed'||scenario==='late renewal'){
        const timer=[...timers].find(([,delay])=>delay>800000)[0];timers.delete(timer);const pending=timer();
        if(scenario==='late renewal'){await new Promise(setImmediate);options.onError();resolvePending(response('user_Test'));}
        await pending;
      }
      assert.equal(updates,0);assert.equal(destroyed,1);assert.equal(timers.size,0);
      cleanup();assert.equal(destroyed,1);
    }finally{cleanup?.();Object.assign(globalThis,original);}
  });
}
