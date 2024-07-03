import { Component } from '@angular/core';
import { AccountService } from '../services/Account/account.service';
import { Router } from '@angular/router';
import { User } from '../models/Account/user';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  user!:User | null;
  constructor(private accountService:AccountService,private router:Router) {
    this.user=accountService.getUser();
    if(this.user==null){
      this.router.navigateByUrl("/login")
    }
  }



}
