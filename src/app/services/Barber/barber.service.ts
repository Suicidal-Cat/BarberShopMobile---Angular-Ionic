import { HttpClient } from '@angular/common/http';
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

  constructor(private http: HttpClient,private accountService:AccountService) { }

  getBarbersPagination(linkHref:string=""){
    const link:Link | undefined=this.accountService.getBarberPaginationLink();
    if(link){
      if(linkHref=="")linkHref=link.Href;
      return this.http.request<LinkCollection<LinkCollection<Barber>[]>>(link.Method,linkHref).pipe(
          tap((data:LinkCollection<LinkCollection<Barber>[]>)=>{
            console.log(data)
            this._barbersPag.next(data);
          })
        )
    }
    return undefined;
  }

  


}
