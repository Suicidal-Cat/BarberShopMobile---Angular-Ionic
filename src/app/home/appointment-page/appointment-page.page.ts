import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AvaiableDatesApp } from 'src/app/models/Appointment/AvaiableDatesApp';
import { Barber } from 'src/app/models/Barber/barber';
import { Status } from 'src/app/models/Barber/status';
import { LinkCollection } from 'src/app/models/Hateoas/LinkCollection';
import { ServiceCategory } from 'src/app/models/ServiceCategory/serviceCategory';
import { Service } from 'src/app/models/ServiceD/service';
import { AppointmentService } from 'src/app/services/Appointment/appointment.service';
import { BarberService } from 'src/app/services/Barber/barber.service';
import { ServiceService } from 'src/app/services/ServiceD/service.service';

@Component({
  selector: 'app-appointment-page',
  templateUrl: './appointment-page.page.html',
  styleUrls: ['./appointment-page.page.scss'],
})
export class AppointmentPagePage implements OnInit, ViewWillEnter, OnDestroy {

  serviceCategories: ServiceCategory[] = [];
  barbers!: LinkCollection<Barber>[];
  services!: LinkCollection<LinkCollection<Service>[]>;
  categoriesSub!: Subscription;
  servicesSub!: Subscription;
  barbersSub!: Subscription;

  barberId:number=0;
  choosenServices:number[]=[];
  selectedBarber!:LinkCollection<Barber>;
  appointmentId:number=0;


  constructor(private serviceService: ServiceService,private barberService:BarberService,
    private router:Router,private route:ActivatedRoute,private appointmentService:AppointmentService) {}

  ngOnInit() {
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

    this.categoriesSub = this.serviceService.serviceCategories.subscribe((data) => {
        this.serviceCategories = data;}
    );

    this.servicesSub = this.serviceService.servicesPag.subscribe((services) => {
      this.services = services;
    });

    this.barbersSub=this.barberService.barbersPag.subscribe((barbers)=>{
      this.barbers=barbers.Value.filter((barber)=>barber.Value.Status==Status.Active && barber.Value.StartWorkingHours!=null);
      if(this.barbers.length>0){
        if(this.barberId==0){
          this.barberId=this.barbers[0].Value.BarberId;
          this.selectedBarber=this.barbers[0];
        }
        else {
          const temp=this.barbers.find((value)=>value.Value.BarberId==this.barberId);
          if(temp)this.selectedBarber=temp;  
        }
      }
    })
  }

  ionViewWillEnter(): void {
    this.serviceService.getServiceCategories()?.subscribe();
    this.serviceService.getServices()?.subscribe();
    this.barberService.getBarbers()?.subscribe();
  }

  setChoosenBarber(id:number){
    this.barberId=id;
    this.updateQueryParameters();
  }

  setChoosenServices(event: number[]) {
    this.choosenServices=event;
    this.updateQueryParameters();
  }

  navigateToAppointmentDate(){
    const barberApp=this.barbers.find((b)=>b.Value.BarberId==this.barberId)
    if(barberApp && this.barberId!=0 && this.choosenServices.length!=0){
      this.appointmentService.barberApp=barberApp;
      this.router.navigate(['home/appointment/appointment-date'], {
        queryParams: {
            barberId: this.barberId,
            choosenServices: this.choosenServices.join(','),
            appointment: this.appointmentId
        }
      });
    }
    
  }

  updateQueryParameters(){
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
          barberId: this.barberId,
          choosenServices: this.choosenServices.join(',')
      },
      queryParamsHandling: 'merge'
  });
  }

  ngOnDestroy(): void {
    if(this.servicesSub)this.servicesSub.unsubscribe();
    if (this.categoriesSub) this.categoriesSub.unsubscribe();
    if (this.barbersSub) this.barbersSub.unsubscribe();
  }

}
