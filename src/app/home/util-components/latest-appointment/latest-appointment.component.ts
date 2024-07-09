import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Appointment } from 'src/app/models/Appointment/Appointment';
import { Link } from 'src/app/models/Hateoas/Link';
import { AppointmentService } from 'src/app/services/Appointment/appointment.service';

@Component({
  selector: 'app-latest-appointment',
  templateUrl: './latest-appointment.component.html',
  styleUrls: ['./latest-appointment.component.scss'],
})
export class LatestAppointmentComponent  implements OnInit,AfterViewInit{

  latestAppointment!:Appointment;
  links:Link[]=[];

  appSub!:Subscription;

  constructor(private appointmentService:AppointmentService) { }

  ngOnInit() {
    this.appSub=this.appointmentService.latestAppointment.subscribe((data)=>{
      if(data){
        this.latestAppointment=data.Value;
        this.links=data.Links;
      }
    })
  }

  ngAfterViewInit(): void {
    this.appointmentService.getLatestAppointment()?.subscribe();
  }

  getFormattedTime(time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0);
    return date;
  }

  cancelAppointment(){
    const link=this.links.find((li)=>li.Rel=="cancelAppointment");
    if(link){
      this.appointmentService.cancelAppointment(link).subscribe({
        next:(value)=>{
          this.appointmentService.getLatestAppointment()?.subscribe();
        },
      })
    }
  }
  


}
