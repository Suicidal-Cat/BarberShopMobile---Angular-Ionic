import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { IonModalCustomEvent,OverlayEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';
import { Appointment } from 'src/app/models/Appointment/Appointment';
import { Link } from 'src/app/models/Hateoas/Link';
import { AppointmentService } from 'src/app/services/Appointment/appointment.service';

@Component({
  selector: 'app-latest-appointment',
  templateUrl: './latest-appointment.component.html',
  styleUrls: ['./latest-appointment.component.scss'],
})
export class LatestAppointmentComponent  implements OnInit,AfterViewInit,OnDestroy{


  isOpen:boolean=false;

  latestAppointment!:Appointment | null;
  links:Link[]=[];

  appSub!:Subscription;

  constructor(private appointmentService:AppointmentService) { }

  ngOnDestroy(): void {
    if(this.appSub)this.appSub.unsubscribe();
  }

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
          this.latestAppointment=null;
          this.isOpen=false;
          this.appointmentService.getLatestAppointment()?.subscribe();
        },
      })
    }
  }

  onWillDismiss($event: IonModalCustomEvent<OverlayEventDetail<any>>) {
    this.isOpen=false;
  }

  showModalApp(){
    this.isOpen=true;
  }
  
  public alertButtons = [
    {
      text: 'No',
      role: 'cancel',
      handler: () => {
      },
    },
    {
      text: 'Yes',
      role: 'confirm',
      handler: () => {
        this.cancelAppointment();
      },
    },
  ];




}
