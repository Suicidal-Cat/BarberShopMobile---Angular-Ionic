import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { Login } from 'src/app/models/Account/login';
import { Register } from 'src/app/models/Account/register';
import { User } from 'src/app/models/Account/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private loggedUser:User | null=null;

  constructor(private http:HttpClient,private router:Router) { }

  register(model:Register){
    return this.http.post(`${environment.appUrl}/mobile/account/register`,model,{responseType: 'text'});
  }

  login(model:Login){
    return this.http.post<User>(`${environment.appUrl}/mobile/account/login`,model).pipe(
      map((user:User)=>{
        if(user){
          this.setUser(user);
          //return user;
        }
        //return null;
      })
    );;
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

    let headers=new HttpHeaders();
    headers=headers.set('Authorization','Bearer '+ jwt);
    return this.http.get<User>(`${environment.appUrl}/mobile/account/refreshToken`,{headers}).pipe(
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
    return this.http.post(`${environment.appUrl}/mobile/account/resend-email-confirmation/${email}`,{});
  }

  sendPasswordResetLink(email:string){
    return this.http.post(`${environment.appUrl}/mobile/account/forgotPassword/${email}`,{});
  }
}
