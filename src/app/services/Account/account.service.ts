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

  constructor(private http:HttpClient,private router:Router) { }

  register(model:Register){
    const link=this.rootLinks.find((link)=>link.rel=="register");
    if(link!=undefined){
      return this.http.request(link.method,link.href,{body:model});
    }
    else return undefined;
  }

  login(model:Login){
    const link=this.rootLinks.find((link)=>link.rel=="login");
    if(link!=undefined){
      return this.http.request<User>(link.method,link?.href,{body:model}).pipe(
        map((user:User)=>{
          if(user){
            this.setUser(user);
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
      console.log("da")
      return undefined;
    }
    const link=this.rootLinks.find((link)=>link.rel=="refreshToken");
    if(link==undefined)return undefined;
    let headers=new HttpHeaders();
    headers=headers.set('Authorization','Bearer '+ jwt);

    return this.http.request<User>(link.method,link.href,{headers}).pipe(
      map((user:User)=>{
        if(user){
          this.setUser(user);
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
    const link=this.rootLinks.find((link)=>link.rel=="resendEmail");
    if(link==undefined)return undefined;
    return this.http.request(link.method,`${link.href}/${email}`,{body:{}});
  }

  sendPasswordResetLink(email:string){
    const link=this.rootLinks.find((link)=>link.rel=="forgotPassword");
    if(link==undefined)return undefined;
    return this.http.request(link.method,`${link.href}/${email}`,{body:{}});
  }

  rootNavigation(){
    let headers=new HttpHeaders();
    headers=headers.set('Accept','application/vnd.barber.hateoas+json');
    this.http.get<LinkCollection<string>>(`${environment.appUrl}/mobile`,{headers}).subscribe({
      next:(value:LinkCollection<string>)=>{this.rootLinks=value.links},
      error:(error)=>console.log(error)
    })
  }
}
