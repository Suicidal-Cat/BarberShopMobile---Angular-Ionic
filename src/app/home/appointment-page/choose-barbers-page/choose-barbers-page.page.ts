import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Barber } from 'src/app/models/Barber/barber';
import { Status } from 'src/app/models/Barber/status';
import { LinkCollection } from 'src/app/models/Hateoas/LinkCollection';
import { AppointmentService } from 'src/app/services/Appointment/appointment.service';
import { BarberService } from 'src/app/services/Barber/barber.service';

@Component({
  selector: 'app-choose-barbers-page',
  templateUrl: './choose-barbers-page.page.html',
  styleUrls: ['./choose-barbers-page.page.scss'],
})
export class ChooseBarbersPagePage implements OnInit,ViewWillEnter {

  barbers!: LinkCollection<Barber>[];
  barbersSub!: Subscription;
  selectedBarber!:LinkCollection<Barber>;

  barberId:number=0;
  choosenServices:number[]=[];
  appointmentId:number=0;

  constructor(private barberService:BarberService,private route:ActivatedRoute,
    private router:Router,private appointmentService:AppointmentService) {
    this.route.queryParamMap.subscribe(paramMap=>{
      if(paramMap.has('barberId')){
        const barber=paramMap.get('barberId');
        if(barber)this.barberId = parseInt(barber);
        const choosenServicesStr = paramMap.get('choosenServices');
        this.choosenServices = choosenServicesStr ? choosenServicesStr.split(',').map(Number) : [];

        if(paramMap.has('appointment')){
          const id=paramMap.get('appointment')
          if(id)this.appointmentId=parseInt(id);
        }
      }
    })

  }

  ngOnInit() {

    this.barbersSub=this.barberService.barbersPag.subscribe((barbers)=>{
      this.barbers=barbers.Value.filter((barber)=>barber.Value.Status==Status.Active && barber.Value.StartWorkingHours!=null);
      if(this.barbers.length>0){
        if(this.barberId!=0){
          const temp=this.barbers.find((value)=>value.Value.BarberId==this.barberId);
          if(temp){
            this.selectedBarber=temp;
            this.barberId=temp.Value.BarberId;
          }
        }
      }
    });
  }

  ionViewWillEnter(): void {
    this.barberService.getBarbers()?.subscribe();
  }

  selectCard(barber:LinkCollection<Barber>){
    this.barberId=barber.Value.BarberId;
    this.selectedBarber=barber;
  }

  navigateToServices(){
    if(this.selectedBarber && this.barberId!=0){
      this.appointmentService.barberApp=this.selectedBarber;
      this.router.navigate(['home/appointment/choose-services-page'], {
        queryParams: {
            barberId: this.barberId,
            choosenServices: this.choosenServices.join(','),
            appointment: this.appointmentId
        }
      });
    }
  }

}
