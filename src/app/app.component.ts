import { Component, OnInit } from '@angular/core';
import { AccountService } from './services/Account/account.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  constructor(private accountService:AccountService) {
  }

  ngOnInit(): void {
    this.accountService.refreshService();
  }

  // private checkUser(){
  //   const jwt=this.accountService.getJWT();
  //   if(jwt!=null){
  //     const result=this.accountService.refreshUser(jwt);
  //     if(result!=undefined)result.subscribe();
  //   }
  // }
}
