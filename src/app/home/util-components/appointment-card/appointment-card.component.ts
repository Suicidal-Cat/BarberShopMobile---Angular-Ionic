import { Component, Input, OnInit } from '@angular/core';
import { Appointment } from 'src/app/models/Appointment/Appointment';

@Component({
  selector: 'app-appointment-card',
  templateUrl: './appointment-card.component.html',
  styleUrls: ['./appointment-card.component.scss'],
})
export class AppointmentCardComponent  implements OnInit {

  @Input() appointmnet!:Appointment;

  constructor() { }

  ngOnInit() {}

  formatDate(date:any): string {
    const d=new Date(date);
    const days = d.getDate();
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
    const month = months[d.getMonth()];

    return `${month} ${days}`;
  }

  getFormattedTime(time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0);
    return date;
  }

}
