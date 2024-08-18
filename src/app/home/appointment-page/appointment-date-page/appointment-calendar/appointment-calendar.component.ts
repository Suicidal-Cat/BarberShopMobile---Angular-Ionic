import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, AnimationController, IonImg, IonModal, NavController,Animation } from '@ionic/angular';
import { IonModalCustomEvent,OverlayEventDetail } from '@ionic/core';
import { from } from 'rxjs';
import { Appointment } from 'src/app/models/Appointment/Appointment';
import { AvaiableDatesApp } from 'src/app/models/Appointment/AvaiableDatesApp';
import { Barber } from 'src/app/models/Barber/barber';
import { LinkCollection } from 'src/app/models/Hateoas/LinkCollection';
import { Service } from 'src/app/models/ServiceD/service';
import { AccountService } from 'src/app/services/Account/account.service';
import { AppointmentService } from 'src/app/services/Appointment/appointment.service';
import { ServiceService } from 'src/app/services/ServiceD/service.service';


@Component({
  selector: 'app-appointment-calendar',
  templateUrl: './appointment-calendar.component.html',
  styleUrls: ['./appointment-calendar.component.scss'],
})
export class AppointmentCalendarComponent  implements OnInit {

  startMonth:Date=new Date();
  startDay:number=new Date().getDate();

  currentMonth!:Date;
  daysInMonth: number[][]=[];
  weekDays:String[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  startColumnOfMonth!:number;
  endColumnOfMonth!:number;
  selectedDay:number=this.startDay+1;
  selectedMonth:Date=this.startMonth;

  availableDates:AvaiableDatesApp[]=[];
  isModalOpen=false;
  @Input() totalPrice!:number;
  @Input() appDuration!:number;
  @Input() serviceIds!:number[];
  @Input() appointmentId:number=0;
  @Input() barberId:number=0;
  availableTimes!:string[];
  selectedTimeIndex:number | null=null;
  selectedDate!:string;

  @ViewChild(IonModal) modal!: IonModal;
  showSpinner=false;
  isToastOpen = false;

  @Input() services!:LinkCollection<LinkCollection<Service>[]>;
  @Input() barbers!:LinkCollection<LinkCollection<Barber>[]>;
  barberInfo!:Barber;
  servicesInfo:Service[]=[];

  //animation
  private imgAnimation!: Animation;
  @ViewChild('confirmImg', { static: false }) confirmImg!: ElementRef<HTMLIonImgElement>;
  isConfirmed:boolean=false;

  

  constructor(private appointmentService:AppointmentService,private navCtr:NavController,
    private accountService:AccountService,private actionSheetCtrl: ActionSheetController,
    private serviceService:ServiceService,private animationCtrl: AnimationController,
    private router:Router) {}


  ngOnInit() {
    this.currentMonth = new Date();
    this.generateCalendar(this.currentMonth);
    this.showTimes(this.startDay+1);
    
  }

  async play() {
    this.isConfirmed=true;
    document.getElementById('confirm')?.classList.add('img-confirm');
    this.imgAnimation = this.animationCtrl
      .create()
      .addElement(document.getElementById('confirm') as HTMLDivElement)
      .fill('none')
      .duration(1500)
      .keyframes([
         { offset: 0, transform: 'scale(1)', opacity: '0' },
         { offset: 1, transform: 'scale(1.1)', opacity: '1' },

      ])
      // .fromTo('transform', 'rotateY(0deg)', 'rotateY(360deg)')
      .iterations(1)
      .fill('forwards');
    await this.imgAnimation.play();
  }

  getAvaiableDates(startDate:string,endDate:string){
    this.appointmentService.getAvailableAppointments(startDate,endDate)?.subscribe((data)=>{
      this.availableDates=data;
    })
  }

  showTimes(day:number,i:number=0,j:number=0){
    this.selectedTimeIndex=null;
    this.selectedDay=day;
    //moramo da vidimo jel prethodni ili trenutni dan za mesec
    if(i==0 && j<this.startColumnOfMonth){
      let month:number;
      let year:number;
      if(this.currentMonth.getMonth()==0){
        month=11;
        year=this.currentMonth.getFullYear()-1;
      }
      else {
        month=this.currentMonth.getMonth()-1;
        year=this.currentMonth.getFullYear();
      }
      this.selectedMonth=new Date(year,month,1);
    }
    else if(i==this.daysInMonth.length-1 && j>this.endColumnOfMonth){
      let month:number;
      let year:number;
      if(this.currentMonth.getMonth()==11){
        month=0;
        year=this.currentMonth.getFullYear()+1;
      }
      else{
        month=this.currentMonth.getMonth()+1;
        year=this.currentMonth.getFullYear();
      } 
      this.selectedMonth=new Date(year,month,1);
    }
    else this.selectedMonth=this.currentMonth;

    if(day<=this.startDay)return;
    if(day!=0){
      const formatedDate:string=this.formatDate(new Date(this.currentMonth.getFullYear(),this.currentMonth.getMonth(),day));
    this.appointmentService.getAvailableTimes(formatedDate,this.appDuration)?.subscribe((data)=>{
      if(data.every((value)=>value=="0")){
        if(this.isToastOpen==false)this.isToastOpen=true;
      }
      else{
        this.availableTimes=data;
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
    if(this.selectedTimeIndex!=null){

      const app:Appointment={
        AppDuration:this.appDuration,
        Barber:this.appointmentService.barberApp.Value,
        Date:this.selectedDate,
        IsCanceled:false,
        Price:this.totalPrice,
        StartTime:this.availableTimes[this.selectedTimeIndex],
        Services:services,
        };
        if(this.appointmentId==0){
          this.appointmentService.createAppointment(app)?.subscribe({
            next:()=>{
              this.showSpinner=false;
              this.play();
            },
            error:()=> {
              this.showSpinner=false;
            },
          });
        }
        else{
          this.appointmentService.updateAppointment(app)?.subscribe({
            next:()=>{
              this.showSpinner=false;
              this.play();
            },
            error:()=> {
              this.showSpinner=false;
            },
          })
        }
        
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
    if(this.startMonth.getMonth()+2<this.currentMonth.getMonth())return;
    this.currentMonth = new Date(this.currentMonth.getFullYear(),this.currentMonth.getMonth()+1);
    this.generateCalendar(this.currentMonth);
  }

  prevMonth(){
    if(this.startMonth.getMonth()==this.currentMonth.getMonth())return;
    this.currentMonth = new Date(this.currentMonth.getFullYear(),this.currentMonth.getMonth()-1);
    if(this.startMonth.getMonth()==this.currentMonth.getMonth())
      this.currentMonth = new Date(this.currentMonth.getFullYear(),this.currentMonth.getMonth(),this.startDay);
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
  addAvailabilityClass(day:number):string{
    const currentDate=new Date(this.currentMonth.getFullYear(),this.currentMonth.getMonth(),day);
    const formatedDate=this.formatDate(currentDate);
    
    const dateApp=this.availableDates.find((date)=>date.date==formatedDate);
    if(dateApp){
      if(dateApp.count>=4 && dateApp.count<=7)return " daySemiBusyIndicator";
      else if(dateApp.count>7)return " dayBusyIndicator";
    }

    return "";

  }

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  openModal(){
    this.servicesInfo=[];
    const barb=this.barbers.Value.find((bar)=>bar.Value.BarberId==this.appointmentService.barberApp.Value.BarberId);
    if(barb)this.barberInfo=barb.Value;

    this.serviceIds.forEach(id => {
      const service=this.services.Value.find((serv)=>serv.Value.ServiceId==id);
      if(service)this.servicesInfo.push(service.Value);
    });

    this.isModalOpen=true;
  }

  closeModal(){
    this.modal.dismiss();
  }

  onWillDismiss($event: IonModalCustomEvent<OverlayEventDetail<any>>) {
    this.isModalOpen=false;
    this.selectedTimeIndex=null;
    this.isConfirmed=false;
  }

  generateDayClass(day:number,i:number,j:number):string{
    let className="dayHeader";

    if(this.currentMonth.getMonth()==this.startMonth.getMonth() && (day<=this.startDay || (i==0 && j<this.startColumnOfMonth)))className+=" dayUnavaiable";
    if(this.currentMonth.getMonth()==this.selectedMonth.getMonth() && day==this.selectedDay && !(i==0 && j<this.startColumnOfMonth)
    && !((i==0 && j<this.startColumnOfMonth) || (i==this.daysInMonth.length-1 && j>this.endColumnOfMonth)))
      className+=" selectedDay";

    className+=this.addAvailabilityClass(day);


    return className;
  }

  navigateToHome(){
    this.appointmentService.getLatestAppointment()?.subscribe();
    this.modal.dismiss();
    this.navCtr.navigateBack("/home");
  }

  navigateToServices(){
    if(this.barberId!=0 && this.serviceIds.length>0){
      this.router.navigate(['home/appointment/choose-services'], {
        queryParams: {
            barberId: this.barberId,
            choosenServices: this.serviceIds.join(','),
            appointment: this.appointmentId
        }
      });
    }
    else {
      this.router.navigateByUrl("home");
    }
  }

}
