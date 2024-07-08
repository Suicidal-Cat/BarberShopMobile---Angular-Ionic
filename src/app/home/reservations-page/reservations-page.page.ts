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

  constructor(private appointmnetServce:AppointmentService) { }

  ngOnInit() {
    
  }

  ionViewWillEnter(): void {
    this.getAppointments(this.formatDate(new Date()));
  }

  onChange(event: IonDatetimeCustomEvent<DatetimeChangeEventDetail>) {
    console.log()
    this.modal.dismiss();
    this.getAppointments(this.formatDate(event.detail.value));
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

  getAppointments(date:string){
    this.appointmnetServce.getAllAppointments(this.formatDate(date))?.subscribe(
      (data)=>{
        this.appointments=data.Value;
        console.log(this.appointments)
        if(this.appointments!=undefined && this.appointments.length>0)this.empty=false;
        else this.empty=true;
      }
    )
  }

}
