import {Component, inject} from '@angular/core';
import {RouterOutlet, RouterLink, Router} from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { AuthService } from './core/services/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private router = inject(Router);
  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/events']);
  }
}
