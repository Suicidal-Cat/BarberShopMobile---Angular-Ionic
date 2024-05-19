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
    const resendEmail=this.accountService.resendEmailConfirmation(emailForm.value["Email"]);
    if(resendEmail==undefined){
      this.responseMessage="There is something wrong. Please try again later.";
      this.showError=true;
      return;
    }
    resendEmail.subscribe({
      next: (data:any)=>{
        console.log(data);
        this.showError=false;
        this.responseMessage=data.message as string;
      },
      error:(error)=>{
        console.log(error.error);
        this.responseMessage=error.error;
        this.showError=true;
      },
      
    });
  }

}
