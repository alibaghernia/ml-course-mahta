import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const FONT_DIR = '/vercel/share/v0-project/public/fonts';

const fonts = [
  {
    name: 'Vazirmatn-Thin',
    weight: 100,
    url: 'https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/fonts/webfonts/Vazirmatn-Thin.woff2',
  },
  {
    name: 'Vazirmatn-ExtraLight',
    weight: 200,
    url: 'https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/fonts/webfonts/Vazirmatn-ExtraLight.woff2',
  },
  {
    name: 'Vazirmatn-Light',
    weight: 300,
    url: 'https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/fonts/webfonts/Vazirmatn-Light.woff2',
  },
  {
    name: 'Vazirmatn-Regular',
    weight: 400,
    url: 'https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/fonts/webfonts/Vazirmatn-Regular.woff2',
  },
  {
    name: 'Vazirmatn-Medium',
    weight: 500,
    url: 'https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/fonts/webfonts/Vazirmatn-Medium.woff2',
  },
  {
    name: 'Vazirmatn-SemiBold',
    weight: 600,
    url: 'https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/fonts/webfonts/Vazirmatn-SemiBold.woff2',
  },
  {
    name: 'Vazirmatn-Bold',
    weight: 700,
    url: 'https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/fonts/webfonts/Vazirmatn-Bold.woff2',
  },
  {
    name: 'Vazirmatn-ExtraBold',
    weight: 800,
    url: 'https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/fonts/webfonts/Vazirmatn-ExtraBold.woff2',
  },
  {
    name: 'Vazirmatn-Black',
    weight: 900,
    url: 'https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/fonts/webfonts/Vazirmatn-Black.woff2',
  },
];

async function downloadFonts() {
  if (!existsSync(FONT_DIR)) {
    await mkdir(FONT_DIR, { recursive: true });
    console.log('Created fonts directory:', FONT_DIR);
  }

  for (const font of fonts) {
    const filePath = `${FONT_DIR}/${font.name}.woff2`;
    if (existsSync(filePath)) {
      console.log(`Skipping ${font.name} (already exists)`);
      continue;
    }

    console.log(`Downloading ${font.name}...`);
    try {
      const response = await fetch(font.url);
      if (!response.ok) {
        console.error(`Failed to download ${font.name}: ${response.status}`);
        continue;
      }
      const buffer = Buffer.from(await response.arrayBuffer());
      await writeFile(filePath, buffer);
      console.log(`Saved ${font.name} (${buffer.length} bytes)`);
    } catch (err) {
      console.error(`Error downloading ${font.name}:`, err.message);
    }
  }

  console.log('Font download complete!');
}

downloadFonts();
