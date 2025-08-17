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
