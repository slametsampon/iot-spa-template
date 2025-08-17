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
