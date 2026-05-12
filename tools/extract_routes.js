const fs = require('fs');
const path = require('path');

function walk(dir) {
  const files = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) files.push(...walk(p));
    else if (p.endsWith('.ts')) files.push(p);
  }
  return files;
}

function extract(file) {
  const src = fs.readFileSync(file, 'utf8');
  const controllerMatch = src.match(/@Controller\(\s*['`\"]([^'`\"]+)['`\"]\s*\)/);
  if (!controllerMatch) return [];
  const prefix = controllerMatch[1];
  const methods = [];
  const regex = /@(Get|Post|Put|Patch|Delete)\(\s*(['`\"])([^'`\"]*)\2?\s*\)/g;
  let m;
  while ((m = regex.exec(src)) !== null) {
    const http = m[1].toUpperCase();
    const route = m[3] || '';
    methods.push({ http, route });
  }
  return methods.map(mm => ({ file, prefix, http: mm.http, route: mm.route }));
}

const base = path.join(__dirname, '..', 'backend', 'src');
if (!fs.existsSync(base)) {
  console.error('backend/src not found');
  process.exit(1);
}

const files = walk(base);
let results = [];
for (const f of files) {
  try {
    results = results.concat(extract(f));
  } catch (e) {
    // ignore
  }
}

results.sort((a,b)=> (a.prefix||'').localeCompare(b.prefix||'') || (a.route||'').localeCompare(b.route||''));
for (const r of results) {
  const full = `${r.http} ${r.prefix}${r.route ? (r.prefix.endsWith('/') || r.route.startsWith('/') ? '' : '/') + r.route : ''}`;
  console.log(full + '   -- ' + path.relative(process.cwd(), r.file));
}
