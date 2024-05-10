import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AccountService } from '../services/Account/account.service';
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

  constructor(private accountService:AccountService,private router:Router) { }

  ngOnInit() {
  }

  registerUser(registerForm:NgForm){
    this.showSpinner=true;

    delete registerForm.value['ConfirmPassword'];
    this.accountService.register(registerForm.value).subscribe({
      next:(response) =>{
        this.showSpinner=false;
        this.emailExists=false;
        this.router.navigateByUrl("/login");
      },
      error: error =>{
        //this.showError=true;
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
}
