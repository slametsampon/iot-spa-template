## 🛠️ Setup Project `iot-spa-template` dari Awal

---

### ✅ 1. Buat Folder Proyek Baru

```bash
mkdir iot-spa-template
cd iot-spa-template
npm init -y
```

---

### ✅ 2. Install Dependency Utama

```bash
npm install lit @vaadin/router tailwindcss @tailwindcss/cli
npm install --save-dev esbuild concurrently cross-env typescript live-server gh-pages rimraf
```

---

### ✅ 3. Buat Struktur Direktori

```bash
$folders = @(
    "frontend/src/components",
    "frontend/src/views/dashboard",
    "frontend/src/views/settings",
    "frontend/src/views/shared",
    "frontend/src/pages",
    "frontend/src/services",
    "frontend/src/utils",
    "frontend/src/models",
    "frontend/src/assets",
    "public/data",
    "build/frontend"
)

foreach ($f in $folders) {
New-Item -ItemType Directory -Path $f -Force
}
```

---

### ✅ 4. Buat File Konfigurasi

#### 🔸 `tsconfig.base.json` (di root)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Node",
    "strict": true,
    "esModuleInterop": true,
    "baseUrl": ".",
    "paths": {
      "@components/*": ["frontend/src/components/*"],
      "@views/*": ["frontend/src/views/*"],
      "@pages/*": ["frontend/src/pages/*"],
      "@services/*": ["frontend/src/services/*"],
      "@utils/*": ["frontend/src/utils/*"],
      "@models/*": ["frontend/src/models/*"]
    }
  }
}
```

---

#### 🔸 `frontend/tsconfig.json`

```json
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "../build/frontend",
    "rootDir": "src",
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "lib": ["DOM", "ES2020"],
    "allowJs": true,
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

---

#### 🔸 `frontend/esbuild.config.js`

```js
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
```

---

### ✅ 5. Tambahkan Script ke `package.json`

Edit file `package.json` (di root) dan update:

```json
"scripts": {
  "dev": "concurrently \"npm run tailwind:watch\" \"npm run esbuild:watch\" \"npm run serve\"",
  "esbuild:watch": "cross-env NODE_ENV=development node frontend/esbuild.config.js --watch",
  "tailwind:watch": "npx @tailwindcss/cli -i ./frontend/src/styles.css -o ./build/frontend/styles.css --watch",
  "build:frontend": "npm run tailwind:build && node frontend/esbuild.config.js && npm run copy:html",
  "tailwind:build": "npx @tailwindcss/cli -i ./frontend/src/styles.css -o ./build/frontend/styles.css --minify",
  "serve": "live-server build/frontend",
  "copy:html": "copy frontend\\src\\index.html build\\frontend\\",
  "clean": "rimraf build/frontend",
  "deploy:github": "npm run build:frontend && gh-pages -d build/frontend"
}
```

> Ganti `copy` (Windows) jadi `cp` (Linux/macOS) jika kamu di Unix-based system.

---

### ✅ 6. Inisialisasi Tailwind CSS

Buat file frontend/src/style.css

```css
@import 'tailwindcss';
```

---

### ✅ 7. Tambahkan Isi File Minimum

#### 📄 `frontend/src/index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>IoT SPA Template</title>
    <link rel="stylesheet" href="./styles.css" />
    <script type="module" src="./main.js"></script>
  </head>
  <body class="bg-gray-100 text-gray-800">
    <main id="app"></main>
  </body>
</html>
```

---

#### 📄 `frontend/src/main.ts`

```ts
import './components/app-shell.ts';
```

---

### ✅ 8. Jalankan!

```bash
npm run dev
```

---

### 🚧 9. Build Produksi (untuk deploy / ESP32)

```bash
npm run build:frontend
```

---

### 🧹 10. Tambahkan `.gitignore`

```bash
echo "node_modules/\nbuild/\ndist/\n.env\n" > .gitignore
```

---

### ✅ Project `iot-spa-template` Siap Digunakan!

Kamu sudah:

- Men-setup seluruh file dari awal
- Membuat struktur CDD modular
- Siap integrasi MQTT, REST, atau UI lainnya

---

Berikut adalah **panduan lengkap dan praktis untuk setup project `iot-spa-template` dari awal**
— bisa langsung dipakai oleh tim atau dijadikan instruksi awal di `README.md`.

---

## 🚀 Cara Menggunakan Project `iot-spa-template`

### 🧾 Prasyarat

Pastikan sudah terinstal di sistem kamu:

| Tools          | Versi Minimum              |
| -------------- | -------------------------- |
| Node.js        | `v18.x` atau lebih         |
| npm            | `v9.x` atau lebih          |
| Git (optional) | Untuk clone dan versioning |

---

### 📦 1. Clone / Download Template

```bash
git clone https://github.com/namamu/iot-spa-template.git
cd iot-spa-template
```

Atau, jika kamu mulai dari ZIP:

```bash
unzip iot-spa-template.zip
cd iot-spa-template
```

---

### 📁 2. Struktur Direktori Awal

Setelah masuk ke folder proyek, struktur dasar akan seperti:

```
iot-spa-template/
├── frontend/
│   ├── src/
│   ├── esbuild.config.js
│   ├── tsconfig.json
├── tsconfig.base.json
├── package.json
└── README.md
```

---

### 📥 3. Install Dependensi

```bash
npm install
```

---

### 👨‍💻 4. Jalankan dalam Mode Dev

```bash
npm run dev
```

Ini akan:

- Menjalankan esbuild dalam mode watch
- Menjalankan Tailwind CLI untuk CSS
- Menyajikan proyek via `live-server` di `http://127.0.0.1:8080` (default)

---

### 🛠️ 5. Build Produksi (untuk ESP32 / Raspberry Pi / Hosting)

```bash
npm run build:frontend
```

Output akan masuk ke:

```
build/frontend/
├── index.html
├── bundle.js
├── styles.css
└── assets/
```

> Folder ini bisa langsung di-_upload_ ke ESP32 (via SPIFFS) atau Raspberry Pi (via NGINX, Node server, dsb.)

---

### 🧹 6. Membersihkan Build

```bash
npm run clean
```

---

### 🌍 7. Deploy ke GitHub Pages (opsional)

Jika kamu ingin demo langsung di GitHub:

```bash
npm run deploy:github
```

> Pastikan `gh-pages` sudah dikonfigurasi di repo Git kamu.

---

### 🔧 Optional: Konfigurasi Ulang Alias

Untuk memudahkan import, edit `tsconfig.base.json`:

```json
"paths": {
  "@components/*": ["frontend/src/components/*"],
  "@views/*": ["frontend/src/views/*"],
  "@pages/*": ["frontend/src/pages/*"],
  "@services/*": ["frontend/src/services/*"],
  "@utils/*": ["frontend/src/utils/*"],
  "@models/*": ["frontend/src/models/*"]
}
```

---

### ✅ Proyek Siap Digunakan

📦 Template ini sekarang siap untuk:

- SPA IoT kecil-menengah
- Raspberry Pi dashboard
- ESP32-hosted UI
- MQTT atau REST integration (via `services/`)

---
