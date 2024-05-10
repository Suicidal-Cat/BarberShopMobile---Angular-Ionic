import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AccountService } from '../services/Account/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.page.html',
  styleUrls: ['./login-page.page.scss'],
})
export class LoginPagePage implements OnInit {

  showSpinner=false;
  showError=false;

  constructor(private accountService:AccountService,private router:Router) { }

  ngOnInit() {
  }

  loginUser(loginForm:NgForm){
    this.showSpinner=true;
    this.accountService.login(loginForm.value).subscribe({
      next:(response)=>{
        console.log(response);
        this.router.navigateByUrl("/home");
        this.showSpinner=false;
      },
      error:(error)=>{
        this.showError=true;
        this.showSpinner=false;
      }
    })
  }

}
