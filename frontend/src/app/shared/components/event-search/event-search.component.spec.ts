import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventSearchComponent } from './event-search.component';

describe('EventSearchComponent', () => {
  let component: EventSearchComponent;
  let fixture: ComponentFixture<EventSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventSearchComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(EventSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit filters after debounce', (done) => {
    spyOn(component.filtersChanged, 'emit');
    component.searchTerm = 'jazz';
    component.onSearchInput();
    setTimeout(() => {
      expect(component.filtersChanged.emit).toHaveBeenCalledWith({ search: 'jazz', category: '' });
      done();
    }, 400); // > 300ms debounce
  });
});
