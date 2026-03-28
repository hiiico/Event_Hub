import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../../core/services/event/event.service';
import { EventCardComponent } from '../../../shared/components/event-card/event-card.component';
import { Event } from '../../../shared/interfaces/event';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-event-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, EventCardComponent],
  templateUrl: './event-catalog.component.html',
  styleUrls: ['./event-catalog.component.css']
})
export class EventCatalogComponent implements OnInit {
  allEvents: Event[] = [];
  filteredEvents: Event[] = [];
  upcomingEvents: Event[] = [];
  loading = false;
  error = false;
  searchTerm = '';
  categoryFilter = '';
  dateFilter = '';
  dateFilterLabel = 'All';
  currentPage = 0;
  pageSize = 10;
  totalPages = 1;

  private searchSubject = new Subject<string>();

  constructor(private eventService: EventService, private cdr: ChangeDetectorRef) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchTerm = term;
      this.applyFilters();
      this.cdr.detectChanges();
    });
  }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents() {
    console.log('loadEvents called');
    this.loading = true;
    this.error = false;
    this.cdr.detectChanges();

    this.eventService.getAllEvents(0, 1000).subscribe({
      next: (page) => {
        console.log('Events received:', page);
        this.allEvents = page.content;
        this.upcomingEvents = this.computeUpcomingEvents(this.allEvents);
        this.applyFilters();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading events:', err);
        this.error = true;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  computeUpcomingEvents(events: Event[]): Event[] {
    const now = new Date();
    const weekLater = new Date();
    weekLater.setDate(now.getDate() + 7);
    return events
      .filter(e => new Date(e.dateTime) >= now && new Date(e.dateTime) <= weekLater)
      .slice(0, 5);
  }

  applyFilters() {
    let result = [...this.allEvents];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(e =>
        e.title.toLowerCase().includes(term) ||
        e.location.toLowerCase().includes(term)
      );
    }

    if (this.categoryFilter && this.categoryFilter !== 'all') {
      result = result.filter(e => e.category === this.categoryFilter);
    }

    if (this.dateFilter === 'week') {
      const now = new Date();
      const weekLater = new Date();
      weekLater.setDate(now.getDate() + 7);
      result = result.filter(e => {
        const d = new Date(e.dateTime);
        return d >= now && d <= weekLater;
      });
    } else if (this.dateFilter === 'month') {
      const now = new Date();
      const monthLater = new Date();
      monthLater.setMonth(now.getMonth() + 1);
      result = result.filter(e => {
        const d = new Date(e.dateTime);
        return d >= now && d <= monthLater;
      });
    }

    this.filteredEvents = result;
    this.totalPages = Math.ceil(this.filteredEvents.length / this.pageSize);
    this.currentPage = 0;
  }

  get paginatedEvents(): Event[] {
    const start = this.currentPage * this.pageSize;
    return this.filteredEvents.slice(start, start + this.pageSize);
  }

  onSearch(term: string) {
    this.searchSubject.next(term);
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
    }
  }

  filterByDate(range: string) {
    this.dateFilter = range;
    switch (range) {
      case 'week':
        this.dateFilterLabel = 'This week';
        break;
      case 'month':
        this.dateFilterLabel = 'This month';
        break;
      default:
        this.dateFilterLabel = 'All';
    }
    this.applyFilters();
  }

  toggleCategoryFilter() {
    const categories = ['all', 'Music', 'Tech', 'Art', 'Food'];
    const currentIndex = categories.indexOf(this.categoryFilter);
    const nextIndex = (currentIndex + 1) % categories.length;
    this.categoryFilter = categories[nextIndex];
    this.applyFilters();
  }
}
