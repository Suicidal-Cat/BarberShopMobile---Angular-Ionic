import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { Login } from 'src/app/models/Account/login';
import { Register } from 'src/app/models/Account/register';
import { User } from 'src/app/models/Account/user';
import { Link } from 'src/app/models/Hateoas/Link';
import { LinkCollection } from 'src/app/models/Hateoas/LinkCollection';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private loggedUser:User | null=null;
  private rootLinks!:Link[];

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
        map((user:LinkCollection<User>)=>{
          if(user){
            this.setUser(user.value);
            console.log(user.value);
          }
        })
      );
    }
    return undefined;
  }

  logout(){
    localStorage.removeItem(environment.userKey);
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
          this.setUser(user.value);
        }
      })
    );

  }

  getJWT():string | null{
    const key=localStorage.getItem(environment.userKey);
    if(key){
      const user=JSON.parse(key);
      return user.jwt;
    }
    else return null;
  }

  isAuthenticated(){
    const key=localStorage.getItem(environment.userKey);
    if(key){
      const user:User=JSON.parse(key);
      if(user)return true;
    }
    return false;
  }

  resendEmailConfirmation(email:string){
    const link=this.rootLinks.find((link)=>link.Rel=="resendEmail");
    if(link==undefined)return undefined;
    return this.http.request(link.Method,`${link.Href}/${email}`,{body:{}});
  }

  sendPasswordResetLink(email:string){
    const link=this.rootLinks.find((link)=>link.Rel=="forgotPassword");
    if(link==undefined)return undefined;
    return this.http.request(link.Method,`${link.Href}/${email}`,{body:{}});
  }

  rootNavigation(){
    let headers=new HttpHeaders();
    headers=headers.set('Accept','application/vnd.barber.hateoas+json');
    this.http.get<LinkCollection<string>>(`${environment.appUrl}/mobile`,{headers}).subscribe({
      next:(value:LinkCollection<string>)=>{this.rootLinks=value.Links;},
      error:(error)=>console.log(error)
    })
  }
}
