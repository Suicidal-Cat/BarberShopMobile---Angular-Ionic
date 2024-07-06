import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AvaiableDatesApp } from 'src/app/models/Appointment/AvaiableDatesApp';
import { Barber } from 'src/app/models/Barber/barber';
import { LinkCollection } from 'src/app/models/Hateoas/LinkCollection';
import { AppointmentService } from 'src/app/services/Appointment/appointment.service';
import { BarberService } from 'src/app/services/Barber/barber.service';

@Component({
  selector: 'app-appointment-date-page',
  templateUrl: './appointment-date-page.page.html',
  styleUrls: ['./appointment-date-page.page.scss'],
})
export class AppointmentDatePagePage implements OnInit {

  barberId:number=0;
  choosenServices:number[]=[];

  constructor(private route:ActivatedRoute,private navCtr:NavController,
    private appointmentService:AppointmentService,private barberSrevice:BarberService) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(paramMap=>{
      if(paramMap.has('barberId')){
        const barber=paramMap.get('barberId');
        if(barber)this.barberId = parseInt(barber);
        const choosenServicesStr = paramMap.get('choosenServices');
        this.choosenServices = choosenServicesStr ? choosenServicesStr.split(',').map(Number) : [];
      }
    })

    const barber=this.appointmentService.barberApp;
    if(!barber || this.barberId==0 || this.choosenServices.length==0){
      this.navCtr.navigateBack("/home/appointment")
    }
    
  }


}
