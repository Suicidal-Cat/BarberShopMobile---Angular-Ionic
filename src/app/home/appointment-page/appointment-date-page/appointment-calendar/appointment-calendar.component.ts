import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonModal, NavController } from '@ionic/angular';
import { Appointment } from 'src/app/models/Appointment/Appointment';
import { AvaiableDatesApp } from 'src/app/models/Appointment/AvaiableDatesApp';
import { Service } from 'src/app/models/ServiceD/service';
import { AccountService } from 'src/app/services/Account/account.service';
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

  availableDates:AvaiableDatesApp[]=[];
  isModalOpen=false;
  @Input() totalPrice!:number;
  @Input() appDuration!:number;
  @Input() serviceIds!:number[];
  availableTimes!:string[];
  selectedTimeIndex:number | null=null;
  selectedDate!:string;

  @ViewChild(IonModal) modal!: IonModal;
  showSpinner=false;
  isToastOpen = false;

  constructor(private appointmentService:AppointmentService,private navCtr:NavController,private accountService:AccountService) {}

  ngOnInit() {
    this.currentMonth = new Date();
    this.generateCalendar(this.currentMonth);
  }

  getAvaiableDates(startDate:string,endDate:string){
    this.appointmentService.getAvailableAppointments(startDate,endDate)?.subscribe((data)=>{
      this.availableDates=data;
    })
  }

  showModal(day:number){
    if(day!=0){
      const formatedDate:string=this.formatDate(new Date(this.currentMonth.getFullYear(),this.currentMonth.getMonth(),day));
    this.appointmentService.getAvailableTimes(formatedDate,this.appDuration)?.subscribe((data)=>{
      if(data.every((value)=>value=="0")){
        if(this.isToastOpen==false)this.isToastOpen=true;
      }
      else{
        this.availableTimes=data;
        this.isModalOpen=true;
        this.selectedDate=formatedDate;
      }
    })
    }

  }

  createAppointment(){
    this.showSpinner=true;
    let services:Service[]=[];
    for(let i of this.serviceIds){
      services.push({ServiceId:i,Duration:1,Name:"none",Price:1,ServiceCategory:{Id:0,Name:"none"}});
    }

    if(this.selectedTimeIndex){

      const app:Appointment={
        AppDuration:this.appDuration,
        Barber:this.appointmentService.barberApp.Value,
        Date:this.selectedDate,
        IsCanceled:false,
        Price:this.totalPrice,
        Services:services,
        StartTime:this.availableTimes[this.selectedTimeIndex],
        };
        console.log(app)
        this.appointmentService.createAppointment(app)?.subscribe({
          next:()=>{
            this.showSpinner=false;
            this.modal.dismiss(null,'cancel');
            this.navCtr.navigateBack("/home");
          },
          error:()=> {
            this.showSpinner=false;
          },
        });
      }
  }
   

  choosenTime(event: MouseEvent,index:number) {
    this.selectedTimeIndex=index;
    //console.log((event.target as HTMLElement).firstChild?.nodeValue)
  }

  generateCalendar(date: Date) {
    const start = this.startOfMonth(date);
    const end = this.endOfMonth(date);
    this.getAvaiableDates(this.formatDate(start),this.formatDate(end));
    this.daysInMonth = this.splitIntoWeeks(start,end);
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

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  calcHeightWeek(){
    return `calc(100% / ${this.daysInMonth.length})`;
  }

  addAvailabilityClass(day:number):string{
    const currentDate=new Date(this.currentMonth.getFullYear(),this.currentMonth.getMonth(),day);
    const formatedDate=this.formatDate(currentDate);
    
    const dateApp=this.availableDates.find((date)=>date.date==formatedDate);
    if(dateApp){
      if(dateApp.count>=3 && dateApp.count<=6)return "daySemiBusyIndicator";
      else if(dateApp.count>6)return "dayBusyIndicator";
    }

    return "";

  }

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }


}
