import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly baseUrl = '/api/login';

  readonly isAuthenticated = signal(false);
  readonly userEmail = signal<string | null>(null);

  async login(email: string, password: string): Promise<boolean> {
    if (!email.trim() || !password.trim()) {
      return false;
    }
    await this.simulateDelay(80);
    this.isAuthenticated.set(true);
    this.userEmail.set(email);
    return true;
  }

  logout(): void {
    this.isAuthenticated.set(false);
    this.userEmail.set(null);
  }

  private simulateDelay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

