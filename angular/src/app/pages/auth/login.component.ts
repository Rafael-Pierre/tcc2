import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'tf-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="login-page">
      <div class="card login-card">
        <header class="login-header">
          <h2 class="login-title">Acesso ao experimento</h2>
          <p class="login-subtitle">
            Use qualquer combinação de email e senha. Os dados são simulados e usados apenas para este estudo.
          </p>
        </header>

        <form class="form" (ngSubmit)="onSubmit()" novalidate>
          <div class="form-field">
            <label class="form-label" for="email">Email</label>
            <input
              id="email"
              class="form-input"
              type="email"
              [(ngModel)]="email"
              name="email"
              placeholder="voce@exemplo.com"
            />
          </div>

          <div class="form-field">
            <label class="form-label" for="password">Senha</label>
            <input
              id="password"
              class="form-input"
              type="password"
              [(ngModel)]="password"
              name="password"
              placeholder="********"
            />
          </div>

          <p *ngIf="showRequiredError()" class="form-error">
            Email e senha são obrigatórios.
          </p>
          <p *ngIf="error() && !showRequiredError()" class="form-error">
            {{ error() }}
          </p>

          <div class="form-actions">
            <button type="submit" class="app-button">Entrar</button>
          </div>

          <p class="muted-text">
            Esta tela de login é apenas uma simulação para o fluxo experimental. Nenhuma informação real é enviada para
            servidores.
          </p>
        </form>
      </div>
    </section>
  `,
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  touched = false;
  readonly error = signal<string | null>(null);

  showRequiredError(): boolean {
    return this.touched && (!this.email.trim() || !this.password.trim());
  }

  async onSubmit(): Promise<void> {
    this.touched = true;
    this.error.set(null);

    if (!this.email.trim() || !this.password.trim()) {
      this.error.set('Preencha email e senha para continuar.');
      return;
    }

    const ok = await this.auth.login(this.email, this.password);
    if (!ok) {
      this.error.set('Credenciais inválidas para este ambiente simulado.');
      return;
    }

    await this.router.navigate(['/dashboard']);
  }
}

