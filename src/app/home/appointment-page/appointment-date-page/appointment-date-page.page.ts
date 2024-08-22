import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ViewWillEnter } from '@ionic/angular';
import { AvaiableDatesApp } from 'src/app/models/Appointment/AvaiableDatesApp';
import { Barber } from 'src/app/models/Barber/barber';
import { LinkCollection } from 'src/app/models/Hateoas/LinkCollection';
import { Service } from 'src/app/models/ServiceD/service';
import { AppointmentService } from 'src/app/services/Appointment/appointment.service';
import { BarberService } from 'src/app/services/Barber/barber.service';
import { ServiceService } from 'src/app/services/ServiceD/service.service';

@Component({
  selector: 'app-appointment-date-page',
  templateUrl: './appointment-date-page.page.html',
  styleUrls: ['./appointment-date-page.page.scss'],
})
export class AppointmentDatePagePage implements OnInit,ViewWillEnter {

  barberId:number=0;
  choosenServices:number[]=[];
  appointmentId:number=0;

  totalPrice:number=0;
  appDuration:number=0;

  services!:LinkCollection<LinkCollection<Service>[]>;
  barbers!:LinkCollection<LinkCollection<Barber>[]>;

  constructor(private route:ActivatedRoute,private navCtr:NavController,
    private appointmentService:AppointmentService,private barberSrevice:BarberService,private serviceService:ServiceService) { }

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

    const barber=this.appointmentService.barberApp;
    if(!barber || this.barberId==0 || this.choosenServices.length==0){
      this.navCtr.navigateBack("/home/appointment/choose-barbers")
    }

  }

  ionViewWillEnter(): void {
    this.serviceService.getServices()?.subscribe((data)=>{
      this.services=data;
      this.calculatePriceAndDuration(this.services);
      });

    // this.barberSrevice.getBarbers()?.subscribe((data)=>{
    //   this.barbers=data;
    // })
  }

  calculatePriceAndDuration(services:LinkCollection<LinkCollection<Service>[]>){
    this.totalPrice=0;
    this.appDuration=0;
    for(let service of services.Value){
      if(this.choosenServices.find((cs)=>cs==service.Value.ServiceId)){
        this.totalPrice+=service.Value.Price;
        this.appDuration+=service.Value.Duration;
      }
    }
  }


}
