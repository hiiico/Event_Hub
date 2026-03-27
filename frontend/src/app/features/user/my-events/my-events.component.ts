import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {EventCardComponent} from '../../../shared/components/event-card/event-card.component';

@Component({
  selector: 'app-my-events-component',
  imports: [RouterLink, EventCardComponent],
  templateUrl: './my-events.component.html',
  styleUrl: './my-events.component.css',
})
export class MyEventsComponent {}
