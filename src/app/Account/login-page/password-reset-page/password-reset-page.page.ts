import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AccountService } from 'src/app/services/Account/account.service';

@Component({
  selector: 'app-password-reset-page',
  templateUrl: './password-reset-page.page.html',
  styleUrls: ['./password-reset-page.page.scss'],
})
export class PasswordResetPagePage implements OnInit {

  constructor(private accountService:AccountService) { }
  showError:boolean=false;
  responseMessage:string='';

  ngOnInit() {
  }

  sendLinkPassword(passwordForm: NgForm) {
    this.accountService.sendPasswordResetLink(passwordForm.value["Email"]).subscribe({
      next: (data)=>{
        this.showError=false;
        this.responseMessage="Please check your email to reset your password. ";
      },
      error:(error)=>{
        this.responseMessage=error.error;
        this.showError=true;
      }
    });
  }

}
