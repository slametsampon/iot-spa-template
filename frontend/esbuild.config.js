const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

const isDev = process.env.NODE_ENV === 'development';
const isPreRelease = process.env.NODE_ENV === 'pre-release';
const isProd = process.env.NODE_ENV === 'production';

let publicPath = '/';
if (isPreRelease) publicPath = '/iot-spa-template';
if (isProd) publicPath = '';

const buildOptions = {
  absWorkingDir: path.resolve(__dirname),
  entryPoints: ['src/main.ts'],
  bundle: true,
  sourcemap: isDev || isPreRelease,
  minify: isProd,
  outdir: path.resolve(__dirname, '../build/frontend'),
  target: ['es2020'],
  format: 'esm',
  tsconfig: path.resolve(__dirname, 'tsconfig.json'),
  define: {
    'process.env.NODE_ENV': JSON.stringify(
      process.env.NODE_ENV || 'development'
    ),
  },
  loader: {
    '.ts': 'ts',
    '.css': 'css',
    '.png': 'file',
    '.jpg': 'file',
    '.svg': 'file',
    '.ico': 'file',
    '.webp': 'file',
  },
  publicPath,
  logLevel: 'info',
};

// Utility functions
const ensureDirExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
};

const copyFile = (src, dest) => {
  try {
    if (!fs.existsSync(src)) {
      throw new Error(`Source file ${src} not found.`);
    }
    fs.copyFileSync(src, dest);
    console.log(`Copied ${src} to ${dest}`);
  } catch (error) {
    console.error(`Failed to copy ${src}:`, error.message);
  }
};

const copyFolderRecursive = (src, dest) => {
  if (!fs.existsSync(src)) {
    console.warn(`Warning: Source folder ${src} does not exist. Skipping.`);
    return;
  }

  ensureDirExists(dest);

  const files = fs.readdirSync(src);
  files.forEach((file) => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);

    if (fs.statSync(srcPath).isDirectory()) {
      copyFolderRecursive(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  });
};

const startBuild = async () => {
  console.log(
    `🔧 Starting esbuild in ${process.env.NODE_ENV || 'development'} mode...`
  );
  try {
    const ctx = await esbuild.context(buildOptions);
    if (process.argv.includes('--watch') || isDev) {
      await ctx.watch();
      console.log('👀 Watching for changes...');
    } else {
      await ctx.rebuild();
      await ctx.dispose();
      console.log('✅ Build complete.');
    }
  } catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }
};

const main = async () => {
  const outputDir = path.resolve(__dirname, '../build/frontend');
  ensureDirExists(outputDir);

  await startBuild();

  // Copy static assets
  copyFile('frontend/src/index.html', path.join(outputDir, 'index.html'));
  copyFolderRecursive('frontend/src/assets', path.join(outputDir, 'assets'));
};

main();
