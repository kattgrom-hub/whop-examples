import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
const app = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.join(app, 'package.json'));
const ts = require('typescript');
export function loadTs(relative, mocks = {}, cache = new Map()) {
  const filename = path.resolve(app, relative);
  if (cache.has(filename)) return cache.get(filename).exports;
  const module = { exports: {} }; cache.set(filename, module);
  const localRequire = specifier => {
    if (Object.hasOwn(mocks, specifier)) return mocks[specifier];
    if (specifier === 'server-only') return {};
    if (specifier.startsWith('@/') || specifier.startsWith('.')) {
      const stem = specifier.startsWith('@/') ? path.join(app, 'src', specifier.slice(2)) : path.resolve(path.dirname(filename), specifier);
      const file = [stem, stem + '.ts', stem + '.tsx'].find(fs.existsSync);
      return loadTs(path.relative(app, file), mocks, cache);
    }
    return require(specifier);
  };
  const js = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, jsx: ts.JsxEmit.ReactJSX,
  }, fileName: filename }).outputText;
  vm.runInThisContext(`(function(require,module,exports,__filename,__dirname){${js}\n})`, { filename })(localRequire, module, module.exports, filename, path.dirname(filename));
  return module.exports;
}
export { require, app };
