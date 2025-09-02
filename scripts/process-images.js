const path = require('path');
const fs = require('fs/promises');
const sharp = require('sharp');
const fg = require('fast-glob');
const chokidar = require('chokidar');

const SRC_DIR = path.join(__dirname, '..', 'images');
const OUT_DIR = path.join(SRC_DIR, 'optimized');

// Generate single optimized image with 3:2 aspect ratio
const TARGET_WIDTH = 800;
const ASPECT_RATIO = 3 / 2; // width / height

async function ensureDir(dir) {
  try { await fs.mkdir(dir, { recursive: true }); } catch (e) {}
}

function processFile(file) {
  return (async () => {
    const rel = path.relative(SRC_DIR, file);
    // skip optimized folder
    if (rel.startsWith('optimized')) return;
    
    // Remove "originals/" from the path if it exists
    let outputPath = rel;
    if (outputPath.startsWith('originals/')) {
      outputPath = outputPath.substring('originals/'.length);
    }
    
    // Preserve directory structure in optimized folder (without "originals")
    const parsedPath = path.parse(outputPath);
    const outputDir = path.join(OUT_DIR, parsedPath.dir);
    await ensureDir(outputDir);

    try {
      const image = sharp(file);
      const meta = await image.metadata();

      // Don't upscale if original is smaller than target
      const w = meta.width && meta.width < TARGET_WIDTH ? meta.width : TARGET_WIDTH;
      const h = Math.round(w / ASPECT_RATIO);
      
      const baseName = path.basename(file, path.extname(file));
      const outWebp = path.join(outputDir, `${baseName}.webp`);
      
      // Create single WebP with center crop to maintain 3:2 aspect ratio
      await image
        .resize({ 
          width: w, 
          height: h, 
          fit: 'cover',     // center crop
          position: 'center'
        })
        .webp({ quality: 80, effort: 6 })
        .toFile(outWebp);

      const outputRel = path.relative(SRC_DIR, outWebp);
      console.log(`Processed: ${rel} -> ${outputRel} (${w}x${h})`);
    } catch (err) {
      console.error(`Failed processing ${file}:`, err.message);
    }
  })();
}

async function build() {
  await ensureDir(OUT_DIR);
  const entries = await fg(['**/*.{jpg,jpeg,png}'], { cwd: SRC_DIR, absolute: true, dot: false });
  await Promise.all(entries.map(processFile));
}

if (process.argv.includes('--watch')) {
  console.log('Watching images...');
  const watcher = chokidar.watch([`${SRC_DIR}/**/*.{jpg,jpeg,png}`], { ignored: /optimized/ });
  watcher.on('add', p => processFile(p));
  watcher.on('change', p => processFile(p));
} else {
  build().catch(err => { console.error(err); process.exit(1); });
}
