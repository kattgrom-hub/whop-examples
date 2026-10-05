import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { app, require } from './load-ts.mjs';
const { PGlite } = process.env.PGLITE_MODULE_PATH ? await import(process.env.PGLITE_MODULE_PATH) : require('@electric-sql/pglite');

test('database enforces private access, rate limits, atomic recording and replay protection', async () => {
  const db = new PGlite();
  try {
    await db.exec('create role anon; create role authenticated; create role service_role bypassrls;');
    await db.exec(fs.readFileSync(path.join(app,'database/orders.sql'),'utf8'));
    const config = id => ({id,access_hash:'b'.repeat(64),environment:'sandbox',company_id:'biz_Test',currency:'usd',total_minor:6800,items:[{productId:'midnight-jasmine',quantity:1}]});
    await db.exec('set role anon');
    await assert.rejects(db.query('select * from public.dropify_orders'),/permission denied/);
    await assert.rejects(db.query('select public.dropify_create_order($1::jsonb,$2)',[config(randomUUID()),'a'.repeat(64)]),/permission denied/);
    await db.exec('reset role; set role authenticated');
    await assert.rejects(db.query('select * from public.dropify_fulfilment_queue'),/permission denied/);
    await db.exec('reset role; set role service_role');
    const ids=[];
    for(let i=0;i<5;i++) {
      const id=randomUUID();ids.push(id);
      const result=await db.query('select (public.dropify_create_order($1::jsonb,$2)).id as id',[config(id),'a'.repeat(64)]);
      assert.equal(result.rows[0].id,id);
    }
    const denied=await db.query('select (public.dropify_create_order($1::jsonb,$2)).id as id',[config(randomUUID()),'a'.repeat(64)]);
    assert.equal(denied.rows[0].id,null);
    const record=(order,payment,event='msg_Test',address={name:'Sample Buyer'})=>db.query('select public.dropify_record_payment($1,$2,$3,$4::jsonb,$5) as result',[order,payment,event,address,'sample@example.invalid']);
    assert.equal((await record(ids[0],'pay_One')).rows[0].result,'recorded');
    assert.equal((await record(ids[0],'pay_One','msg_Retry')).rows[0].result,'duplicate');
    const queue=await db.query('select * from public.dropify_fulfilment_queue where order_id=$1',[ids[0]]);
    assert.equal(queue.rows.length,1);assert.equal(queue.rows[0].status,'pending');
    assert.equal((await record(ids[0],'pay_Two')).rows[0].result,'extra_payment_review');
    assert.equal((await db.query('select status from public.dropify_orders where id=$1',[ids[0]])).rows[0].status,'review');
    assert.equal((await db.query('select status from public.dropify_fulfilment_queue where order_id=$1',[ids[0]])).rows[0].status,'held');
    await assert.rejects(record(ids[1],'pay_One'),/another order/);
    await record(ids[1],'pay_NoAddress','msg_Missing',null);
    assert.equal((await db.query('select status from public.dropify_orders where id=$1',[ids[1]])).rows[0].status,'review');
    await db.exec('reset role; revoke insert on public.dropify_fulfilment_queue from service_role; set role service_role;');
    await assert.rejects(record(ids[2],'pay_Retry'),/permission denied/);
    assert.equal((await db.query('select payment_id from public.dropify_orders where id=$1',[ids[2]])).rows[0].payment_id,null);
    assert.equal((await db.query("select count(*)::int as n from public.dropify_payments where payment_id='pay_Retry'")).rows[0].n,0);
    await db.exec('reset role; grant insert on public.dropify_fulfilment_queue to service_role; set role service_role;');
    assert.equal((await record(ids[2],'pay_Retry')).rows[0].result,'recorded');
    // A refund arriving before success permanently requires staff review.
    await db.query('select public.dropify_hold_order($1)',[ids[3]]);
    await record(ids[3],'pay_Held');
    assert.equal((await db.query('select status from public.dropify_orders where id=$1',[ids[3]])).rows[0].status,'review');
    assert.equal((await db.query('select status from public.dropify_fulfilment_queue where order_id=$1',[ids[3]])).rows[0].status,'review');
  } finally { await db.close(); }
});
