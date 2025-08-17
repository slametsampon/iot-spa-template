import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { appInfo } from '@shared/app-info';

@customElement('page-about')
export class PageAbout extends LitElement {
  createRenderRoot() {
    return this; // gunakan light DOM agar Tailwind CSS global bekerja
  }

  render() {
    return html`
      <section class="p-6 md:p-10 max-w-5xl mx-auto">
        <h1 class="text-3xl font-bold text-center text-blue-700 mb-6">
          Tentang ${appInfo.name}
        </h1>

        <p class="text-base text-gray-700 leading-relaxed mb-4">
          <span class="font-semibold text-blue-600">${appInfo.name}</span>
          adalah sebuah starter template SPA berbasis IoT, dibangun dengan
          pendekatan modular, ringan, dan optimal untuk digunakan di perangkat
          embedded seperti Raspberry Pi dan ESP32.
        </p>

        <p class="text-base text-gray-700 leading-relaxed mb-4">
          Proyek ini ditujukan bagi pengembang IoT yang menginginkan arsitektur
          bersih dan efisien dalam mengembangkan sistem pemantauan atau kontrol
          berbasis web, dengan dukungan komponen frontend modern dan integrasi
          protokol komunikasi real-time seperti MQTT.
        </p>

        <h2 class="text-xl font-semibold text-blue-700 mt-8 mb-4">
          Teknologi yang Digunakan
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <h3 class="text-lg font-semibold text-blue-600 mb-2">Frontend</h3>
            <ul class="list-disc list-inside text-gray-700">
              <li>Framework: <span class="font-medium">LitElement</span></li>
              <li>
                Styling: <span class="font-medium">Tailwind CSS (inline)</span>
              </li>
              <li>Build Tool: <span class="font-medium">esbuild</span></li>
              <li>
                Arsitektur:
                <span class="font-medium">CDD + SoC + TypeScript</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-blue-600 mb-2">Backend</h3>
            <ul class="list-disc list-inside text-gray-700">
              <li>
                Platform: <span class="font-medium">Node.js + TypeScript</span>
              </li>
              <li>Framework: <span class="font-medium">Fastify</span></li>
              <li>
                API: <span class="font-medium">RESTful & MQTT Bridge</span>
              </li>
              <li>Database: <span class="font-medium">SQLite</span></li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-blue-600 mb-2">IoT Node</h3>
            <ul class="list-disc list-inside text-gray-700">
              <li>Chip: <span class="font-medium">ESP32</span></li>
              <li>Firmware: <span class="font-medium">Arduino C++</span></li>
              <li>Protocol: <span class="font-medium">MQTT</span></li>
              <li>Koneksi: <span class="font-medium">WiFi</span></li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-blue-600 mb-2">DevOps</h3>
            <ul class="list-disc list-inside text-gray-700">
              <li>Hosting: <span class="font-medium">Raspberry Pi</span></li>
              <li>Broker: <span class="font-medium">Mosquitto</span></li>
              <li>Repo: <span class="font-medium">GitHub</span></li>
              <li>
                IDE: <span class="font-medium">VS Code + Arduino CE</span>
              </li>
            </ul>
          </div>
        </div>

        <h2 class="text-xl font-semibold text-blue-700 mt-10 mb-4">Penutup</h2>

        <p class="text-base text-gray-700 leading-relaxed mb-2">
          Template ini dikembangkan secara terbuka dan dapat disesuaikan untuk
          berbagai kebutuhan project IoT. Versi:
          <strong>${appInfo.version}</strong> · &copy; ${appInfo.year}
        </p>
      </section>
    `;
  }
}
