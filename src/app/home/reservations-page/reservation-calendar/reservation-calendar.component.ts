import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-reservation-calendar',
  templateUrl: './reservation-calendar.component.html',
  styleUrls: ['./reservation-calendar.component.scss'],
})
export class ReservationCalendarComponent  implements OnInit {

  startMonth:Date=new Date();
  startDay:number=new Date().getDate();
  selectedDay:number=this.startDay;
  selectedMonthForDay:Date=this.startMonth;
  selectedWeek:number=-1;
  showSelectedWeek:boolean=true;

  currentMonth!:Date;
  daysInMonth: number[][]=[];
  weekDays:String[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  startColumnOfMonth!:number;
  endColumnOfMonth!:number;

  @Output() selectedDateUser:EventEmitter<string>=new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.currentMonth = new Date();
    this.generateCalendar(this.currentMonth);
  }

  generateCalendar(date: Date) {
    const start = this.startOfMonth(date);
    const end = this.endOfMonth(date);
    this.daysInMonth = this.splitIntoWeeks(start,end);
  }

  getAppointments(day:number){
    const date=new Date(this.currentMonth.getFullYear(),this.currentMonth.getMonth(),day);
    this.selectedDay=day;
    this.selectedMonthForDay=date;
    this.selectedDateUser.emit(this.formatDate(date));
  }

  nextMonth(){
    this.currentMonth = new Date(this.currentMonth.getFullYear(),this.currentMonth.getMonth()+1);
    if(this.startMonth.getMonth()==this.currentMonth.getMonth()){
      // this.selectedDay=this.startDay;
      // this.selectedDateUser.emit(this.formatDate(this.startMonth))
    }
    // else {
    //   this.selectedDay=-1;
    //   this.selectedWeek=0;
    // }
    this.generateCalendar(this.currentMonth);
  }

  prevMonth(){
    this.currentMonth = new Date(this.currentMonth.getFullYear(),this.currentMonth.getMonth()-1);
    if(this.startMonth.getMonth()==this.currentMonth.getMonth()){
      this.currentMonth = new Date(this.currentMonth.getFullYear(),this.currentMonth.getMonth(),this.startDay);
      // this.selectedDay=this.startDay;
      // this.selectedDateUser.emit(this.formatDate(this.startMonth))
    }
    // else {
    //   this.selectedDay=-1;
    //   this.selectedWeek=0;
    // }
    this.selectedWeek=0;
    this.generateCalendar(this.currentMonth);
  }


  startOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }
  
  endOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  splitIntoWeeks(start:Date,end:Date): number[][] {
    let daysInMonth:number[][]=[];
    let row=1;
    let startDayOfTheWeek=start.getDay();
    let endDayOfTheWeek=end.getDay();
    let numberOfDays=end.getDate();
    let currentDay=1;

    daysInMonth[0]=[];

    let dayOfPreviosMonth=new Date(start.getFullYear(),start.getMonth(),0).getDate();
    
    for(let i=startDayOfTheWeek-1;i>=0;i--){
      daysInMonth[0][i]=dayOfPreviosMonth;
      dayOfPreviosMonth--;
    }

    this.startColumnOfMonth=startDayOfTheWeek;
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

    let nextMonthDays=1;
    for(let i=endDayOfTheWeek+1;i<7;i++){
      daysInMonth[row][i]=nextMonthDays;
      nextMonthDays++;
    }
    this.endColumnOfMonth=endDayOfTheWeek;
    if(start.getMonth()==this.startMonth.getMonth() && this.selectedWeek==-1){
      for(let i=0;i<=row;i++){
        for(let j=0;j<7;j++){
          if(daysInMonth[i][j]==this.startDay){
            this.selectedWeek=i;
            i=row+1;
            j=7;
          }
        }
      }    
    }

    return daysInMonth;
  }

  showHideCal(){
    this.showSelectedWeek=!this.showSelectedWeek;
  }

  startDayClass(day:number,i:number,j:number):boolean{
    let t= day==this.selectedDay && this.selectedMonthForDay.getMonth()==this.currentMonth.getMonth() 
    && !((i==1 && j<this.startColumnOfMonth) || (i==this.daysInMonth.length-1 && j>this.endColumnOfMonth));

    if(t){
      // console.log(day,i,j,'PRESEK',this.startColumnOfMonth,this.endColumnOfMonth)
      // console.log(this.selectedMonthForDay.getMonth()==this.currentMonth.getMonth())
      // console.log(!((i==1 && j<this.startColumnOfMonth) || (i==this.daysInMonth.length-1 && j>this.endColumnOfMonth)))
    }

    return t;
  }

}
