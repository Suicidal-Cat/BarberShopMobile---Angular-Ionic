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
    const resendPassword=this.accountService.sendPasswordResetLink(passwordForm.value["Email"]);
    if(resendPassword==undefined){
      this.responseMessage="There is something wrong. Please try again later.";
      this.showError=true;
      return;
    }
    resendPassword.subscribe({
      next: (data:any)=>{
        this.showError=false;
        this.responseMessage=data.message as string;
      },
      error:(error)=>{
        this.responseMessage=error.error;
        this.showError=true;
      }
    });
  }

}
