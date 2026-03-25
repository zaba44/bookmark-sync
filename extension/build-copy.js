// Kopiuje wspólne pliki do chrome/ i firefox/
// Uruchamiany automatycznie po każdym npm run build

const fs   = require('fs');
const path = require('path');

const ROOT    = __dirname;
const TARGETS = ['chrome', 'firefox'];

// Pliki/foldery do skopiowania do każdego targetu
const SHARED = [
  'dist',
  '_locales',
  'icons',
  'popup.html',
  'options.html',
];

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function copyItem(src, dest) {
  if (!fs.existsSync(src)) { console.warn(`Brak: ${src}`); return; }
  const stat = fs.statSync(src);
  if (stat.isDirectory()) copyDir(src, dest);
  else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

for (const target of TARGETS) {
  const targetDir = path.join(ROOT, target);
  fs.mkdirSync(targetDir, { recursive: true });

  for (const item of SHARED) {
    const src  = path.join(ROOT, item);
    const dest = path.join(targetDir, item);
    copyItem(src, dest);
  }

  console.log(`✓ Skopiowano do ${target}/`);
}

console.log('Build zakończony.');
