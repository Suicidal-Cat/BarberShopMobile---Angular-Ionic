import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { IonModalCustomEvent,OverlayEventDetail } from '@ionic/core';
import { AccountService } from 'src/app/services/Account/account.service';

@Component({
  selector: 'app-email-confirm-modal',
  templateUrl: './email-confirm-modal.component.html',
  styleUrls: ['./email-confirm-modal.component.scss'],
})
export class EmailConfirmModalComponent  implements OnInit {

  @Input() isOpen:boolean=false;
  @Output() closeModal=new EventEmitter<Boolean>();
  @ViewChild(IonModal) modal!:IonModal;
  showError:boolean=false;
  responseMessage:string='';

  constructor(private accountService:AccountService) { }

  ngOnInit() {}

  onWillDismiss($event: IonModalCustomEvent<OverlayEventDetail<any>>) {
    this.closeModal.emit(false);
    this.showError=false;
    this.responseMessage='';
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
