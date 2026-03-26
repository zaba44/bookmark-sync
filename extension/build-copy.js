// Kopiuje wspólne pliki do chrome/ i firefox/
// Pliki JS lądują bezpośrednio w root (nie w dist/) - wymagane przez Mozilla
const fs   = require('fs');
const path = require('path');

const ROOT    = __dirname;
const TARGETS = ['chrome', 'firefox'];

// Pliki/foldery do skopiowania bezpośrednio
const SHARED = ['_locales', 'icons', 'popup.html', 'options.html'];

// Pliki JS z dist/ kopiowane do root (bez podfolderu dist/)
const JS_FILES = ['background.js', 'popup.js', 'options.js'];

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
  else { fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.copyFileSync(src, dest); }
}

for (const target of TARGETS) {
  const targetDir = path.join(ROOT, target);
  fs.mkdirSync(targetDir, { recursive: true });

  // Kopiuj zwykłe pliki/foldery
  for (const item of SHARED) {
    copyItem(path.join(ROOT, item), path.join(targetDir, item));
  }

  // Kopiuj JS z dist/ bezpośrednio do root (nie do dist/)
  for (const js of JS_FILES) {
    const src  = path.join(ROOT, 'dist', js);
    const dest = path.join(targetDir, js);  // root, nie dist/
    copyItem(src, dest);
  }

  console.log(`✓ Skopiowano do ${target}/`);
}
console.log('Build zakończony.');
