import { Component, OnInit } from '@angular/core';
import { AvaiableDatesApp } from 'src/app/models/Appointment/AvaiableDatesApp';
import { AppointmentService } from 'src/app/services/Appointment/appointment.service';

@Component({
  selector: 'app-appointment-calendar',
  templateUrl: './appointment-calendar.component.html',
  styleUrls: ['./appointment-calendar.component.scss'],
})
export class AppointmentCalendarComponent  implements OnInit {

  startMonth:Date=new Date();
  startDay:number=new Date().getDay();

  currentMonth!:Date;
  daysInMonth: number[][]=[];
  weekDays:String[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  avaiableDates:AvaiableDatesApp[]=[];

  constructor(private appointmentService:AppointmentService) {}

  ngOnInit() {
    this.currentMonth = new Date();
    this.generateCalendar(this.currentMonth);
  }

  getAvaiableDates(startDate:string,endDate:string){
    this.appointmentService.getAvaiableAppointments(startDate,endDate)?.subscribe((data)=>{
      this.avaiableDates=data;
      console.log(this.avaiableDates)
    })
  }

  generateCalendar(date: Date) {
    const start = this.startOfMonth(date);
    const end = this.endOfMonth(date);
    this.getAvaiableDates(this.formatDate(start),this.formatDate(end));
    console.log(this.formatDate(start))
    console.log(this.formatDate(end))
    this.daysInMonth = this.splitIntoWeeks(start,end);
    console.log(this.daysInMonth)
  }

  nextMonth(){
    this.currentMonth = new Date(this.currentMonth.getFullYear(),this.currentMonth.getMonth()+1);
    this.generateCalendar(this.currentMonth);
  }

  prevMonth(){
    this.currentMonth = new Date(this.currentMonth.getFullYear(),this.currentMonth.getMonth()-1);
    this.generateCalendar(this.currentMonth);
  }

  splitIntoWeeks(start:Date,end:Date): number[][] {
    let daysInMonth:number[][]=[];
    let row=1;
    let startDayOfTheWeek=start.getDay();
    let endDayOfTheWeek=end.getDay();
    let numberOfDays=end.getDate();
    let currentDay=1;

    daysInMonth[0]=[];
    for(let i=0;i<startDayOfTheWeek;i++)daysInMonth[0][i]=0;
    for(let i=startDayOfTheWeek;i<7;i++){
      daysInMonth[0][i]=currentDay;
      currentDay++;
    }

    let column=0;
    for(let i=currentDay;i<=numberOfDays;i++){
      if(column==0)daysInMonth[row]=[];
      daysInMonth[row][column]=i;
      column++;
      if(column==7){
        column=0;
        row++;
      }
    }

    for(let i=endDayOfTheWeek+1;i<7;i++)daysInMonth[row][i]=0;

    return daysInMonth;
  }

  startOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }
  
  endOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  calcHeightWeek(){
    return `calc(100% / ${this.daysInMonth.length})`;
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

}
