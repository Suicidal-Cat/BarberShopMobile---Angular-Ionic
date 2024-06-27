import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from '../services/Account/account.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private accountService:AccountService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const jwt=this.accountService.getJWT();
    if(jwt){
      request=request.clone({
        setHeaders:{
          Authorization: `Bearer ${jwt}`,
          Accept: "application/vnd.barber.hateoas+json"
        }
      });
    }
    else {
      request=request.clone({
        setHeaders:{
          Accept: "application/vnd.barber.hateoas+json"
        }
      });
    }
    return next.handle(request);
  }
}
