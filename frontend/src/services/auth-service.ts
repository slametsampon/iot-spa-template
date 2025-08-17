export class AuthService {
  static isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }

  static getUser(): { username: string; avatarUrl?: string } | null {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }

  static login(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  static logout() {
    localStorage.removeItem('user');
  }
}
