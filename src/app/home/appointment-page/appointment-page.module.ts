import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppointmentPagePageRoutingModule } from './appointment-page-routing.module';

import { AppointmentPagePage } from './appointment-page.page';
import { SharedModule } from '../util-components/shared/shared.module';
import { ChoseServicesComponent } from './chose-services/chose-services.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppointmentPagePageRoutingModule,
    SharedModule
  ],
  declarations: [AppointmentPagePage,ChoseServicesComponent]
})
export class AppointmentPagePageModule {}
