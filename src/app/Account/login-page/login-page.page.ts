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

  emailModal:boolean=false;
  passwordModal:boolean=false;

  constructor(private accountService:AccountService,private router:Router) { }

  ngOnInit() {
    if(this.accountService.isAuthenticated())this.router.navigateByUrl("/home");
  }

  loginUser(loginForm:NgForm){
    this.showSpinner=true;
    const login=this.accountService.login(loginForm.value);
    if(login==undefined){
      this.showError=true;
      this.showSpinner=false;
      this.errorMessage="There is something wrong. Please try again later."
    }
    else {
      login.subscribe({
        next:(response)=>{
          this.showSpinner=false;
          if(response.Value.Role=='Admin')this.router.navigateByUrl("/home/tabs/reservations");
          else this.router.navigateByUrl("/home");
          
        },
        error:(error)=>{
          if(error.status==0 || error.status==500)this.errorMessage="There is something wrong. Please try again later."
          else this.errorMessage=error.error;
          this.showError=true;
          this.showSpinner=false;
        }
      })
    }
  }

  showEmailModal(){
    this.emailModal=true;
  }

  closeEmailModal() {
    this.emailModal=false;
  }

  showPasswordModal(){
    this.passwordModal=true;
  }

  closePasswordModal() {
    this.passwordModal=false;
  }

}
