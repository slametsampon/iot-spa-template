- [🛠️ Setup Project `iot-spa-template` dari Awal](#️-setup-project-iot-spa-template-dari-awal)
  - [✅ 1. Buat Folder Proyek Baru](#-1-buat-folder-proyek-baru)
  - [✅ 2. Install Dependency Utama](#-2-install-dependency-utama)
  - [✅ 3. Buat Struktur Direktori](#-3-buat-struktur-direktori)
  - [✅ 4. Buat File Konfigurasi](#-4-buat-file-konfigurasi)
    - [🔸 `tsconfig.base.json` (di root)](#-tsconfigbasejson-di-root)
    - [🔸 `frontend/tsconfig.json`](#-frontendtsconfigjson)
    - [🔸 `frontend/esbuild.config.js`](#-frontendesbuildconfigjs)
  - [✅ 5. Tambahkan Script ke `package.json`](#-5-tambahkan-script-ke-packagejson)
  - [✅ 6. Inisialisasi Tailwind CSS](#-6-inisialisasi-tailwind-css)
  - [✅ 7. Tambahkan Isi File Minimum](#-7-tambahkan-isi-file-minimum)
    - [📄 `frontend/src/index.html`](#-frontendsrcindexhtml)
    - [📄 `frontend/src/main.ts`](#-frontendsrcmaints)
    - [📄 `frontend/src/components/app-shell.ts`](#-frontendsrccomponentsapp-shellts)
    - [📄 `frontend/src/components/app-main.ts`](#-frontendsrccomponentsapp-maints)
  - [🚧 9. Build Produksi (untuk deploy / ESP32)](#-9-build-produksi-untuk-deploy--esp32)
  - [🧹 10. Tambahkan `.gitignore`](#-10-tambahkan-gitignore)
  - [✅ Project `iot-spa-template` Siap Digunakan!](#-project-iot-spa-template-siap-digunakan)
- [🚀 Cara Menggunakan Project `iot-spa-template`](#-cara-menggunakan-project-iot-spa-template)
  - [🧾 Prasyarat](#-prasyarat)
  - [📦 1. Clone / Download Template](#-1-clone--download-template)
  - [📁 2. Struktur Direktori Awal](#-2-struktur-direktori-awal)
  - [📥 3. Install Dependensi](#-3-install-dependensi)
  - [👨‍💻 4. Jalankan dalam Mode Dev](#-4-jalankan-dalam-mode-dev)
  - [🛠️ 5. Build Produksi (untuk ESP32 / Raspberry Pi / Hosting)](#️-5-build-produksi-untuk-esp32--raspberry-pi--hosting)
  - [🧹 6. Membersihkan Build](#-6-membersihkan-build)
  - [🌍 7. Deploy ke GitHub Pages (opsional)](#-7-deploy-ke-github-pages-opsional)
  - [🔧 Optional: Konfigurasi Ulang Alias](#-optional-konfigurasi-ulang-alias)
  - [✅ Proyek Siap Digunakan](#-proyek-siap-digunakan)

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
  <body class="flex flex-col min-h-screen bg-gray-50">
    <app-shell></app-shell>
  </body>
</html>
```

---

#### 📄 `frontend/src/main.ts`

```ts
import './components/app-shell.ts';
```

#### 📄 `frontend/src/components/app-shell.ts`

```ts
import { LitElement, html } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';

import './app-header.ts';
import './app-footer.ts';
import './app-main.ts';
import { AuthService } from '../services/auth-service';

@customElement('app-shell')
export class AppShell extends LitElement {
  // Gunakan light DOM agar Tailwind global tetap berlaku
  createRenderRoot() {
    return this;
  }

  // Tentukan basePath untuk lokal vs GitHub Pages
  private readonly basePath =
    window.location.hostname === '127.0.0.1' ? '/' : '/iot-spa-template/';

  @state() private currentPath = window.location.pathname;

  @query('app-main') private appMainEl!: HTMLElement & {
    navigate: (path: string) => void;
  };

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('popstate', this._onPopState);
  }

  disconnectedCallback() {
    window.removeEventListener('popstate', this._onPopState);
    super.disconnectedCallback();
  }

  private _onPopState = () => {
    this.currentPath = window.location.pathname;
  };

  private _onNavChanged = (e: CustomEvent<{ path: string }>) => {
    const rawPath = e.detail.path.replace(/^\/+/, '');
    const target = `/${rawPath}`;
    this.appMainEl?.navigate(target);
  };

  private _onLoginClick = () => this.appMainEl?.navigate('/login');

  private _onLogoutClick = () => {
    AuthService.logout();
    this.appMainEl?.navigate('/');
    this.requestUpdate(); // refresh props di header
  };

  private _onProfileClick = () => this.appMainEl?.navigate('/dashboard');

  private _onNavigateTo = (e: CustomEvent<{ path: string }>) =>
    this.appMainEl?.navigate(e.detail.path);

  private _onAuthChanged = () => this.requestUpdate();

  render() {
    return html`
      <app-header
        .currentPath=${this.currentPath}
        .username=${AuthService.getUser()?.username ?? 'Guest'}
        .avatarUrl=${AuthService.getUser()?.avatarUrl ?? ''}
        .isLoggedIn=${AuthService.isLoggedIn()}
        @nav-changed=${this._onNavChanged}
        @login-click=${this._onLoginClick}
        @logout-click=${this._onLogoutClick}
        @profile-click=${this._onProfileClick}
      >
      </app-header>

      <app-main
        class="flex-grow"
        .basePath=${this.basePath}
        @route-changed=${(ev: CustomEvent<{ path: string }>) => {
          this.currentPath = ev.detail.path;
        }}
        @navigate-to=${this._onNavigateTo}
        @auth-changed=${this._onAuthChanged}
      >
      </app-main>

      <app-footer></app-footer>
    `;
  }
}
```

#### 📄 `frontend/src/components/app-main.ts`

````ts
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Router } from '@vaadin/router';

import '@pages/page-home.ts';
import '@pages/page-dashboard.ts';
import '@pages/page-login.ts';

@customElement('app-main')
export class AppMain extends LitElement {
  createRenderRoot() {
    return this;
  }

  @property() basePath: string = '/';

  private _router?: Router;

  firstUpdated() {
    const outlet =
      this.shadowRoot?.getElementById('outlet') ??
      this.querySelector('#outlet');
    if (!outlet) return;

    const router = new Router(outlet);
    router.setRoutes([
      { path: '/', component: 'page-home' },
      { path: '/dashboard', component: 'page-dashboard' },
      { path: '/login', component: 'page-login' },
    ]);

    // @ts-ignore
    router.subscribe((ctx) => {
      this.dispatchEvent(
        new CustomEvent('route-changed', {
          detail: { path: ctx.pathname },
          bubbles: true,
          composed: true,
        })
      );
    });

    this._router = router;
  }

  navigate(path: string) {
    Router.go(path); // ✅ OK
  }

  render() {
    return html`<div id="outlet" class="p-4"></div>`;
  }
}
```

#### 📄 `frontend/src/components/app-header.ts`
```ts
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('app-header')
export class AppHeader extends LitElement {
  createRenderRoot() {
    return this;
  }

  @property() currentPath: string = '/';
  @property() username: string = 'Guest';
  @property() avatarUrl: string = '';
  @property({ type: Boolean }) isLoggedIn = false;

  render() {
    return html`
      <header
        class="p-4 bg-blue-600 text-white flex justify-between items-center"
      >
        <div class="text-lg font-bold">IoT Dashboard</div>
        <nav class="flex gap-4">
          <button @click=${() => this._navigate('/')} class="hover:underline">
            Home
          </button>
          <button
            @click=${() => this._navigate('/dashboard')}
            class="hover:underline"
          >
            Dashboard
          </button>
          ${this.isLoggedIn
            ? html`
                <button
                  @click=${() =>
                    this.dispatchEvent(new CustomEvent('profile-click'))}
                >
                  Profile
                </button>
                <button
                  @click=${() =>
                    this.dispatchEvent(new CustomEvent('logout-click'))}
                >
                  Logout
                </button>
              `
            : html`
                <button
                  @click=${() =>
                    this.dispatchEvent(new CustomEvent('login-click'))}
                >
                  Login
                </button>
              `}
        </nav>
      </header>
    `;
  }

  private _navigate(path: string) {
    this.dispatchEvent(
      new CustomEvent('nav-changed', {
        detail: { path },
        bubbles: true,
        composed: true,
      })
    );
  }
}
```
#### 📄 `frontend/src/components/app-footer.ts`
```js
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('app-footer')
export class AppFooter extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <footer class="p-4 bg-gray-200 text-center text-sm text-gray-600 mt-auto">
        © ${new Date().getFullYear()} IoT SPA Template. All rights reserved.
      </footer>
    `;
  }
}

```
#### 📄 `frontend/src/pages/page-dashboard.ts`
```js
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import '@views/dashboard/sensor-card.ts';
import '@views/dashboard/chart-card.ts';

@customElement('page-dashboard')
export class PageDashboard extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <section class="mt-6 px-4">
        <h1 class="text-2xl font-semibold mb-4">📊 Dashboard</h1>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <sensor-card label="Suhu" value="25.3" unit="°C"></sensor-card>
          <sensor-card label="Kelembapan" value="60" unit="%"></sensor-card>
          <sensor-card label="pH Tanah" value="6.5" unit="pH"></sensor-card>
        </div>

        <chart-card></chart-card>
      </section>
    `;
  }
}

```
#### 📄 `frontend/src/pages/page-home.ts`
```js
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('page-home')
export class PageHome extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <section class="text-center mt-10">
        <h1 class="text-3xl font-bold">🌱 IoT SPA Template</h1>
        <p class="text-gray-600 mt-2">Halaman Beranda / Home</p>
      </section>
    `;
  }
}

```
#### 📄 `frontend/src/pages/page-login.ts`
```js
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('page-login')
export class PageLogin extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <section
        class="mt-10 max-w-sm mx-auto p-4 border rounded bg-white shadow"
      >
        <h1 class="text-xl font-bold mb-4">🔐 Login</h1>
        <form>
          <input
            type="text"
            placeholder="Username"
            class="block w-full mb-3 px-3 py-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            class="block w-full mb-3 px-3 py-2 border rounded"
          />
          <button
            type="submit"
            class="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </section>
    `;
  }
}

```
#### 📄 `frontend/src/views/dashboard/chart-card.ts`
```js
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('chart-card')
export class ChartCard extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <div class="p-4 border rounded shadow bg-white">
        <div class="text-sm text-gray-600 mb-2">Realtime Chart</div>
        <div
          class="w-full h-32 bg-gradient-to-r from-blue-200 to-blue-400 rounded animate-pulse"
        ></div>
      </div>
    `;
  }
}

```
#### 📄 `frontend/src/views/dashboard/sensor-card.ts`
```js
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('sensor-card')
export class SensorCard extends LitElement {
  createRenderRoot() {
    return this;
  }

  @property() label = 'Temperature';
  @property() value = '25.3';
  @property() unit = '°C';

  render() {
    return html`
      <div class="p-4 border rounded shadow bg-white">
        <div class="text-sm text-gray-600">${this.label}</div>
        <div class="text-xl font-bold">
          ${this.value} <span class="text-sm font-normal">${this.unit}</span>
        </div>
      </div>
    `;
  }
}

```
---

### ✅ 8. Jalankan!

```bash
npm run dev
````

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
