import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../src/lib/whop-elements.ts", import.meta.url), "utf8");
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;

function loader() {
  const scripts = [];
  const timers = new Set();
  const context = {
    exports: {}, window: {},
    setTimeout: (fn) => { timers.add(fn); return fn; },
    clearTimeout: (fn) => timers.delete(fn),
    document: {
      querySelector: () => scripts[0] || null,
      createElement: () => {
        const listeners = new Map();
        return {
          dataset: {},
          addEventListener: (name, fn) => listeners.set(name, fn),
          removeEventListener: (name) => listeners.delete(name),
          emit: (name) => listeners.get(name)?.(),
          remove() { scripts.splice(scripts.indexOf(this), 1); },
        };
      },
      head: { appendChild: (script) => scripts.push(script) },
    },
  };
  vm.runInNewContext(code, context);
  return { load: context.exports.loadWhopElements, context, scripts, timers };
}

test("checkout and wallet share one hosted script and concurrent load promise", async () => {
  const state = loader();
  const first = state.load();
  assert.equal(first, state.load());
  assert.equal(state.scripts.length, 1);
  assert.equal(state.scripts[0].src, "https://cdn.whop.com/elements/amber/elements.js");
  const constructor = () => {};
  state.context.window.WhopElements = constructor;
  state.scripts[0].emit("load");
  assert.equal(await first, constructor);
  assert.equal(await state.load(), constructor);
  assert.equal(state.timers.size, 0);
});

test("script error clears failed script and allows a fresh retry", async () => {
  const state = loader();
  const first = state.load();
  state.scripts[0].emit("error");
  await assert.rejects(first, /Unable to load/);
  assert.equal(state.scripts.length, 0);
  const retry = state.load();
  state.context.window.WhopElements = () => {};
  state.scripts[0].emit("load");
  await retry;
});

test("a stalled CDN load times out instead of leaving checkout or wallet stuck", async () => {
  const state = loader();
  const first = state.load();
  [...state.timers][0]();
  await assert.rejects(first, /Unable to load/);
  assert.equal(state.scripts.length, 0);
  assert.equal(state.timers.size, 0);
});
