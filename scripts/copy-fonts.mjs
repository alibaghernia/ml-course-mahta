import { cpSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

const PROJECT_ROOT = '/vercel/share/v0-project';
const FONT_DEST = resolve(PROJECT_ROOT, 'public/fonts');
const VAZIRMATN_SRC = resolve(PROJECT_ROOT, 'node_modules/vazirmatn');

// Find the woff2 font files in the vazirmatn package
const possiblePaths = [
  join(VAZIRMATN_SRC, 'fonts/webfonts'),
  join(VAZIRMATN_SRC, 'Vazirmatn-font-face.css'),
  VAZIRMATN_SRC,
];

if (!existsSync(FONT_DEST)) {
  mkdirSync(FONT_DEST, { recursive: true });
  console.log('Created fonts directory');
}

// List the vazirmatn package to understand its structure
function findWoff2Files(dir, depth = 0) {
  if (depth > 3 || !existsSync(dir)) return [];
  const files = [];
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isFile() && entry.name.endsWith('.woff2')) {
        files.push(fullPath);
      } else if (entry.isDirectory() && !entry.name.startsWith('.')) {
        files.push(...findWoff2Files(fullPath, depth + 1));
      }
    }
  } catch (e) {
    console.log(`Cannot read ${dir}: ${e.message}`);
  }
  return files;
}

console.log('Searching for font files in vazirmatn package...');
const woff2Files = findWoff2Files(VAZIRMATN_SRC);

if (woff2Files.length === 0) {
  console.error('No woff2 files found in vazirmatn package!');
  // List package contents for debugging
  try {
    const entries = readdirSync(VAZIRMATN_SRC);
    console.log('Package contents:', entries);
  } catch (e) {
    console.error('Could not list package:', e.message);
  }
  process.exit(1);
}

console.log(`Found ${woff2Files.length} font files`);

for (const fontPath of woff2Files) {
  const fileName = fontPath.split('/').pop();
  const destPath = join(FONT_DEST, fileName);
  cpSync(fontPath, destPath);
  console.log(`Copied: ${fileName}`);
}

console.log('Font copy complete!');
