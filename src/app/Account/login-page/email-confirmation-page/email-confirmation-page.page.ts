import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AccountService } from 'src/app/services/Account/account.service';

@Component({
  selector: 'app-email-confirmation-page',
  templateUrl: './email-confirmation-page.page.html',
  styleUrls: ['./email-confirmation-page.page.scss'],
})
export class EmailConfirmationPagePage implements OnInit {

  constructor(private accountService:AccountService) { }

  showError:boolean=false;
  responseMessage:string='';

  ngOnInit() {
  }

  sendLinkEmail(emailForm: NgForm) {
    console.log(emailForm.value);
    this.accountService.resendEmailConfirmation(emailForm.value["Email"]).subscribe({
      next: (data)=>{
        this.showError=false;
        this.responseMessage="Confirmation link is sent. Please confirm your email.";
      },
      error:(error)=>{
        console.log(error.error);
        this.responseMessage=error.error;
        this.showError=true;
      }
    });
  }

}
