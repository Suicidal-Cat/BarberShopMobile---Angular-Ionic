import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs';
import { Login } from 'src/app/models/Account/login';
import { Register } from 'src/app/models/Account/register';
import { User } from 'src/app/models/Account/user';
import { Appointment } from 'src/app/models/Appointment/Appointment';
import { Link } from 'src/app/models/Hateoas/Link';
import { LinkCollection } from 'src/app/models/Hateoas/LinkCollection';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private loggedUser:User | null=null;
  private rootLinks!:Link[];
  private userLinks!:Link[];

  constructor(private http:HttpClient,private router:Router) {
   }

  register(model:Register){
    const link=this.rootLinks.find((link)=>link.Rel=="register");
    if(link!=undefined){
      return this.http.request(link.Method,link.Href,{body:model});
    }
    else return undefined;
  }

  login(model:Login){
    const link=this.rootLinks.find((link)=>link.Rel=="login");
    if(link!=undefined){
      return this.http.request<LinkCollection<User>>(link.Method,link?.Href,{body:model}).pipe(
        tap((user:LinkCollection<User>)=>{
          if(user){
            this.setUser(user.Value);
            this.userLinks=user.Links;
            localStorage.setItem("userLinks",JSON.stringify(this.userLinks));
          }
        })
      );
    }
    return undefined;
  }

  logout(){
    localStorage.removeItem(environment.userKey);
    localStorage.removeItem("userLinks");
    this.loggedUser=null;
    this.router.navigateByUrl('/login');
  }

  setUser(user:User){
    localStorage.setItem(environment.userKey,JSON.stringify(user));
    this.loggedUser=user;
  }

  getLoggedUser(){
    return this.loggedUser;
  }

  getUserFromStorage(){
    const key=localStorage.getItem(environment.userKey);
    if(key){
      const user:User=JSON.parse(key);
      return user.JWT;
    }
    else return null;
  }

  refreshUser(jwt:string | null){
    if(jwt===null){
      this.loggedUser=null;
      return undefined;
    }

    if(this.rootLinks==undefined){
      return undefined;
    }

    const link=this.rootLinks.find((link)=>link.Rel=="refreshToken");
    if(link==undefined)return undefined;
    let headers=new HttpHeaders();
    headers=headers.set('Authorization','Bearer '+ jwt);
    return this.http.request<LinkCollection<User>>(link.Method,link.Href,{headers}).pipe(
      map((user:LinkCollection<User>)=>{
        if(user){
          this.setUser(user.Value);
          this.userLinks=user.Links;
        }
      })
    );

  }

  getJWT():string | null{
    const key=localStorage.getItem(environment.userKey);
    if(key){
      const user=JSON.parse(key);
      return user.JWT;
    } 
    else return null;
  }

  isAuthenticated(){
    const key=localStorage.getItem(environment.userKey);
    if(key){
      const user:User=JSON.parse(key);
      //moras date isto da uzmes u obzir
      if(user)return true;
    }
    return false;
  }

  getLatestAppointmentLink(){
    const link=this.userLinks.find((link)=>link.Rel=="latestAppointment");
    if(link==undefined)return undefined;
    else return link;
  }

  getAllAppointmentsLink(date:string){
    const link=this.userLinks.find((link)=>link.Rel=="getAllAppointments");
    if(link==undefined)return undefined;
    const href=link.Href.replace("date",date);
    const newLink:Link={Href:href,Method:link.Method,Rel:link.Rel}
    return newLink;
  }

  resendEmailConfirmation(email:string){
    const link=this.rootLinks.find((link)=>link.Rel=="resendEmail");
    if(link==undefined)return undefined;
    const hrefMail=link.Href.replace("/email",`/${email}`);
    return this.http.request(link.Method,hrefMail,{body:{}});
  }

  sendPasswordResetLink(email:string){
    const link=this.rootLinks.find((link)=>link.Rel=="forgotPassword");
    if(link==undefined)return undefined;
    const hrefMail=link.Href.replace("/email",`/${email}`);
    return this.http.request(link.Method,hrefMail,{body:{}});
  }

  rootNavigation(){
    let headers=new HttpHeaders();
    headers=headers.set('Accept','application/vnd.barber.hateoas+json');
    this.http.get<LinkCollection<string>>(`${environment.appUrl}/mobile`,{headers}).subscribe({
      next:(value:LinkCollection<string>)=>{
        this.rootLinks=value.Links;
        localStorage.setItem("rootLinks",JSON.stringify(this.rootLinks));
        console.log(this.rootLinks);
      },
      error:(error)=>console.log(error)
    })
  }

  getServicePaginationLink(){
    const link=this.userLinks.find((link)=>link.Rel=="servicePagination");
    if(link==undefined)return undefined;
    else return link;
  }

  getCreateServiceLink(){
    const link=this.userLinks.find((link)=>link.Rel=="createService");
    if(link==undefined)return undefined;
    else return link;
  }

  getServiceCategoriesLink(){
    const link=this.userLinks.find((link)=>link.Rel=="serviceCategories");
    if(link==undefined)return undefined;
    else return link;
  }

  getBarberPaginationLink(){
    const link=this.userLinks.find((link)=>link.Rel=="barberPagination");
    if(link==undefined)return undefined;
    else return link;
  }

  getServicesLink(){
    const link=this.userLinks.find((link)=>link.Rel=="allServices");
    if(link==undefined)return undefined;
    else return link;
  }

  getBarberLink(){
    const link=this.userLinks.find((link)=>link.Rel=="allBarbers");
    if(link==undefined)return undefined;
    else return link;
  }


  refreshService(){
    const rLinks=localStorage.getItem("rootLinks");
    if(rLinks)this.rootLinks=JSON.parse(rLinks);
    else this.rootNavigation();

    const key=localStorage.getItem(environment.userKey);
    if(key){
      const u:User=JSON.parse(key);
      this.setUser(u);
      this.loggedUser=u;
    }else this.logout();

    const userLinks=localStorage.getItem("userLinks");
    if(userLinks)this.userLinks=JSON.parse(userLinks);
    else this.logout();

  }

  getUser(){
    const key=localStorage.getItem(environment.userKey);
    if(key){
      const user:User=JSON.parse(key);
      return user;
    }
    else return null;
  }


}
