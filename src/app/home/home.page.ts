import { Component } from '@angular/core';
import { AccountService } from '../services/Account/account.service';
import { Router } from '@angular/router';
import { User } from '../models/Account/user';
import { ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements ViewWillEnter{

  user!:User | null;
  selectedTab!:HTMLElement | null;

  constructor(private accountService:AccountService,private router:Router) {
    this.user=accountService.getUser();
    if(this.user==null){
      this.router.navigateByUrl("/login")
    }

    if(accountService.getUser()?.Role=='Admin')this.router.navigateByUrl("/home/tabs/reservations")

  }

  ionViewWillEnter(): void {
    this.selectedTab=document.querySelector(".default");
  }

  changeIcon(event: MouseEvent) {
    const image=event.target as HTMLElement;
    if(image==this.selectedTab)return;
    const path=image.getAttribute("src");

    if(path){
      if(path?.includes("US"))image.setAttribute("src",path.replace("US",""));
      else image.setAttribute("src", path.replace(".svg", "US.svg"));
    };

    if(this.selectedTab){
      const pathSelected=this.selectedTab.getAttribute("src");
      if(pathSelected)this.selectedTab.setAttribute("src",pathSelected.replace(".svg", "US.svg"));
      this.selectedTab=image;
    }


  }

}
