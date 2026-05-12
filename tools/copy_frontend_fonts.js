const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'frontend', 'src', 'assets', 'fonts');
const destDir = path.join(__dirname, '..', 'frontend', 'public', 'assets', 'fonts');

if (!fs.existsSync(srcDir)) {
  console.error('Source fonts dir not found:', srcDir);
  process.exit(1);
}

fs.mkdirSync(destDir, { recursive: true });

const files = fs.readdirSync(srcDir);
for (const f of files) {
  const src = path.join(srcDir, f);
  const dest = path.join(destDir, f);
  fs.copyFileSync(src, dest);
  console.log('Copied', f);
}
console.log('Done.');
