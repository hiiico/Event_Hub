import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-event-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-search.component.html',
  styleUrls: ['./event-search.component.css']
})
export class EventSearchComponent implements OnInit {
  searchTerm = '';
  selectedCategory = '';
  categories = ['Music', 'Tech', 'Art', 'Food', 'Sports', 'Other'];

  @Output() filtersChanged = new EventEmitter<{ search: string; category: string }>();

  private searchSubject = new Subject<string>();

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.emitFilters();
    });
  }

  onSearchInput() {
    this.searchSubject.next(this.searchTerm);
  }

  onCategoryChange() {
    this.emitFilters();
  }

  private emitFilters() {
    this.filtersChanged.emit({
      search: this.searchTerm,
      category: this.selectedCategory
    });
  }
}
