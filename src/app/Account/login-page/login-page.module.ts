import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPagePageRoutingModule } from './login-page-routing.module';

import { LoginPagePage } from './login-page.page';
import { EmailConfirmModalComponent } from './email-confirm-modal/email-confirm-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPagePageRoutingModule
  ],
  declarations: [LoginPagePage,EmailConfirmModalComponent]
})
export class LoginPagePageModule {}
