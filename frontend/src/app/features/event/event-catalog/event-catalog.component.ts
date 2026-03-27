import { Component } from '@angular/core';
import {EventCardComponent} from '../../../shared/components/event-card/event-card.component';


@Component({
  selector: 'app-event-catalog-component',
  imports: [EventCardComponent],
  templateUrl: './event-catalog.component.html',
  styleUrl: './event-catalog.component.css',
})
export class EventCatalogComponent {

}
