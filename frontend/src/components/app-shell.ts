import { LitElement, html } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';

import './app-header.ts';
import './app-footer.ts';
import './app-main.ts';
import { AuthService } from '@services/auth-service.ts';

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
