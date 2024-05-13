import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmailConfirmationPagePageRoutingModule } from './email-confirmation-page-routing.module';

import { EmailConfirmationPagePage } from './email-confirmation-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmailConfirmationPagePageRoutingModule
  ],
  declarations: [EmailConfirmationPagePage]
})
export class EmailConfirmationPagePageModule {}
