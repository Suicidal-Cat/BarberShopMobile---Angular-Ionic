import { Component, OnInit, ViewChild } from '@angular/core';
import { DatetimeChangeEventDetail, IonModal, ViewWillEnter } from '@ionic/angular';
import { IonDatetimeCustomEvent } from '@ionic/core';
import { Appointment } from 'src/app/models/Appointment/Appointment';
import { LinkCollection } from 'src/app/models/Hateoas/LinkCollection';
import { AppointmentService } from 'src/app/services/Appointment/appointment.service';

@Component({
  selector: 'app-reservations-page',
  templateUrl: './reservations-page.page.html',
  styleUrls: ['./reservations-page.page.scss'],
})
export class ReservationsPagePage implements OnInit,ViewWillEnter {

  @ViewChild(IonModal) modal!:IonModal;

  appointments:LinkCollection<Appointment>[]=[];
  empty:boolean=true;
  showSpinner:boolean=false;

  constructor(private appointmnetServce:AppointmentService) { }

  ngOnInit() {
    
  }

  ionViewWillEnter(): void {
    this.getAppointments(this.formatDate(new Date()));
  }

  formatDate(date:any): string {
    const d=new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  getFormattedTime(time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0);
    return date;
  }

  selectedDateUser(date:string){
    this.getAppointments(date);
  }

  getAppointments(date:string){
    this.showSpinner=true;
    this.appointments=[];
    this.appointmnetServce.getAllAppointments(this.formatDate(date))?.subscribe(
      (data)=>{
        this.appointments=data.Value;
        if(this.appointments!=undefined && this.appointments.length>0)this.empty=false;
        else this.empty=true;
        this.showSpinner=false;
      }
    )
  }

}
