import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AccountService } from '../../services/Account/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.page.html',
  styleUrls: ['./login-page.page.scss'],
})
export class LoginPagePage implements OnInit {

  showSpinner=false;
  showError=false;
  errorMessage!:string;

  constructor(private accountService:AccountService,private router:Router) { }

  ngOnInit() {
    if(this.accountService.isAuthenticated())this.router.navigateByUrl("/home");
  }

  loginUser(loginForm:NgForm){
    this.showSpinner=true;
    this.accountService.login(loginForm.value).subscribe({
      next:(response)=>{
        this.router.navigateByUrl("/home");
        this.showSpinner=false;
      },
      error:(error)=>{
        console.log(error);
        if(error.status==0 || error.status==500)this.errorMessage="There is something wrong. Please try again later."
        else this.errorMessage=error.error;
        this.showError=true;
        this.showSpinner=false;
      }
    })
  }

}
