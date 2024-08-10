import { HttpClient, HttpEvent, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Barber } from 'src/app/models/Barber/barber';
import { LinkCollection } from 'src/app/models/Hateoas/LinkCollection';
import { AccountService } from '../Account/account.service';
import { Link } from 'src/app/models/Hateoas/Link';

@Injectable({
  providedIn: 'root'
})
export class BarberService {

  private _barbersPag=new BehaviorSubject<LinkCollection<LinkCollection<Barber>[]>>({Value:[],Links:[]});

  get barbersPag(): Observable<LinkCollection<LinkCollection<Barber>[]>>{
    return this._barbersPag.asObservable();
  }

  getBarberIdLink:Link | undefined=undefined;
  maxPagesPagination!:number;

  constructor(private http: HttpClient,private accountService:AccountService) { }

  // getBarbersPagination(linkHref:string=""){
  //   const link:Link | undefined=this.accountService.getBarberPaginationLink();
  //   if(link){
  //     if(linkHref=="")linkHref=link.Href;
  //     return this.http.request<LinkCollection<LinkCollection<Barber>[]>>(link.Method,linkHref).pipe(
  //         tap((data:LinkCollection<LinkCollection<Barber>[]>)=>{
  //           this._barbersPag.next(data);
  //         })
  //       )
  //   }
  //   return undefined;
  // }

  getBarbersPagination(linkHref: string = "") {
    const link:Link | undefined=this.accountService.getBarberPaginationLink();
    if (link) {
      if (linkHref == "") linkHref = link.Href;
      return this.http.request<LinkCollection<LinkCollection<Barber>[]>>(link.Method, linkHref, { observe: 'response' })
        .pipe(
          tap((response: HttpEvent<any>) => {
            if (response instanceof HttpResponse) {
              const maxPages = response.headers.get('maxPages');
              if (maxPages) {
                this.maxPagesPagination=parseInt(maxPages);
                this._barbersPag.next(response.body as LinkCollection<LinkCollection<Barber>[]>);
              }
            }
          })
        );
    }
    return undefined;
  }

  getBarbers(){
    const link=this.accountService.getBarberLink();
    if(link){
      return this.http.request<LinkCollection<LinkCollection<Barber>[]>>(link.Method,link.Href).pipe(
        tap((data:LinkCollection<LinkCollection<Barber>[]>)=>{
            this._barbersPag.next(data);
        })
      );
    }
    return undefined;
  }

  getBarber(link:Link){
    return this.http.request<LinkCollection<Barber>>(link.Method,link.Href);
  }

  addBarber(barber:Barber){
    const link=this.accountService.getCreateBarberLink();
    if(link){
      return this.http.request(link.Method,link.Href,{body:barber});
    }
    return undefined;
  }

  setBarberLink(link:Link | undefined){
    this.getBarberIdLink=link;
  }

  getBarberLink(){
    return this.getBarberIdLink;
  }

  updateBarber(barber:Barber,link:Link){
    return this.http.request(link.Method,link.Href,{body:barber});
  }
  
  get MaxPages():number{
    return this.maxPagesPagination;
  }

}
