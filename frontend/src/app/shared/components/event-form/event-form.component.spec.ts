import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventFormComponent } from './event-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EventFormComponent', () => {
  let component: EventFormComponent;
  let fixture: ComponentFixture<EventFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventFormComponent, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(EventFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit submit when form is valid', () => {
    spyOn(component.submit, 'emit');
    component.event = {
      title: 'Test', description: 'Desc', dateTime: new Date(Date.now() + 86400000).toISOString(),
      location: 'Place', category: 'Music', latitude: null, longitude: null
    };
    component.onSubmit();
    expect(component.submit.emit).toHaveBeenCalled();
  });

  it('should not emit if date is in the past', () => {
    spyOn(component.submit, 'emit');
    component.event.dateTime = new Date(Date.now() - 86400000).toISOString();
    component.onSubmit();
    expect(component.submit.emit).not.toHaveBeenCalled();
  });
});
