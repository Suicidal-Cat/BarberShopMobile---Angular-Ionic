import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/Account/account.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent  implements OnInit {

  constructor(private router:Router,private accountSerive:AccountService) { }

  ngOnInit() {}

  navigateToHome(){
    if(this.accountSerive.getUser()?.Role!='Admin')this.router.navigateByUrl('home');
  }

  logout(){
    this.accountSerive.logout();
  }

}
