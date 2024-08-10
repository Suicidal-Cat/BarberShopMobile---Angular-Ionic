import { Injectable } from '@angular/core';
import { AccountService } from '../Account/account.service';
import { BehaviorSubject, map, Observable, switchMap, take, tap } from 'rxjs';
import { Service } from 'src/app/models/ServiceD/service';
import { HttpClient, HttpEvent, HttpResponse } from '@angular/common/http';
import { LinkCollection } from 'src/app/models/Hateoas/LinkCollection';
import { Link } from 'src/app/models/Hateoas/Link';
import { ServiceCategory } from 'src/app/models/ServiceCategory/serviceCategory';

@Injectable({
  providedIn: 'root'
})
export class ServiceService{

  private _servicesPag=new BehaviorSubject<LinkCollection<LinkCollection<Service>[]>>({Value:[],Links:[]});
  private _serviceCategories=new BehaviorSubject<ServiceCategory[]>([]);
  private getServiceIdLink!:Link | undefined;
  private maxPagesPagination!:number;

  get servicesPag(): Observable<LinkCollection<LinkCollection<Service>[]>>{
    return this._servicesPag.asObservable();
  }

  get serviceCategories(): Observable<ServiceCategory[]>{
    return this._serviceCategories.asObservable();
  }

  constructor(private http: HttpClient,private accountService:AccountService) {
  }

  // getServicesPagination(linkHref:string=""){
  //   const link:Link | undefined=this.accountService.getServicePaginationLink();
  //   if(link){
  //     if(linkHref=="")linkHref=link.Href;
  //     return this.http.request<LinkCollection<LinkCollection<Service>[]>>(link.Method,linkHref).pipe(
  //         tap((data:LinkCollection<LinkCollection<Service>[]>)=>{
  //           this._servicesPag.next(data);
  //         })
  //       )
  //   }
  //   return undefined;
  // }

  getServicesPagination(linkHref: string = "") {
    const link: Link | undefined = this.accountService.getServicePaginationLink();
    if (link) {
      if (linkHref == "") linkHref = link.Href;
      return this.http.request<LinkCollection<LinkCollection<Service>[]>>(link.Method, linkHref, { observe: 'response' })
        .pipe(
          tap((response: HttpEvent<any>) => {
            if (response instanceof HttpResponse) {
              const maxPages = response.headers.get('maxPages');
              if (maxPages) {
                this.maxPagesPagination=parseInt(maxPages);
                this._servicesPag.next(response.body as LinkCollection<LinkCollection<Service>[]>);
              }
            }
          })
        );
    }
    return undefined;
  }

  deleteService(link:Link,id:number){
    return this.http.request(link.Method,link.Href).pipe(
      switchMap(()=>{
        return this.servicesPag;
      }),
      take(1),
      tap((data:LinkCollection<LinkCollection<Service>[]>)=>{
        data.Value=data.Value.filter(s=>s.Value.ServiceId!=id);
        this._servicesPag.next(data);
        console.log(data.Value)
      }),
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

  updateService(service:Service,link:Link){
    return this.http.request(link.Method,link.Href,{body:service});
  }

  getService(link:Link){
    return this.http.request<LinkCollection<Service>>(link.Method,link.Href);
  }

  getServices(){
    const link=this.accountService.getServicesLink();
    if(link){
      return this.http.request<LinkCollection<LinkCollection<Service>[]>>(link.Method,link.Href).pipe(
        tap((data:LinkCollection<LinkCollection<Service>[]>)=>{
            this._servicesPag.next(data);
        })
      );
    }
    return undefined;
  }

  setServiceLink(link:Link | undefined){
    this.getServiceIdLink=link;
  }

  getServiceLink(){
    return this.getServiceIdLink;
  }

  get MaxPages():number{
    return this.maxPagesPagination;
  }

}
