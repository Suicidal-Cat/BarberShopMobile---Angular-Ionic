import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppointmentDatePagePageRoutingModule } from './appointment-date-page-routing.module';

import { AppointmentDatePagePage } from './appointment-date-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppointmentDatePagePageRoutingModule
  ],
  declarations: [AppointmentDatePagePage]
})
export class AppointmentDatePagePageModule {}
