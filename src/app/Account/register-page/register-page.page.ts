import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AccountService } from '../../services/Account/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.page.html',
  styleUrls: ['./register-page.page.scss'],
})
export class RegisterPagePage implements OnInit {

  showSpinner=false;
  emailExists=false;
  showError=false;
  isAlertOpen=false;

  constructor(private accountService:AccountService,private router:Router) { }

  ngOnInit() {
    if(this.accountService.isAuthenticated())this.router.navigateByUrl("/home");
  }

  registerUser(registerForm:NgForm){
    this.showSpinner=true;

    delete registerForm.value['ConfirmPassword'];
    const register=this.accountService.register(registerForm.value);
    if(register==undefined){
      this.emailExists=false;
      this.showError=true;
      this.showSpinner=false;
      return;
    }
    register.subscribe({
      next:(response) =>{
        this.showSpinner=false;
        this.emailExists=false;
        this.setAlertOpen(true);
      },
      error: error =>{
        console.log(error.error);
        if(error.error=="Email is already taken!")this.emailExists=true;
        else {
          this.emailExists=false;
          this.showError=true;
        }
        this.showSpinner=false;
      }
    });
  }

  setAlertOpen(isOpen:boolean){
    this.isAlertOpen=isOpen;
    if(this.isAlertOpen==false)this.router.navigateByUrl("/login");
  }
}
