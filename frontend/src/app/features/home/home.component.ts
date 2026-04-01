import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventService } from '../../core/services/event/event.service';
import { EventCardComponent } from '../../shared/components/event-card/event-card.component';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, EventCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private eventService = inject(EventService);
  public authService = inject(AuthService);

  loading = signal(true);
  featuredEvents = signal<any[]>([]);

  ngOnInit() {
    this.eventService.getAllEvents(0, 3).subscribe({
      next: (page) => {
        this.featuredEvents.set(page.content.slice(0, 3));
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}
