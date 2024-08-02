import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal } from '@ionic/angular';
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

  @ViewChild(IonModal) modal!:IonModal;
  isOpen:boolean=false;

  latestAppointment!:Appointment | null;
  links:Link[]=[];

  appSub!:Subscription;

  constructor(private appointmentService:AppointmentService,private router:Router) { }

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
          this.modal.dismiss();
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

  editAppointment(){
    if(this.latestAppointment){
      this.isOpen=false;
      let barberId:number=0;
      let choosenServices:number[]=[];

      this.latestAppointment?.Services.forEach(service => {
        choosenServices.push(service.ServiceId);
      });
      barberId=this.latestAppointment?.Barber.BarberId;
      this.modal.dismiss();
      this.router.navigate(['home/appointment'], {
        queryParams: {
            barberId: barberId,
            choosenServices: choosenServices.join(','),
            appointment: this.latestAppointment.AppointmentId
        }
      });
    }
  }

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


}
