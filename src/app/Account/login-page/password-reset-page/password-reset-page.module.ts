import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PasswordResetPagePageRoutingModule } from './password-reset-page-routing.module';

import { PasswordResetPagePage } from './password-reset-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PasswordResetPagePageRoutingModule
  ],
  declarations: [PasswordResetPagePage]
})
export class PasswordResetPagePageModule {}
