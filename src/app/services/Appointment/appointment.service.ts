import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AvaiableDatesApp } from 'src/app/models/Appointment/AvaiableDatesApp';
import { Barber } from 'src/app/models/Barber/barber';
import { LinkCollection } from 'src/app/models/Hateoas/LinkCollection';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private barber!:LinkCollection<Barber>;

  constructor(private http:HttpClient) { }

  get barberApp(){
    return this.barber;
  }

  set barberApp(barber:LinkCollection<Barber>){
    this.barber=barber;
  }

  getAvaiableAppointments(startDate:string,endDate:string){
    const link=this.barber.Links.find((link)=>link.Rel=="getAvailableAppointments");
    if(link){
      let href=link.Href.replace("startDate",startDate);
      href=href.replace("endDate",endDate);
      return this.http.request<AvaiableDatesApp[]>(link.Method,href);
    }
    return undefined;
  }

}
