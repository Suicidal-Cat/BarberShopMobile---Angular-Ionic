import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, tap } from 'rxjs';
import { Appointment } from 'src/app/models/Appointment/Appointment';
import { AvaiableDatesApp } from 'src/app/models/Appointment/AvaiableDatesApp';
import { Barber } from 'src/app/models/Barber/barber';
import { LinkCollection } from 'src/app/models/Hateoas/LinkCollection';
import { AccountService } from '../Account/account.service';
import { Link } from 'src/app/models/Hateoas/Link';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private barber!:LinkCollection<Barber>;

  private _latestAppointment=new Subject<LinkCollection<Appointment>>();
  private links:Link[]=[];

  get latestAppointment(){
    return this._latestAppointment.asObservable();
  }

  constructor(private http:HttpClient,private accountService:AccountService) { }

  get barberApp(){
    return this.barber;
  }

  set barberApp(barber:LinkCollection<Barber>){
    this.barber=barber;
  }

  getAvailableAppointments(startDate:string,endDate:string){
    const link=this.barber.Links.find((link)=>link.Rel=="getAvailableAppointments");
    if(link){
      let href=link.Href.replace("startDate",startDate);
      href=href.replace("endDate",endDate);
      return this.http.request<AvaiableDatesApp[]>(link.Method,href);
    }
    return undefined;
  }

  getAvailableTimes(date:string,duration:number){
    const link=this.barber.Links.find((link)=>link.Rel=="getAvailableTimes");
    if(link){
      let href=link.Href.replace("date",date);
      href=href.replace("duration",duration.toString());
      return this.http.request<string[]>(link.Method,href);
    }
    return undefined;
  }

  createAppointment(app:Appointment){
    const link=this.barber.Links.find((link)=>link.Rel=="createAppointment");
    if(link){
      return this.http.request(link.Method,link.Href,{body:app});
    }
    return undefined;
  }

  getLatestAppointment(){
    const link=this.accountService.getLatestAppointmentLink();
    if(link){
      return this.http.request<LinkCollection<Appointment>>(link.Method,link.Href).pipe(
        tap((data)=>{
          if(data){
            this.links=data.Links;
            this._latestAppointment.next(data);
          }
          
        })
      );
    }
    return undefined;
  }

  getAllAppointments(date:string){
    const link=this.accountService.getAllAppointmentsLink(date);
    if(link){
      return this.http.request<LinkCollection<LinkCollection<Appointment>[]>>(link.Method,link.Href);
    }
    else return undefined;
  }

  cancelAppointment(link:Link){
    return this.http.request(link.Method,link.Href,{body:{}});
  }

  updateAppointment(app:Appointment){
    const link=this.links.find((l)=>l.Rel=="updateAppointment");
    if(link){
      return this.http.request(link.Method,link.Href,{body:app});
    }
    else return undefined;
  }

}
