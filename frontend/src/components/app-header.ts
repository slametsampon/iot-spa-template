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
