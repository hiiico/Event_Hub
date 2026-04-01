import {Component, inject} from '@angular/core';
import {RouterOutlet, RouterLink, Router} from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { AuthService } from './core/services/auth/auth.service';
import {HeaderComponent} from './shared/components/header-component/header.component';
import {FooterComponent} from './shared/components/footer-component/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
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
