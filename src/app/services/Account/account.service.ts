import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from 'src/app/models/Account/login';
import { Register } from 'src/app/models/Account/register';
import { User } from 'src/app/models/Account/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http:HttpClient) { }

  register(model:Register){
    return this.http.post(`${environment.appUrl}/mobile/account/register`,model,{responseType: 'text'});
  }

  login(model:Login){
    return this.http.post(`${environment.appUrl}/mobile/account/login`,model);
  }
}
