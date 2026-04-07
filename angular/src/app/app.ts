import { Component, computed, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth.service';
import { TaskService } from './services/task.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly auth = inject(AuthService);
  private readonly taskService = inject(TaskService);

  readonly isAuthenticated = this.auth.isAuthenticated;
  readonly userEmail = this.auth.userEmail;

  readonly completionPercentage = computed(() => {
    const snapshot = this.taskService.tasks();
    const total = snapshot.length || 1;
    const completed = snapshot.filter((t) => t.status === 'completed').length;
    return Math.round((completed / total) * 100);
  });

  onLogout(): void {
    this.auth.logout();
  }
}
