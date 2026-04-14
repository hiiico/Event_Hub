import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocationPickerComponent } from './location-picker.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LocationPickerComponent', () => {
  let component: LocationPickerComponent;
  let fixture: ComponentFixture<LocationPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationPickerComponent, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LocationPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit value when address changes', () => {
    spyOn(component as any, 'emitValue').and.callThrough();
    component.address = 'Berlin';
    component.onAddressChange();
    expect(component.address).toBe('Berlin');
  });
});
