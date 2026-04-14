import {Component} from '@angular/core';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  providers: [DatePipe],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {

  formattedDate: string;

  constructor(private datePipe: DatePipe) {
    this.formattedDate = this.datePipe.transform(new Date(), 'dd.MM.yyyy') || '';
  }
}
