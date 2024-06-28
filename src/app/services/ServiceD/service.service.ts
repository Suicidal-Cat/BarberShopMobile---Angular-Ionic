import { Injectable } from '@angular/core';
import { AccountService } from '../Account/account.service';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { Service } from 'src/app/models/ServiceD/service';
import { HttpClient } from '@angular/common/http';
import { LinkCollection } from 'src/app/models/Hateoas/LinkCollection';
import { Link } from 'src/app/models/Hateoas/Link';
import { ServiceCategory } from 'src/app/models/ServiceCategory/serviceCategory';

@Injectable({
  providedIn: 'root'
})
export class ServiceService{

  private _servicesPag=new BehaviorSubject<LinkCollection<LinkCollection<Service>[]>>({Value:[],Links:[]});
  private _serviceCategories=new BehaviorSubject<ServiceCategory[]>([]);

  get servicesPag(): Observable<LinkCollection<LinkCollection<Service>[]>>{
    return this._servicesPag.asObservable();
  }

  get serviceCategories(): Observable<ServiceCategory[]>{
    return this._serviceCategories.asObservable();
  }

  constructor(private http: HttpClient,private accountService:AccountService) {
  }

  getServicesPagination(linkHref:string=""){
    const link:Link | undefined=this.accountService.getServicePaginationLink();
    if(link){
      if(linkHref=="")linkHref=link.Href;
      return this.http.request<LinkCollection<LinkCollection<Service>[]>>(link.Method,linkHref).pipe(
          tap((data:LinkCollection<LinkCollection<Service>[]>)=>{
            console.log(data)
            this._servicesPag.next(data);
          })
        )
    }
    return undefined;
  }

  deleteService(link:Link,id:number){
    return this.http.request(link.Method,link.Href).pipe(
      switchMap(()=>{
        return this.servicesPag;
      }),
      tap((data:LinkCollection<LinkCollection<Service>[]>)=>{
        data.Value=data.Value.filter(s=>s.Value.ServiceId!=id);
        this._servicesPag.next(data);
      })
    )
  }

  getServiceCategories(){
    const link=this.accountService.getServiceCategoriesLink();
    if(link){
      return this.http.request<LinkCollection<ServiceCategory[]>>(link.Method,link.Href).pipe(
        tap((data:LinkCollection<ServiceCategory[]>)=>{
          this._serviceCategories.next(data.Value);
        }));
    }
    else return undefined;
    
  }

  addService(service:Service){
    const link=this.accountService.getCreateServiceLink();
    if(link){
      return this.http.request(link.Method,link.Href,{body:service});
    }
    return undefined;
  }



}