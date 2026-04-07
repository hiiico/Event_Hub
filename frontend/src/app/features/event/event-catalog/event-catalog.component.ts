import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../../core/services/event/event.service';
import { EventCardComponent } from '../../../shared/components/event-card/event-card.component';
import { Event } from '../../../shared/interfaces/event';
import { EventSearchComponent } from '../../../shared/components/event-search/event-search.component';
import { GeolocationService } from '../../../core/services/geolocation/geolocation.service';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-event-catalog',
  standalone: true,
  imports: [CommonModule, EventCardComponent, EventSearchComponent],
  templateUrl: './event-catalog.component.html',
  styleUrls: ['./event-catalog.component.css']
})
export class EventCatalogComponent implements OnInit {
  allEvents: Event[] = [];
  filteredEvents: Event[] = [];
  upcomingEvents: Event[] = [];
  nearbyEvents: Event[] = [];
  loading = false;
  error = false;
  searchTerm = '';
  categoryFilter = '';
  dateFilter = '';
  dateFilterLabel = 'All';
  currentPage = 0;
  pageSize = 4;
  totalPages = 1;
  userLocation: { lat: number; lon: number } | null = null;
  locationLoading = false;
  locationError = '';
  locationEnabled = false;

  private searchSubject = new Subject<string>();

  constructor(
    private eventService: EventService,
    private geolocationService: GeolocationService,
    private cdr: ChangeDetectorRef
  ) {
    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(term => {
        this.searchTerm = term;
        this.applyFilters();
        this.cdr.detectChanges();
      });
  }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents() {
    this.loading = true;
    this.error = false;
    this.eventService.getAllEvents(0, 1000).subscribe({
      next: (page) => {
        this.allEvents = page.content || [];
        this.refreshUpcomingEvents();
        this.applyFilters();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = true;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadNearbyEvents() {
    if (this.locationLoading) return;
    this.locationLoading = true;
    this.locationError = '';
    this.geolocationService.getCurrentPosition().subscribe({
      next: (position) => {
        this.userLocation = { lat: position.coords.latitude, lon: position.coords.longitude };
        this.locationEnabled = true;
        this.computeNearbyEvents();
        this.refreshUpcomingEvents();
        this.applyFilters();
        this.locationLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.locationError = 'Unable to get your location.';
        this.locationEnabled = false;
        this.locationLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  disableLocationFilter() {
    this.locationEnabled = false;
    this.userLocation = null;
    this.nearbyEvents = [];
    this.refreshUpcomingEvents();
    this.applyFilters();
    this.cdr.detectChanges();
  }

  computeNearbyEvents() {
    if (!this.userLocation) return;
    const now = new Date();
    this.nearbyEvents = this.allEvents
      .filter(e => e.latitude && e.longitude && new Date(e.dateTime) >= now &&
        this.geolocationService.calculateDistance(this.userLocation!.lat, this.userLocation!.lon, e.latitude!, e.longitude!) <= 50)
      .sort((a,b) => this.geolocationService.calculateDistance(this.userLocation!.lat, this.userLocation!.lon, a.latitude!, a.longitude!) -
        this.geolocationService.calculateDistance(this.userLocation!.lat, this.userLocation!.lon, b.latitude!, b.longitude!))
      .slice(0, 20);
  }

  refreshUpcomingEvents() {
    this.upcomingEvents = this.computeUpcomingEvents(this.allEvents);
  }

  computeUpcomingEvents(events: Event[]): Event[] {
    let candidates = [...events];
    if (this.locationEnabled && this.userLocation) {
      candidates = candidates.filter(e => e.latitude && e.longitude &&
        this.geolocationService.calculateDistance(this.userLocation!.lat, this.userLocation!.lon, e.latitude!, e.longitude!) <= 50);
    }
    const now = new Date();
    const weekLater = new Date(); weekLater.setDate(now.getDate() + 7);
    let upcoming = candidates.filter(e => new Date(e.dateTime) >= now && new Date(e.dateTime) <= weekLater)
      .sort((a,b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()).slice(0,20);
    if (upcoming.length === 0 && events.length) {
      upcoming = candidates.filter(e => new Date(e.dateTime) >= now)
        .sort((a,b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()).slice(0,20);
    }
    return upcoming;
  }

  applyFilters() {
    let result = [...this.allEvents];
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(e => e.title.toLowerCase().includes(term) || e.location.toLowerCase().includes(term));
    }
    if (this.categoryFilter) {
      result = result.filter(e => e.category === this.categoryFilter);
    }
    if (this.dateFilter === 'week') {
      const now = new Date(), weekLater = new Date(); weekLater.setDate(now.getDate() + 7);
      result = result.filter(e => new Date(e.dateTime) >= now && new Date(e.dateTime) <= weekLater);
    } else if (this.dateFilter === 'month') {
      const now = new Date(), monthLater = new Date(); monthLater.setMonth(now.getMonth() + 1);
      result = result.filter(e => new Date(e.dateTime) >= now && new Date(e.dateTime) <= monthLater);
    }
    if (this.locationEnabled && this.userLocation) {
      result = result.filter(e => e.latitude && e.longitude &&
        this.geolocationService.calculateDistance(this.userLocation!.lat, this.userLocation!.lon, e.latitude!, e.longitude!) <= 50);
    }
    this.filteredEvents = result;
    this.totalPages = Math.ceil(this.filteredEvents.length / this.pageSize);
    this.currentPage = 0;
  }

  get paginatedEvents(): Event[] {
    return this.filteredEvents.slice(this.currentPage * this.pageSize, (this.currentPage + 1) * this.pageSize);
  }

  onFiltersChanged(filters: { search: string; category: string }) {
    this.searchTerm = filters.search;
    this.categoryFilter = filters.category;
    this.applyFilters();
  }
  previousPage() { if (this.currentPage > 0) this.currentPage--; }
  nextPage() { if (this.currentPage < this.totalPages - 1) this.currentPage++; }
  filterByDate(range: string) {
    this.dateFilter = range;
    this.dateFilterLabel = range === 'week' ? 'This week' : range === 'month' ? 'This month' : 'All';
    this.applyFilters();
  }
  toggleCategoryFilter() {
    const cats = ['', 'Music', 'Tech', 'Art', 'Food', 'Sports', 'Other'];
    const idx = cats.indexOf(this.categoryFilter);
    this.categoryFilter = cats[(idx + 1) % cats.length];
    this.applyFilters();
  }
}
