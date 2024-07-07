import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Appointment } from 'src/app/models/Appointment/Appointment';
import { AppointmentService } from 'src/app/services/Appointment/appointment.service';

@Component({
  selector: 'app-latest-appointment',
  templateUrl: './latest-appointment.component.html',
  styleUrls: ['./latest-appointment.component.scss'],
})
export class LatestAppointmentComponent  implements OnInit,AfterViewInit{

  latestAppointment!:Appointment;

  appSub!:Subscription;

  constructor(private appointmentService:AppointmentService) { }

  ngOnInit() {
    this.appSub=this.appointmentService.latestAppointment.subscribe((data)=>{
      this.latestAppointment=data.Value;
    })
  }

  ngAfterViewInit(): void {
    this.appointmentService.getLatestAppointment()?.subscribe();
  }



}