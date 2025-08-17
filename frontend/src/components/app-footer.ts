import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { appInfo } from '@shared/app-info';

@customElement('app-footer')
export class AppFooter extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <footer class="p-4 bg-gray-200 text-center text-sm text-gray-600 mt-auto">
        © ${appInfo.year} ${appInfo.name} v${appInfo.version} ·
        <a href="/about" class="text-blue-600 hover:underline">About</a>
      </footer>
    `;
  }
}
