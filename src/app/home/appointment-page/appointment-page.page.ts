import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Barber } from 'src/app/models/Barber/barber';
import { Status } from 'src/app/models/Barber/status';
import { LinkCollection } from 'src/app/models/Hateoas/LinkCollection';
import { ServiceCategory } from 'src/app/models/ServiceCategory/serviceCategory';
import { Service } from 'src/app/models/ServiceD/service';
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

  constructor(private serviceService: ServiceService,private barberService:BarberService,
    private router:Router,private route:ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe(paramMap=>{
      if(paramMap.has('barberId')){
        const barber=paramMap.get('barberId');
        if(barber)this.barberId = parseInt(barber);
        const choosenServicesStr = paramMap.get('choosenServices');
        this.choosenServices = choosenServicesStr ? choosenServicesStr.split(',').map(Number) : [];
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
    this.router.navigate(['home/appointment/appointment-date'], {
      queryParams: {
          barberId: this.barberId,
          choosenServices: this.choosenServices.join(',')
      }
    });
  }

  updateQueryParameters(){
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
          barberId: this.barberId,
          choosenServices: this.choosenServices.join(',')
      },
      queryParamsHandling: 'merge' // Opcija za spajanje sa postojećim query parametrima
  });
  }

  ngOnDestroy(): void {
    if(this.servicesSub)this.servicesSub.unsubscribe();
    if (this.categoriesSub) this.categoriesSub.unsubscribe();
    if (this.barbersSub) this.barbersSub.unsubscribe();
  }
}
