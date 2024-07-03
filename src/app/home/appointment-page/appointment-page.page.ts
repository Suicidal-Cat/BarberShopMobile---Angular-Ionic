import { Component, OnDestroy, OnInit } from '@angular/core';
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

  constructor(private serviceService: ServiceService,private barberService:BarberService) {}

  ngOnInit() {

    this.categoriesSub = this.serviceService.serviceCategories.subscribe((data) => {
        this.serviceCategories = data;}
    );

    this.servicesSub = this.serviceService.servicesPag.subscribe((services) => {
      this.services = services;
    });

    this.barbersSub=this.barberService.barbersPag.subscribe((barbers)=>{
      this.barbers=barbers.Value.filter((barber)=>barber.Value.Status==Status.Active && barber.Value.StartWorkingHours!=null);
      if(this.barbers.length>0)this.barberId=this.barbers[0].Value.BarberId;
    })
  }

  ionViewWillEnter(): void {
    this.serviceService.getServiceCategories()?.subscribe();
    this.serviceService.getServices()?.subscribe();
    this.barberService.getBarbers()?.subscribe();
  }

  setChoosenBarber(id:number){
    this.barberId=id;
  }

  setChoosenServices(event: number[]) {
    console.log(event)
    this.choosenServices=event;
  }

  ngOnDestroy(): void {
    if(this.servicesSub)this.servicesSub.unsubscribe();
    if (this.categoriesSub) this.categoriesSub.unsubscribe();
    if (this.barbersSub) this.barbersSub.unsubscribe();
  }
}
