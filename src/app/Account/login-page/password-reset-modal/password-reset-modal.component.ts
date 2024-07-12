import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { IonModalCustomEvent,OverlayEventDetail } from '@ionic/core';
import { AccountService } from 'src/app/services/Account/account.service';

@Component({
  selector: 'app-password-reset-modal',
  templateUrl: './password-reset-modal.component.html',
  styleUrls: ['./password-reset-modal.component.scss'],
})
export class PasswordResetModalComponent  implements OnInit {

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
    this.responseMessage="";
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
